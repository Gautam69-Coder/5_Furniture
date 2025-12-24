import { CartData, CartGetData, DeleteItem, SetQuantity } from "../controllers/cart.controllers.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/cart").post(verifyJWT,CartData);
router.route("/cart").get(verifyJWT,CartGetData);
router.route("/quantity").post(SetQuantity);
router.route("/deleteItem").post(verifyJWT,DeleteItem);


export default router;

