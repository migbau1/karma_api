import { Router as router } from 'express'
import { assignSede, createOne, getAll, updateOne } from '../controller/sede.controller';
import passport from 'passport';
import { checkUserRole } from '../controller/access-control/login.controller';
import Roles from '../utils/roles/roles.pointer';

const Router = router()

Router.get("/", passport.authenticate('jwt'), checkUserRole([Roles.admin]), getAll);

Router.post("/", passport.authenticate('jwt'), checkUserRole([Roles.admin]), createOne);

Router.put("/", passport.authenticate('jwt'), checkUserRole([Roles.admin]), updateOne);

Router.post("/assign", passport.authenticate('jwt'), checkUserRole([Roles.admin]), assignSede);

export default Router;
