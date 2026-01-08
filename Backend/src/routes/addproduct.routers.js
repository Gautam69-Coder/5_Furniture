import { AddProduct } from "../controllers/addproduct.js";
import { Router } from "express";

const router = Router();

router.route("/addproduct").post(AddProduct);

export default router;