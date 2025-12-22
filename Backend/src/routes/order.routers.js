import { MyOrder } from "../controllers/order.controllers.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();
router.route("/myorders").get(verifyJWT, MyOrder);

export default router;