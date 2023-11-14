const Router = require("express").Router();
const controller = require("../controller/encomienda.controller");
const passport = require("passport");

Router.get("/:id", passport.authenticate("jwt"), controller.findOne);

Router.post("/ubicacion", passport.authenticate("jwt"), controller.findByUbication)

Router.post("/fecha", passport.authenticate("jwt"), controller.findByDate)

Router.post("/create", passport.authenticate("jwt"), controller.createOne);

Router.post("/", passport.authenticate("jwt"), controller.getAll);

Router.post("/:id", passport.authenticate("jwt"), controller.editGuia);


module.exports = Router;
