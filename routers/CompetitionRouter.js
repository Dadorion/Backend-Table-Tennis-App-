import { Router } from "express"
import CompetitionController from "../controllers/CompetitionControllers.js"

const competitionRouter = new Router()

competitionRouter.get('/', CompetitionController.getAll)
competitionRouter.get('/:id', CompetitionController.getOne)
competitionRouter.get('/', CompetitionController.create)
competitionRouter.get('/', CompetitionController.update)
competitionRouter.get('/:id', CompetitionController.delete)

export default competitionRouter