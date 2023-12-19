import { Router as router } from 'express'
import { createOne, getAll } from '../controller/sede.controller';

const Router = router()

Router.get("/", getAll);

Router.post("/", createOne);

export default Router;
