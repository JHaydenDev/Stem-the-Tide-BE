const db = require("../data/dbConfig");

module.exports = {
  find,
  findBy,
  findById,
  add,
  remove
};

function find() {
  return db("users").select("id", "username");
}

function findBy(filter) {
  return db("users")
    .where(filter)
    .first();
}

function findById(id) {
  return db("users")
    .where({ id })
    .first();
}

async function add(user) {
  const [id] = await db("users").insert(user, "id");

  return findById(id);
}

function remove(id) {
  return db("users")
    .where("id", id)
    .del();
}
