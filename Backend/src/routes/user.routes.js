import { Router } from "express"
import {logoutUser, OTPValidate, refreshAccesToken, registerUser} from '../controllers/user.controllers.js'
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const router = Router()

router.route("/register").post(registerUser)

router.route("/profile").get(verifyJWT,(req, res) => {
  res.json({ success: true, data: req.user });
})

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(refreshAccesToken)
export default router
