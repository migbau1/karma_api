import { Router as router } from 'express'
import { parseFormData, sendDocument, sendMessage } from '../controller/wp.controller';

const Router = router();

Router.post('/message', sendMessage)
Router.post('/message/file',parseFormData, sendDocument)

export default Router