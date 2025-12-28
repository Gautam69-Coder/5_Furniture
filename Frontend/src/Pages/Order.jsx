import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


const OrderDetails = () => {
    const [order, setorder] = useState([])
    const [time, settime] = useState("")

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

                const product = res.data.data[0].order_details.map(item => item)
                console.log(product)
                settime(res.data.data[0].timestamp)
                let time=product.find(item => item._id === orderId)
                settime(time.timestamps)
                console.log("My Orders :", product.find(item => item._id === orderId));
                setorder(
                    product.find(item => item._id === orderId)
                )


            } catch (error) {
                console.log(error)
            }
        }
        myorders()
    }, [orderId]);



    return (
        <div>
            <div className="min-h-screen bg-[#fafafa] sm:py-10">
                <div className="sm:max-w-6xl sm:mx-auto sm:px-6 mx-4">

                    {/* Page Header */}
                    <div className="sm:mb-8 mb-4">
                        <p className="text-sm text-gray-500">My Account / Orders</p>
                        <h1 className="text-2xl font-light tracking-wide text-gray-900 mt-1">
                            Order Details
                        </h1>
                    </div>

                    <div className="grid sm:grid-cols-3 grid-cols-1 gap-8">

                        {/* LEFT CONTENT */}
                        <div className="col-span-2 bg-white border border-gray-200 sm:p-6 p-2">

                            {/* Order Meta */}
                            {order?.status?.map((item, index) => (
                                <div className="flex justify-between border-b pb-4 mb-6" key={index}>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {item.cashfreeOrderId}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                                            Order Date
                                        </p>
                                        <p className="text-sm text-gray-900">
                                            {time?.slice(0, 10)}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                                            Total
                                        </p>
                                        <p className="text-sm font-medium text-gray-900">
                                            ₹ {item.totalAmount}
                                        </p>
                                    </div>
                                </div>

                            ))}
                            {/* Products */}
                            <div className="space-y-6">
                                {order?.items?.map((prod, idx) => (
                                    <div
                                        key={idx}
                                        className="flex gap-6 border-b pb-6 last:border-none">
                                        <>
                                            <img
                                                src={prod.item_image_url}
                                                alt={prod.item_name}
                                                className="w-28 h-28 object-cover"
                                            />

                                            <div className="flex-1">
                                                <h3 className="text-md font-light text-gray-900">
                                                    {prod.item_name}
                                                </h3>

                                                <p className="text-sm text-gray-500 mt-1">
                                                    Material: {prod.item_material}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    Size: {prod.item_size}
                                                </p>

                                                <p className="text-sm text-gray-500 mt-2">
                                                    Qty: {prod.item_quantity}
                                                </p>
                                            </div>

                                            <div className="text-sm text-gray-900">
                                                ₹ {prod?.item_original_unit_price}
                                            </div>
                                        </>
                                    </div>
                                ))}
                            </div>

                            {/* Order Status */}
                            <div className="mt-8">
                                <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                                    Order Status
                                </h2>

                                <div className="flex items-center justify-between gap-8">
                                    {order.status?.map((step, i) => (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${step.orderStatus !== "processing" ? "bg-[#6B8F71]" : "bg-gray-300"
                                                    }`} />
                                                <p className="text-sm text-gray-700">
                                                    {step.orderStatus?.toUpperCase()}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-3 h-3 rounded-full ${step.paymentStatus !== "PENDING" ? "bg-[#6B8F71]" : "bg-gray-300"
                                                    }`} />
                                                <p className="text-sm text-gray-700">
                                                    {step.paymentStatus?.toUpperCase()}
                                                </p>
                                            </div>
                                        </>
                                    ))}
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
                                    {order?.user_address?.map((item) => (
                                        <>
                                            Name :  {item.firstName} {item.lastName} < br />
                                            Sate : {item.state} < br />
                                            City : {item.city} <br/>
                                            Pincode : {item.pin} < br />
                                            Phone : {item.phone} <br />
                                            Address : {item.address} 
                                        </>
                                    ))}

                                    {/* {order.user_address?.firstName}  {order.user_address?.lastName} < br />
                                    {order.user_address?.state} < br />
                                    {order.user_address?.city}, {order.user_address?.pin} < br />
                                    {order.user_address?.phone} */}
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
