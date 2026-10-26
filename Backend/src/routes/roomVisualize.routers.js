import { Router } from "express";
import { roomVisualize } from "../controllers/roomVisualize.controller.js";

const router = Router();

router.post("/ai/room-visualize", roomVisualize);

export default router;
