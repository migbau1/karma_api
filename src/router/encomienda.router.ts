import { Router as router } from 'express'
import { createOne, findAll, findOne, updateOne } from '../controller/encomienda.controller'
import passport from 'passport'
import { checkUserRole } from '../controller/access-control/login.controller'
import Roles from '../utils/roles/roles.pointer'

const Router = router()

Router.get('/', passport.authenticate('jwt'), checkUserRole([Roles.admin]), findAll)

Router.get('/:id', passport.authenticate('jwt'), checkUserRole([Roles.admin]), findOne)

Router.post('/', passport.authenticate('jwt'), checkUserRole([Roles.admin]), createOne)

Router.put('/', passport.authenticate('jwt'), checkUserRole([Roles.admin]), updateOne)

export default Router;