import Order from "../models/order.models.js";
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js'

const MyOrder= asyncHandler(async (req, res) => {
    try {
        
        const userId = req.user._id;

        const orders = await Order.find({ userId });

        if(!orders) {
            throw new ApiError(404, "No orders found for this user");
        }

        return res.status(200).json(
            new ApiResponse(200, orders, "Orders fetched successfully")
        );

    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

export { MyOrder };