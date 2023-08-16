import { Router } from "express"
import ProfileController from "../controllers/ProfileController.js"

const profileRouter = new Router()

profileRouter.get('/:id', ProfileController.getOne)

export default profileRouter
