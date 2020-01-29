const express = require("express");
const helmet = require("helmet");
const apiRouter = require("./api-router.js");


const server = express();


server.use(helmet());
server.use(express.json());


server.use("/api", apiRouter);
server.get("/", (req, res) => {
  res.send("<h1>Hi from heroku<h1>");
});
module.exports = server;
