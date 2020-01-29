const router = require("express").Router();

const Users = require("./usersModel");

//GETs all Users
router.get("/", (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json(rrror);
    });
});

module.exports = router;