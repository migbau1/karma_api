import { Router as router } from 'express'
import passport from 'passport'
import { registerUser } from '../../controller/access-control/register.controller'

const Router = router()

Router.post('/', registerUser)

export default Router