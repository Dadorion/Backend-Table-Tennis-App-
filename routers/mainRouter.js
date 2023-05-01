import { Router } from "express"
import competitionRouter from "./CompetitionRouter.js"
import userRouter from "./UserRouter.js"
import playerRouter from "./PlayerRouter.js"
import tournamentRouter from "./TournamentRouter.js"
import notificationRouter from "./NotificationRouter.js"

const router = new Router()

router.use('/users', userRouter)
router.use('/players', playerRouter)
router.use('/competitions', competitionRouter)
router.use('/tournaments', tournamentRouter)
router.use('/notifications', notificationRouter)
// router.use('/tournaments', (req, res) => { })
// router.use('/games', (req, res) => { })

export default router
