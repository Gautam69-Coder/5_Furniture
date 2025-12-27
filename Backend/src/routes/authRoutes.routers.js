import express from "express";
import { googleAuth } from "../controllers/authController.controllers.js";

const router = express.Router();

router.post("/google", googleAuth);


export default router;
