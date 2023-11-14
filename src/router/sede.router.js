const Router = require("express").Router();
const controller = require('../controller/sede.controller')

Router.get("/", controller.getAll);

Router.post("/", controller.createOne);

module.exports = Router;
