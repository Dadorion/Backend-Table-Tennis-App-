import { Router } from "express"
import competitionRouter from "./CompetitionRouter.js"
import userRouter from "./UserRouter.js"

const router = new Router()

router.use('/users', userRouter)
router.use('/competitions', competitionRouter)
// router.use('/tournaments', (req, res) => { })
// router.use('/games', (req, res) => { })

export default router 