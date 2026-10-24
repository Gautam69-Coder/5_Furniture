import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import twilio from 'twilio'
import jwt from 'jsonwebtoken'
import { Address } from '../models/address.models.js';

// Generate and Refresh Token
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        // const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({
            validateBeforeSave: true
        })

        // return { accessToken, refreshToken }
        return { refreshToken }
    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong with refresh token")
    }
}

// Register User
const registerUser = asyncHandler(async (req, res) => {
    // Steps to Register user
    // get user deatils from frontend
    // check if the from user is empty or not
    // check user already exists or not
    // create user in db
    // Remove refresh token
    // store all data in db

    const { firstName, lastName, email, phoneNumber } = req.body


    if (!firstName || !email || !phoneNumber) {
        throw new ApiError(400, "All fields are required")
    }

    let user = await User.findOne({
        email
    })

    if (user) {
        const { refreshToken } = await generateAccessAndRefreshToken(user._id)

        const my = await User.findOneAndUpdate(
            { email: user.email },
            {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    phoneNumber: phoneNumber
                }
            },
            {
                new: true
            }
        )

        await my.save();


        const userCreated = await User.findById(user._id).select(
            "-refreshToken"
        )

        if (!userCreated) {
            throw new ApiError(500, "Something went wrong with registering by user")
        }

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }

        return res
            .status(200)
            .cookie("refreshToken", refreshToken, options)
            .cookie("token", refreshToken, options)
            .json(
                new ApiResponse(200, {
                    user: {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phoneNumber: user.phoneNumber
                    },
                    refreshToken
                }, "User created Successfully")
            )
    }

    user = await User.create({
        firstName: firstName.toLowerCase(),
        lastName,
        email,
        phoneNumber
    })

    const { refreshToken } = await generateAccessAndRefreshToken(user._id)

    const userCreated = await User.findById(user._id).select(
        "-refreshToken"
    )

    if (!userCreated) {
        throw new ApiError(500, "Something went wrong with registering by user")
    }

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }

    return res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("token", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: userCreated, refreshToken
            }, "User created Successfully")
        )
})

// Twilio for mobile OTP
const OTPValidate = asyncHandler(async (req, res) => {

    const { phoneNumber } = req.body;

    const accountSid = process.env.ACCOUNT_SID;
    const authToken = process.env.AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    const verification = await client.verify.v2
        .services(process.env.TWILIO_SERVICE_ID)
        .verifications.create({
            channel: "sms",
            to: `+91${phoneNumber}`,
        });

    res.status(200).json({
        success: true,
        status: verification.status
    });
});


const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            },
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }

    return res
        .status(200)
        .clearCookie("refreshToken", options)
        .clearCookie("token", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        )
})

const refreshAccesToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken || req.cookies?.token || req.body.refreshToken

        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized token")
        }

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid Refresh Token")
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token expired or used")
        }

        const { refreshToken } = await generateAccessAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        }

        return res
            .status(200)
            .cookie("refreshToken", refreshToken, options)
            .cookie("token", refreshToken, options)
            .json(
                new ApiResponse(200, { refreshToken }, "Token refreshed successfully")
            )

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})


//Get All Users - For Admin
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find().select("-refreshToken");

        return res
            .status(200)
            .json(
                new ApiResponse(200, users, "All Users Fetched Successfully")
            )
    } catch (error) {
        throw new ApiError(500, "Something went wrong while fetching users")
    }
})


//Upadate User details
const updateUserDetails = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "Not found user")
    }

    const { userUpdatedData, address } = req.body

    if (!userUpdatedData || !address) {
        throw new ApiError(400, "userUpdatedData or address are required ")
    }

    console.log(userUpdatedData);

    const updateProfile = await User.findOneAndUpdate(
        { _id: userId },
        {
            $set: userUpdatedData
        },
        { new: true }
    )

    let userAdd = address

    const userAddress = await Address.findOneAndUpdate(
        { userId: userId },
        {
            $set: userAdd
        },
        {
            new: true,
            upsert: true,
        }
    )

    if (!updateProfile) {
        throw new ApiError(400, "Profile not Updated")
    }

    console.log("User address : ",userAddress);
    console.log("User Profile update : ",updateProfile);

    res.status(200).json(
        new ApiResponse(200, "Profile Upated SuccessFully")
    )
})

// Get Address
const GetAddress = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!userId) {
        throw new ApiError(400, "Not found user id")
    }

    const address = await Address.findOne({ userId })

    res.status(200).json(
        new ApiResponse(200, address, "Get Address successfully")
    )
})

export { registerUser, OTPValidate, logoutUser, refreshAccesToken, getAllUsers, updateUserDetails, GetAddress }