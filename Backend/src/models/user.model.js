import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            index: true // for more effecent way to search 
        },
        lastName: {
            type: String,
            trim: true
        },
        avatar: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
            unique: true,
            sparse: true,
            default: undefined
        },
        refreshToken: {
            type: String
        },
    },
    {
        timestamps: true
    }
)


//user Accesstoken generate
userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email,
    },
        process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}


userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
    )
}

export const User = mongoose.model("User", userSchema)