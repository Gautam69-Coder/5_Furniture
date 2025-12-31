import { Router } from "express"
import {logoutUser, OTPValidate, refreshAccesToken, registerUser,getAllUsers,updateUserDetails,GetAddress} from '../controllers/user.controllers.js'
import { verifyJWT } from "../middlewares/auth.middlewares.js"

const router = Router()

router.route("/register").post(registerUser)

router.route("/profile").get(verifyJWT,(req, res) => {
  res.json({ success: true, data: req.user });
})

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(refreshAccesToken)

router.route("/users").get(getAllUsers)

router.route("/edit-profile").post(verifyJWT,updateUserDetails);

router.route("/address").get(verifyJWT,GetAddress);
export default router
