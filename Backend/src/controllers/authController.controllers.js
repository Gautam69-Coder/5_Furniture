import admin from "../config/firebaseAdmin.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

export const googleAuth = asyncHandler(async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token missing" });


    const decoded = await admin.auth().verifyIdToken(token);

    const { name, email, picture } = decoded;
    const [firstName, lastName] = name.trim().split(/\s+/);

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        firstName,
        lastName,
        email,
        avatar: picture,
        refreshToken: token
      });
    }

    // Create JWT
    const jwtToken = user.generateRefreshToken();

    user.refreshToken = jwtToken;
    await user.save();

    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json(new ApiResponse(200,jwtToken, "Login successful"));
  } catch (error) {
    console.log(error)
  }
});
