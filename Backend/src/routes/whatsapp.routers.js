import { sendMessage } from "../controllers/whatsapp.controllers.js";
import { Router } from "express"

const router = Router()

router.route("/send").post(sendMessage)

export default router;
