import { Router } from "express";
import NotificationController from "../controllers/NotificationControllers.js";

const notificationRouter = new Router();

notificationRouter.get("/", NotificationController.getAll);
notificationRouter.get("/:id", NotificationController.getAllForOnePlayer);
notificationRouter.get("/", NotificationController.create);
notificationRouter.get("/", NotificationController.update);
notificationRouter.get("/:id", NotificationController.delete);

export default notificationRouter;
