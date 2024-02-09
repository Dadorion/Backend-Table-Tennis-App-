import { Router } from "express";
import MatchController from "../controllers/MatchController.js";

const matchRouter = new Router();

matchRouter.post("/new", MatchController.create);
matchRouter.post("/", MatchController.getAll);
matchRouter.get("/:id", MatchController.getPlayerMatches);

export default matchRouter;
