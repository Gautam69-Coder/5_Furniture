import {
  MyOrder,
  getAllOrders,
  OrderMessage,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/order.controllers.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();
router.route("/myorders").get(verifyJWT, MyOrder);
router.route("/verify_order").post(verifyJWT, OrderMessage);
router.route("/admin/orders").get(getAllOrders);
router
  .route("/admin/orders/:orderId/status")
  .patch(updateOrderStatus)
  .put(updateOrderStatus);
router.route("/admin/orders/:orderId").delete(deleteOrder);

export default router;