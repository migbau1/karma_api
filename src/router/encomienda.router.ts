import { Router as router } from 'express'
import { createOne, findAll } from '../controller/encomienda.controller'
import passport from 'passport'
import { checkUserRole } from '../controller/access-control/login.controller'
import Roles from '../utils/roles/roles.pointer'

const Router = router()

Router.get('/', passport.authenticate('jwt'), checkUserRole([Roles.admin]), findAll)

Router.post('/', passport.authenticate('jwt'), checkUserRole([Roles.admin]), createOne)

// Router.get("/:id", passport.authenticate("jwt"), findOne);

// Router.post("/ubicacion", passport.authenticate("jwt"), findByUbication)

// Router.post("/fecha", passport.authenticate("jwt"), findByDate)

// Router.post("/create", passport.authenticate("jwt"), createOne);

// Router.post("/", passport.authenticate("jwt"), getAll);

// Router.post("/:id", passport.authenticate("jwt"), editGuia);

export default Router;