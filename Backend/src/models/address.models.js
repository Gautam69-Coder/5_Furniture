import mongoose from "mongoose";

const AddressScehema = new mongoose.Schema(
    {
        userId : {
            type:String,
            require : true,

        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        country: {
            type: String,
            required: true,
            default: "India",
        },
        pincode: {
            type: String,
            required: true,
        },
    },
    {
        timestamps : true
    }
)

const Address = mongoose.model("Address",AddressScehema)

export {Address}