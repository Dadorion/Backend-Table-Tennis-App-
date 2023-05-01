import { Router } from "express"
import CompetitionController from "../controllers/CompetitionControllers.js"

const competitionRouter = new Router()

competitionRouter.get('/', CompetitionController.getAll)
competitionRouter.get('/:id', CompetitionController.getOne)
competitionRouter.post('/', CompetitionController.create)
competitionRouter.put('/', CompetitionController.update)
competitionRouter.delete('/:id', CompetitionController.delete)

export default competitionRouter
