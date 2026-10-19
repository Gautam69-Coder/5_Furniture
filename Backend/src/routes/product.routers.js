import { Router } from "express";
import {
  productData,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controllers.js";

const router = Router();

router.route("/product").get(productData).post(createProduct);
router
  .route("/product/:id")
  .get(getProductById)
  .put(updateProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

export default router;
