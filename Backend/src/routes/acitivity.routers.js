import { UserActivity,RecentlyViewed,Recommended } from "../controllers/activity.controllers.js";
import Router from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/track").post(verifyJWT,UserActivity);
router.route("/recently-view").get(verifyJWT,RecentlyViewed);
router.route("/recommended").get(verifyJWT,Recommended);

export default router