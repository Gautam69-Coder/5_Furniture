import { Router } from "express";
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../controllers/banner.controllers.js";

const router = Router();

router.route("/banners").get(getAllBanners).post(createBanner);
router.route("/banners/:id").put(updateBanner).patch(updateBanner).delete(deleteBanner);

export default router;
