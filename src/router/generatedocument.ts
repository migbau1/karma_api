import { Router as router } from 'express'
import passport from 'passport'
import exportEncomienda from '../utils/xlsxutil';
import { checkUserRole } from '../controller/access-control/login.controller';
import Roles from '../utils/roles/roles.pointer';
import { exportGuias, exportUsers } from '../controller/exports.controller';

const Router = router()

Router.get("/:id", passport.authenticate("jwt"), checkUserRole([Roles.admin]), exportEncomienda);


Router.post(
  "/reporteusuarios",
  passport.authenticate("jwt"),
  passport.authenticate("jwt"), checkUserRole([Roles.admin]),
  exportUsers
);
Router.post(
    "/reporteguias",
    passport.authenticate("jwt"), checkUserRole([Roles.admin]),
    exportGuias
);

export default Router;
