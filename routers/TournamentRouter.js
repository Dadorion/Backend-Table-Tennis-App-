import { Router } from "express"
import TournamentController from "../controllers/TournamentControllers.js"

const tournamentRouter = new Router()

tournamentRouter.get('/', TournamentController.getAll)
tournamentRouter.get('/:id', TournamentController.getOne)
tournamentRouter.post('/', TournamentController.create)
tournamentRouter.put('/', TournamentController.update)
tournamentRouter.delete('/:id', TournamentController.delete)

export default tournamentRouter 