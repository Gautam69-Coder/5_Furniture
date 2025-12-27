import mongoose from "mongoose";

const orderSummarySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        order: [
            {
                orderId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Order",
                    required: true
                }
            }
        ],
        totalItems: {
            type: Number,
        },
        totalAmount: {
            type: Number,
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "COMPLETED", "FAILED"],
            default: "PENDING"
        }
    },
    { timestamps: true }
);

export const OrderSummary = mongoose.model(
    "OrderSummary",
    orderSummarySchema
);