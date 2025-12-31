import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken || req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");

    if (!token) throw new ApiError(401, "Unauthorized request");
    // console.log("token",token)

    // Decode token
    const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    // console.log("decodedToken",decodedToken)

    // Use decodedToken.id (matches payload in generateJWT)
    const user = await User.findById(decodedToken?._id ||decodedToken?.id ).select("-password");
    // console.log("user",user)

    if (!user) throw new ApiError(401, "Invalid access Token");

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
