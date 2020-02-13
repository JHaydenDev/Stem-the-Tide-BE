const bcrypt = require("bcryptjs");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

const Users = require("../users/users-model");
const secrets = require("../config/secrets");
const { validateUser } = require("../users/user-helpers");

//Registers New User
router.post("/register", (req, res) => {
  let user = req.body;

  const validateResult = validateUser(user);

  if (validateResult.isSuccessful === true) {
    const hash = bcrypt.hashSync(user.password, 11);
    user.password = hash;

    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(error).json(error);
      });
  } else {
    res.status(400).json({
      message: "Invalid information",
      errors: validateResult.errors
    });
  }

  // switch (validateResult.isSuccessful) {
  //   case true:
  //     const hash = bcrypt.hashSync(user.password, 11);
  //     user.password = hash;

  //     Users.add(user)
  //       .then(saved => {
  //         res.status(201).json(saved);
  //       })
  //       .catch(error => {
  //         res.status(error).json(error);
  //       });
  //     break;
  //   case false:
  //     res.status(400).json({
  //       message: "Invalid information",
  //       errors: validateResult.errors
  //     });
  //     break;
  //   default:
  //     res.status(500).json(error);
  // }
});

//Logins with token
router.post("/login", (req, res) => {
  const validateResult = validateUser(req.body);

  if (!validateResult.isSuccessful) {
    res.status(400).json({ message: validateResult.errors });
    return;
  }

  let { username, password } = req.body;

  Users.findBy({ username })
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = getJwtToken(user);

        res.status(200).json({
          message: `Welcome ${username}`,
          token
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(error);
    });
});

function getJwtToken(user) {
  const payload = {
    user_id: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, secrets.JWT_SECRET, options);
}

module.exports = router;
