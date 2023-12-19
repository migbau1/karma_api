import { Router as router } from 'express'
import { createOne, editGuia, findByDate, findByUbication, findOne, getAll } from '../controller/encomienda.controller'
import passport from 'passport'

const Router = router()

Router.get("/:id", passport.authenticate("jwt"), findOne);

Router.post("/ubicacion", passport.authenticate("jwt"), findByUbication)

Router.post("/fecha", passport.authenticate("jwt"), findByDate)

Router.post("/create", passport.authenticate("jwt"), createOne);

Router.post("/", passport.authenticate("jwt"), getAll);

Router.post("/:id", passport.authenticate("jwt"), editGuia);

export default Router;