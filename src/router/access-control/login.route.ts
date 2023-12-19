import { Router as router } from 'express'
import passport from 'passport'
import { checkUserRole, loginPost, validateToken } from '../../controller/access-control/login.controller'
import Roles from '../../utils/roles/roles.pointer';

const Router = router();

Router.post("/", loginPost);

Router.post("/validate", passport.authenticate('jwt'), checkUserRole([Roles.admin]), validateToken);

export default Router;
