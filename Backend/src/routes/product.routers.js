import { Router } from "express";
import { productData } from "../controllers/product.controllers.js";

const router=Router();

router.route("/product").get(productData);

export default router;
