import { Router as router } from 'express'
import { createOne, getAll, getByCedula, getRemitentes, searchEngineUser, updateUser } from '../controller/user.controller'
import passport from 'passport'

const Router = router();

Router.get("/remitentes", getRemitentes);

Router.post("/", passport.authenticate('jwt'), getAll);

Router.post("/:cedula", updateUser);

Router.get("/:cedula", getByCedula);

Router.post("/api/create", createOne);

Router.post("/api/search", searchEngineUser);

export default Router