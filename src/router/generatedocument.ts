import { Router as router } from 'express'
import passport from 'passport'
import docsController from '../utils/xlsxutil'
import { exportGuias, exportUsers } from '../controller/exports.controller'

const Router = router()
// const passport = require("passport");
// const docsController = require("../utils/xlsxutil");
// const controller = require("../controller/exports.controller");

Router.post("/", passport.authenticate("jwt"), docsController);
Router.post(
  "/reporteusuarios",
  passport.authenticate("jwt"),
  exportUsers
);
Router.post(
  "/reporteguias",
  passport.authenticate("jwt"),
  exportGuias
);

export default Router;
