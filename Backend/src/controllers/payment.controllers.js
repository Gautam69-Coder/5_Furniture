import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { Cart } from '../models/cart.models.js'
import { ApiResponse } from '../utils/ApiResponse.js';
import { Cashfree, CFEnvironment } from "cashfree-pg";
import Order from '../models/order.models.js';
import { OrderSummary } from '../models/orderSummary.models.js';
import { User } from '../models/user.model.js'


const CheckOut = asyncHandler(async (req, res) => {

    try {
        const cashfree = new Cashfree(CFEnvironment.SANDBOX, process.env.CASHFREE_ID, process.env.CASHFREE_SECRET);
        const { amount, customer_phone, customer_name, customer_email, cart, address } = req.body;
        const userId = req.user._id;

        if(!userId){
            throw new ApiError(401,"Aunothorized")
        }

        // console.log(amount, customer_phone, customer_name, customer_email, cart, address)

        if (!amount || !customer_phone || !customer_name || !customer_email) {
            throw new ApiError(400, "All payment fields are required");
        }


        const orderId = `ORDER_${Date.now()}`;

        if(!orderId){
            console.log("Not found ordered id")
        }



        const cartItems = cart.map((item) => ({
            item_id: item.productId.toString(),
            item_name: item.name,
            item_description: item.description || "Cart product",
            item_image_url: item.image || "https://example.com/image.png",
            item_original_unit_price: item.price,
            item_discounted_unit_price: item.price,
            item_quantity: item.quantity,
            item_currency: "INR",
            item_size: item.size,
            item_material: item.materail,
        }));

        // console.log(cartItems)

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
                "return_url": "https://5-furniture.pages.dev/payment-status"
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

        const order = await Order.findOne({ userId });
        if (!order) {
            const newOrder = new Order({
                userId,
                order_details: [{
                    items: cartItems,
                    user_address: address,
                    status: [{
                        totalAmount: amount,
                        paymentStatus: "PENDING",
                        orderStatus: "processing",
                        cashfreeOrderId: data.order_id,
                    }]
                }]
            });
            await newOrder.save();
        }
        else {
            order.order_details.push({
                items: cartItems,
                user_address: address,
                status: [{
                    totalAmount: amount,
                    paymentStatus: "PENDING",
                    orderStatus: "processing",
                    cashfreeOrderId: data.order_id,
                }]
            });
            await order.save();
        }


        console.log(address.phone)

        await User.findByIdAndUpdate(
            userId,
            { phoneNumber: address.phone },
            { new: true }
        );

        // const orderUserID = await OrderSummary.findOne({ userId: userId }); 

        // console.log(cart.length);
        // if (orderUserID) {
        //     orderUserID.order.push({ orderId: order._id });
        //     orderUserID.totalItems += cart.length;
        //     orderUserID.totalAmount += amount;
        //     orderUserID.paymentStatus = "PENDING";
        //     await orderUserID.save();
        // } else {
        //     await OrderSummary.create({
        //         userId: userId,
        //         order: { orderId: order._id },
        //         totalItems: cart.length,
        //         totalAmount: amount
        //     });
        // }

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