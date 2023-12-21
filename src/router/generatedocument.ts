import { Router as router } from 'express'
import passport from 'passport'
import exportEncomienda from '../utils/xlsxutil';
// import { exportGuias, exportUsers } from '../controller/exports.controller'

const Router = router()

Router.get("/:id", passport.authenticate("jwt"), exportEncomienda);


// Router.post(
//   "/reporteusuarios",
//   passport.authenticate("jwt"),
//   exportUsers
// );
// Router.post(
//   "/reporteguias",
//   passport.authenticate("jwt"),
//   exportGuias
// );

export default Router;
