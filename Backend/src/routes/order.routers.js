import { MyOrder,getAllOrders } from "../controllers/order.controllers.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();
router.route("/myorders").get(verifyJWT, MyOrder);
router.route("/admin/orders").get(getAllOrders);
export default router;