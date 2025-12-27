import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order_details: [
        {
            items:
                [
                    {
                        item_id: {
                            type: String
                        },
                        item_name: {
                            type: String,
                        },
                        item_description: {
                            type: String
                        },
                        item_image_url: {
                            type: String
                        },
                        item_original_unit_price: {
                            type: String,
                        },
                        item_discounted_unit_price: {
                            type: String,
                        },
                        item_quantity: {
                            type: String,
                        },
                        item_currency: {
                            type: String
                        },
                        item_size: {
                            type: String
                        },
                        item_description: {
                            type: String
                        },
                        item_material: {
                            type: String
                        }
                    }
                ],
            user_address: [
                {
                    firstName: {
                        type: String,
                        required: true,
                        trim: true,
                    },
                    lastName: {
                        type: String,
                        required: true,
                        trim: true,
                    },
                    company: {
                        type: String,
                        trim: true,
                    },
                    phone: {
                        type: String,
                        required: true,
                        trim: true,
                    },
                    address: {
                        type: String,
                        required: true,
                        trim: true,
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
                    pin: {
                        type: String,
                        required: true,
                        minlength: 6,
                        maxlength: 6,
                    },
                },
            ],
            status: [
                {
                    totalAmount: {
                        type: Number,
                        required: true
                    },
                    paymentStatus: {
                        type: String,
                        enum: ['PENDING', 'PAID', 'FAILED', "ACTIVE"],
                        default: 'PENDING'
                    },

                    orderStatus: {
                        type: String,
                        enum: ['processing', 'shipped', 'delivered', 'cancelled'],
                        default: 'processing'
                    },

                    cashfreeOrderId: {
                        type: String,
                    },
                }
            ],
            timestamps: {
                type: Date, default: Date.now
            }
        }
    ],
},
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;