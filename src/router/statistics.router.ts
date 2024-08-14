import { Router as router } from 'express'
import { generatedGuides } from '../controller/statistics.controller';
const Router = router()

Router.post('/', generatedGuides)

export default Router;
