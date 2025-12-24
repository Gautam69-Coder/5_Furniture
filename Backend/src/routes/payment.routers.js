import { getPaymentStatus,CheckOut } from "../controllers/payment.controllers.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router();

router.route("/create-order").post(verifyJWT,CheckOut);
router.get("/status/:orderId", getPaymentStatus);

export default router;