import { Router as router } from 'express'
import passport from 'passport'
import { createOne, findAll, findOne, updateOne } from '../controller/user.controller'
import { checkUserRole } from '../controller/access-control/login.controller';
import Roles from '../utils/roles/roles.pointer';

const Router = router();

Router.get('/', passport.authenticate('jwt'), checkUserRole([Roles.admin]), findAll)

Router.get('/:id', passport.authenticate('jwt'), checkUserRole([Roles.admin]), findOne)

Router.post('/create', passport.authenticate('jwt'), checkUserRole([Roles.admin]), createOne)

Router.put('/update', passport.authenticate('jwt'), checkUserRole([Roles.admin, Roles.cliente]), updateOne)


export default Router