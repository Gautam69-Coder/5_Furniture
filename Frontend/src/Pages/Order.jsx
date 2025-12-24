import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const OrderDetails = () => {
    const [order, setorder] = useState([])

    const { orderId } = useParams();

    // console.log(orderId)


    useEffect(() => {
        const myorders = async () => {
            try {
                const token = localStorage.getItem("refreshToken")
                const res = await axios.get("/api/v1/myorders", {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                const product = res.data.data.map(item => item)
                console.log(orderId)
                console.log("My Orders :", res.data.data.find(item => item._id === orderId));
                setorder(res.data.data
                    .find(
                        item => item._id === orderId
                    )
                )

            } catch (error) {
                console.log(error)
            }
        }
        myorders()
    }, []);



    return (
        <div>
            <div className="min-h-screen bg-[#fafafa] py-10">
                <div className="max-w-6xl mx-auto px-6">

                    {/* Page Header */}
                    <div className="mb-8">
                        <p className="text-sm text-gray-500">My Account / Orders</p>
                        <h1 className="text-2xl font-light tracking-wide text-gray-900 mt-1">
                            Order Details
                        </h1>
                    </div>

                    <div className="grid grid-cols-3 gap-8">

                        {/* LEFT CONTENT */}
                        <div className="col-span-2 bg-white border border-gray-200 p-6">

                            {/* Order Meta */}
                            <div className="flex justify-between border-b pb-4 mb-6">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </p>
                                    <p className="text-sm text-gray-900">
                                        {order.cashfreeOrderId}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                                        Order Date
                                    </p>
                                    <p className="text-sm text-gray-900">
                                        {order.createdAt?.split("T")[0]}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                                        Total
                                    </p>
                                    <p className="text-sm font-medium text-gray-900">
                                        ₹ {order.totalAmount}
                                    </p>
                                </div>
                            </div>

                            {/* Products */}
                            <div className="space-y-6">
                                {order.items?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-6 border-b pb-6 last:border-none"
                                    >
                                        <img
                                            src={item.item_image_url}
                                            alt={item.item_name}
                                            className="w-28 h-28 object-cover"
                                        />

                                        <div className="flex-1">
                                            <h3 className="text-md font-light text-gray-900">
                                                {item.item_name}
                                            </h3>

                                            <p className="text-sm text-gray-500 mt-1">
                                                Material: {item.item_material}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Size: {item.item_size}
                                            </p>

                                            <p className="text-sm text-gray-500 mt-2">
                                                Qty: {item.item_quantity}
                                            </p>
                                        </div>

                                        <div className="text-sm text-gray-900">
                                            ₹ {item.item_original_unit_price}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Status */}
                            <div className="mt-8">
                                <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                                    Order Status
                                </h2>

                                <div className="flex items-center justify-between gap-8">
                                    {/* {order.items.map((step, i) => ( */}
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${order.orderStatus !== "processing" ? "bg-[#6B8F71]" : "bg-gray-300"
                                            }`} />
                                        <p className="text-sm text-gray-700">
                                            {order.orderStatus?.toUpperCase()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${order.paymentStatus !== "PENDING"? "bg-[#6B8F71]" : "bg-gray-300"
                                            }`} />
                                        <p className="text-sm text-gray-700">
                                            {order.paymentStatus?.toUpperCase()}
                                        </p>
                                    </div>
                                    {/* ))} */}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <div className="space-y-6">

                            {/* Delivery Address */}
                            <div className="bg-white border border-gray-200 p-5">
                                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-3">
                                    Delivery Address
                                </h3>

                                <p className="text-sm text-gray-800 leading-relaxed">
                                    {/* {order.user_address.map((item) => (
                                        <>
                                            {item.name} < br />
                                            {item.state} < br />
                                            {item.city}, {item.pincode} < br />
                                            {item.phone}
                                        </>
                                    ))} */}

                                    {order.user_address?.firstName}  {order.user_address?.lastName} < br />
                                    {order.user_address?.state} < br />
                                    {order.user_address?.city}, {order.user_address?.pin} < br />
                                    {order.user_address?.phone}
                                </p>
                            </div>

                            {/* Help Box */}
                            <div className="bg-[#f4f1ec] p-5">
                                <h3 className="text-sm text-gray-900 mb-2">
                                    Need Assistance?
                                </h3>

                                <button className="text-sm underline text-gray-700">
                                    Contact Customer Care
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
