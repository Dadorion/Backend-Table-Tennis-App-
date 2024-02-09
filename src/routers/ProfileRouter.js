import { Router } from "express";
import ProfileController from "../controllers/ProfileController.js";
import upload from "../middleware/uploadAvatarMiddleware.js";

const profileRouter = new Router();

profileRouter.get("/me", ProfileController.getMyProfile);
profileRouter.put("/update_my_profile", ProfileController.updateMyProfile);
profileRouter.put("/update_my_status", ProfileController.updateMyStatus);
profileRouter.put(
  "/upload",
  upload.single("avatar"),
  ProfileController.uploadPhoto
);
profileRouter.get("/:id", ProfileController.getOne);

export default profileRouter;
