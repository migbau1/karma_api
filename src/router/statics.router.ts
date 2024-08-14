import { Router as router } from 'express'
import { generatedGuides } from '../controller/statics.controller';
const Router = router()

Router.post('/', generatedGuides)

export default Router;
