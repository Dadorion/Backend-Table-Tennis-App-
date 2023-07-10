import { Router } from "express"
import competitionRouter from "./CompetitionRouter.js"
import userRouter from "./UserRouter.js"
import matchRouter from "./MatchRouter.js"
import playerRouter from "./PlayerRouter.js"
import tournamentRouter from "./TournamentRouter.js"
import notificationRouter from "./NotificationRouter.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = new Router()

router.use('/users', authMiddleware, userRouter) //ok
router.use('/matchRouter', authMiddleware, matchRouter)
router.use('/players', authMiddleware, playerRouter)
router.use('/competitions', authMiddleware, competitionRouter)
router.use('/tournaments', authMiddleware, tournamentRouter)
router.use('/notifications', authMiddleware, notificationRouter)


// Endpointes in development
// router.use('/tournaments', (req, res) => { })
// router.use('/games', (req, res) => { })

export default router
