import sendWhatsApp from "../utils/sendWhatsApp.js";
import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js';

export const sendMessage = async (req, res) => {
    try {
        const { phone, message } = req.body;

        if (!phone || !message) {
            throw new ApiError(400, "Phone and message are required")
        }

        console.log(message)
        console.log(phone)

        await sendWhatsApp({
            to: phone,
            message,
        });

        return res
            .status(200)
            .json(
                new ApiResponse(200, "WhatsApp message sent successfully")
            )
    } catch (error) {
       throw new ApiError(500,"Failed to send WhatsApp message")
    }
};
