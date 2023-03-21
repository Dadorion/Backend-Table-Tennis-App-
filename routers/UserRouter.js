import { Router } from "express"
// import UserController from "../controllers/UserControllers.js"

const userRouter = new Router()

userRouter.get('/', (req, res) => {
   res.json({ mesage: 'all works' })
})

export default userRouter