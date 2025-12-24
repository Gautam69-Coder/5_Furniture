import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { Cart } from '../models/cart.models.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import { Cashfree, CFEnvironment } from "cashfree-pg";
import Order from '../models/order.models.js';


const CheckOut = asyncHandler(async (req, res) => {

    try {
        const cashfree = new Cashfree(CFEnvironment.SANDBOX, process.env.CASHFREE_ID, process.env.CASHFREE_SECRET);
        const userId = req.user._id;
        const { amount, customer_phone, customer_name, customer_email, cart,address } = req.body;

        if (!amount || !customer_phone || !customer_name || !customer_email) {
            throw new ApiError(400, "All payment fields are required");
        }


        const orderId = `ORDER_${Date.now()}`;


        const cartItems = cart.map((item) => ({
            item_id: item.productId.toString(),
            item_name: item.name,
            item_description: item.description || "Cart product",
            item_image_url: item.image || "https://example.com/image.png",
            item_original_unit_price: item.price,
            item_discounted_unit_price: item.price,
            item_quantity: item.quantity,
            item_currency: "INR",
            item_size : item.size,
            item_material : item.materail,
        }));

        console.log(cartItems)

        const order = await Order.create({
            userId,
            items: cartItems,
            user_address : address,
            totalAmount: amount,
            paymentStatus: "PENDING",
            orderStatus: "processing"
        });

        const request = {
            "order_amount": amount,
            "order_currency": "INR",
            "order_id": orderId,
            "customer_details": {
                "customer_id": userId.toString(),
                "customer_phone": customer_phone.toString(),
                "customer_email": customer_email.toString(),
                "customer_name": customer_name.toString()
            },
            "order_meta": {
                "return_url": "http://localhost:5173/payment-status"
            },
            "cart_details": {
                "cart_items": cartItems
            }
        };


        let data;

        await
            cashfree.PGCreateOrder(request).then((response) => {
                data = response.data;
            }).catch((error) => {
                console.error('Error:', error.response.data.message);
            });


        order.cashfreeOrderId = data.order_id;
        await order.save();

        res.status(200).json(
            new ApiResponse(
                200,
                data,
                "Payment session created"
            )
        );
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

const getPaymentStatus = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        console.log(orderId)
        if (!orderId) throw new ApiError(400, "Order ID is required");

        const cashfree = new Cashfree(CFEnvironment.SANDBOX, process.env.CASHFREE_ID, process.env.CASHFREE_SECRET);


        let data;
        await cashfree.PGFetchOrder(orderId)
            .then(response => { data = response.data; console.log(data); })
            .catch(err => {
                console.log(err.response?.data || err.message);
                throw new ApiError(500, "Failed to fetch order status");
            });

        const order = await Order.findOne({ cashfreeOrderId: orderId });
        if (order) {
            order.paymentStatus = data.order_status; // update status
            await order.save();
        }

        res.status(200).json(new ApiResponse(200, data, "Order status fetched successfully"));

    } catch (error) {
        throw new ApiError(500, error.message);
    }
});


export { CheckOut, getPaymentStatus };