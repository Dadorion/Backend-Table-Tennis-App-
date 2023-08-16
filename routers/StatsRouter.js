import { Router } from "express"
import StatsController from "../controllers/StatsController.js"

const statsRouter = new Router()

statsRouter.get('/:id', StatsController.getOne)

export default statsRouter
