const Router = require("express").Router();
const controller = require('../controller/user.controller')
const passport = require('passport')

Router.get("/remitentes", controller.getRemitentes);

Router.post("/",passport.authenticate('jwt'), controller.getAll);

Router.post("/:cedula", controller.updateUser);

Router.get("/:cedula", controller.getByCedula);

Router.post("/api/create", controller.createOne);

Router.post("/api/search", controller.searchEngineUser);


module.exports = Router;
