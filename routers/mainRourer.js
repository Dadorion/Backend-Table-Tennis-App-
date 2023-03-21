import { Router } from "express"
import competitionRouter from "./CompetitionRouter.js"
// import userRouter from "./UserRouter.js"

const router = new Router()

// router.use('/profile', userRouter)
router.use('/competition', competitionRouter)
router.use('/tournaments', (req, res) => { })
router.use('/games', (req, res) => { })

export default router 