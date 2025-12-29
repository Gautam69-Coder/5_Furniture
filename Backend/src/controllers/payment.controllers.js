import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { Cart } from '../models/cart.models.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import { Cashfree, CFEnvironment } from "cashfree-pg";
import Order from '../models/order.models.js';
import { OrderSummary } from '../models/orderSummary.models.js';
import { User } from '../models/user.model.js'


const CheckOut = asyncHandler(async (req, res) => {

    const cashfree = new Cashfree(
        CFEnvironment.SANDBOX,
        process.env.CASHFREE_ID,
        process.env.CASHFREE_SECRET
    );

    console.log("CF ID:", process.env.CASHFREE_ID);
    console.log("CF SECRET:", process.env.CASHFREE_SECRET);

    const { customer_phone, customer_name, customer_email, cart, address } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    if (!cart || !cart.length) {
        throw new ApiError(400, "Cart is empty");
    }

    if (!customer_phone || !customer_name || !customer_email) {
        throw new ApiError(400, "Customer details missing");
    }

    const orderId = `ORDER_${Date.now()}`;

    const cartItems = cart.map(item => ({
        item_id: item.productId.toString(),
        item_name: item.name,
        item_description: item.description || "Cart product",
        item_image_url: item.image,
        item_original_unit_price: item.price,
        item_discounted_unit_price: item.price,
        item_quantity: item.quantity,
        item_currency: "INR",
        item_size: item.size,
        item_material: item.material
    }));

    const totalAmount = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const request = {
        order_id: orderId,
        order_amount: totalAmount,
        order_currency: "INR",
        customer_details: {
            customer_id: userId.toString(),
            customer_phone: customer_phone.toString(),
            customer_email: customer_email,
            customer_name: customer_name
        },
        order_meta: {
            return_url: "https://5-furniture.pages.dev/payment-status"
        },
        cart_details: {
            cart_items: cartItems
        }
    };

    let data;
    try {
        const response = await cashfree.PGCreateOrder(request);
        data = response.data;
    } catch (err) {
        console.log(err.response?.data || err.message);
        throw new ApiError(502, "Cashfree order creation failed");
    }

    if (!data?.order_id) {
        throw new ApiError(500, "Invalid Cashfree response");
    }

    const order = await Order.findOne({ userId });

    const orderPayload = {
        items: cartItems,
        user_address: address,
        status: [{
            totalAmount,
            paymentStatus: "PENDING",
            orderStatus: "processing",
            cashfreeOrderId: data.order_id
        }]
    };

    if (!order) {
        await Order.create({
            userId,
            order_details: [orderPayload]
        });
    } else {
        order.order_details.push(orderPayload);
        await order.save();
    }

    if (address?.phone) {
        await User.findByIdAndUpdate(
            userId,
            { phoneNumber: address.phone }
        );
    }

    res.status(200).json(
        new ApiResponse(200, data, "Payment session created")
    );
});


const getPaymentStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) {
        throw new ApiError(400, "Order ID is required");
    }

    const cashfree = new Cashfree(
        CFEnvironment.SANDBOX,
        process.env.CASHFREE_ID,
        process.env.CASHFREE_SECRET
    );

    let data;
    try {
        const response = await cashfree.PGFetchOrder(orderId);
        data = response.data;
    } catch (err) {
        console.log(err.response?.data || err.message);
        throw new ApiError(500, "Failed to fetch order status");
    }

    const order = await Order.findOne({
        "order_details.status.cashfreeOrderId": orderId
    });

    // console.log(order.order_details[0].status[0])
    console.log(data.order_status)

    if (order) {
        order.order_details.forEach(detail => {
            detail.status.forEach(s => {
                if (s.cashfreeOrderId === orderId) {
                    s.paymentStatus = data.order_status;
                }
            });
        });
        await order.save();
    }

    res
        .status(200)
        .json(new ApiResponse(200, data, "Order status fetched successfully"));
});



export { CheckOut, getPaymentStatus };