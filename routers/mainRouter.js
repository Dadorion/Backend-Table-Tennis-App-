import { Router } from "express"
import userRouter from "./UserRouter.js"
import matchRouter from "./MatchRouter.js"
import playerRouter from "./PlayerRouter.js"
import profileRouter from "./ProfileRouter.js"
import statsRouter from "./StatsRouter.js"
// import notificationRouter from "./NotificationRouter.js"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = new Router()

router.use('/users', authMiddleware, userRouter) // дописать пагинацию
router.use('/matches', authMiddleware, matchRouter) // ~ok
router.use('/players', authMiddleware, playerRouter) // написать все
router.use('/profile', authMiddleware, profileRouter) // ~ok
router.use('/stats', authMiddleware, statsRouter) // ~ok


// Endpointes in development
// router.use('/notifications', authMiddleware, notificationRouter) // потом
// router.use('/tournaments', (req, res) => { })
// router.use('/games', (req, res) => { })

export default router
