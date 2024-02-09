import { Router } from "express";
import userRouter from "./UserRouter.js";
import matchRouter from "./MatchRouter.js";
import playerRouter from "./PlayerRouter.js";
import profileRouter from "./ProfileRouter.js";
import statsRouter from "./StatsRouter.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkUserRoleMiddleware from "../middleware/roleMiddleware.js";

const router = new Router();

router.use("/users", authMiddleware, checkUserRoleMiddleware, userRouter);
router.use("/matches", authMiddleware, matchRouter);
router.use("/players", authMiddleware, playerRouter);
router.use("/profile", authMiddleware, profileRouter);
router.use("/stats", authMiddleware, statsRouter);

export default router;
