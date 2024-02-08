import { Router } from "express"
import PlayerController from "../controllers/PlayerControllers.js"

const playerRouter = new Router()

playerRouter.get('/', PlayerController.getAll)
// playerRouter.post('/', PlayerController.getAllWithFilter)
playerRouter.post('/', PlayerController.getAllPredictive)
playerRouter.get('/:id', PlayerController.getOne)
playerRouter.post('/', PlayerController.create)
playerRouter.post('/add', PlayerController.createGhost)
playerRouter.put('/', PlayerController.update)
playerRouter.delete('/:id', PlayerController.delete)

export default playerRouter
