import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api";
import jsPDF from "jspdf";


const OrderDetails = () => {
    const [order, setOrder] = useState(null);
    const [orderTime, setOrderTime] = useState("");
    const { orderId } = useParams();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("refreshToken");
                const res = await axios.get(`${API_BASE_URL}/api/v1/myorders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const orders = res.data.data[0].order_details;
                const selectedOrder = orders.find(o => o._id === orderId);

                setOrder(selectedOrder);
                setOrderTime(selectedOrder?.timestamps);
            } catch (err) {
                console.log(err);
            }
        };
        fetchOrders();
    }, [orderId]);

    const downloadInvoice = () => {
        const doc = new jsPDF();
        let y = 20;

        doc.setFontSize(16);
        doc.text("INVOICE", 105, y, { align: "center" });
        y += 10;

        doc.setFontSize(10);
        doc.text(`Order ID: ${order?.status[0]?.cashfreeOrderId}`, 14, y);
        y += 6;
        doc.text(`Order Date: ${orderTime?.slice(0, 10)}`, 14, y);
        y += 10;

        doc.text("Billing Address:", 14, y);
        y += 6;

        const addr = order?.user_address[0];
        doc.text(
            `${addr.firstName} ${addr.lastName}
${addr.address}
${addr.city}, ${addr.state} - ${addr.pin}
Phone: ${addr.phone}`,
            14,
            y
        );

        y += 25;
        doc.text("Products:", 14, y);
        y += 6;

        order?.items?.forEach((item, i) => {
            doc.text(
                `${i + 1}. ${item.item_name} | Qty: ${item.item_quantity} | ₹${item.item_original_unit_price}`,
                14,
                y
            );
            y += 6;
        });

        y += 10;
        doc.text(`Total Amount: ₹ ${order?.status[0]?.totalAmount}`, 14, y);
        y += 6;
        doc.text(`Payment Status: ${order?.status[0]?.paymentStatus}`, 14, y);

        doc.save(`Invoice_${order?.status[0]?.cashfreeOrderId}.pdf`);
    };



    return (
        <div className="min-h-screen bg-[#fafafa] sm:py-10">
            <div className="sm:max-w-6xl sm:mx-auto sm:px-6 mx-4">

                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500">My Account / Orders</p>
                            <h1 className="text-2xl font-light text-gray-900 mt-1">
                                Order Details
                            </h1>
                        </div>
                        <button className="border-2 p-2 " onClick={() => {
                            downloadInvoice()
                        }}>
                            Download Invoice
                        </button>
                    </div>
                </div>

                <div className="grid sm:grid-cols-3 grid-cols-1 gap-8">

                    <div className="col-span-2 bg-white border border-gray-200 sm:p-6 p-4">

                        {order?.status?.map((item, i) => (
                            <div key={i} className="flex justify-between border-b pb-4 mb-6">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Order ID</p>
                                    <p className="text-sm">{item.cashfreeOrderId}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Order Date</p>
                                    <p className="text-sm">{orderTime?.slice(0, 10)}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500 uppercase">Total</p>
                                    <p className="text-sm font-medium">₹ {item.totalAmount}</p>
                                </div>
                            </div>
                        ))}

                        <div className="space-y-6">
                            {order?.items?.map((prod, idx) => (
                                <div key={idx} className="flex gap-6 border-b pb-6">
                                    <img
                                        src={prod.item_image_url}
                                        className="w-28 h-28 object-cover"
                                    />

                                    <div className="flex-1">
                                        <h3 className="text-md font-light">
                                            {prod.item_name}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Material: {prod.item_material}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Size: {prod.item_size}
                                        </p>

                                        <p className="text-sm text-gray-500 mt-2">
                                            Qty: {prod.item_quantity}
                                        </p>
                                    </div>

                                    <div className="text-sm">
                                        ₹ {prod.item_original_unit_price}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <h2 className="text-sm uppercase text-gray-500 mb-4">
                                Order Status
                            </h2>

                            {order?.status?.map((step, i) => (
                                <div key={i} className="flex gap-8 mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${step.orderStatus !== "processing" ? "bg-green-600" : "bg-gray-300"}`} />
                                        <p className="text-sm">
                                            {step.orderStatus.toUpperCase()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${step.paymentStatus !== "PENDING" ? "bg-green-600" : "bg-gray-300"}`} />
                                        <p className="text-sm">
                                            {step.paymentStatus.toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <h2 className="text-sm uppercase text-gray-500 mb-4">
                                Delivery Timeline
                            </h2>

                            <div className="space-y-3">
                                <p className="text-sm">Order Placed – {orderTime?.slice(0, 10)}</p>
                                <p className="text-sm">Processing</p>
                                <p className="text-sm text-gray-400">Shipped</p>
                                <p className="text-sm text-gray-400">Delivered</p>
                            </div>
                        </div>

                    </div>

                    <div className="space-y-6">

                        <div className="bg-white border border-gray-200 p-5">
                            <h3 className="text-sm uppercase text-gray-500 mb-3">
                                Order Summary
                            </h3>

                            {order?.status?.map((item, i) => (
                                <div key={i} className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>₹ {item.totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span>₹ 0</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between font-medium">
                                        <span>Total Paid</span>
                                        <span>₹ {item.totalAmount}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white border border-gray-200 p-5">
                            <h3 className="text-sm uppercase text-gray-500 mb-3">
                                Payment Information
                            </h3>

                            {order?.status?.map((item, i) => (
                                <div key={i} className="text-sm space-y-1">
                                    <p>Method: {item.paymentMethod}</p>
                                    <p>Status: {item.paymentStatus}</p>
                                    <p>Transaction ID: {item.cashfreeOrderId}</p>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white border border-gray-200 p-5">
                            <h3 className="text-sm uppercase text-gray-500 mb-3">
                                Delivery Address
                            </h3>

                            {order?.user_address?.map((a, i) => (
                                <p key={i} className="text-sm leading-relaxed">
                                    {a.firstName} {a.lastName}<br />
                                    {a.address}<br />
                                    {a.city}, {a.state} - {a.pin}<br />
                                    Phone: {a.phone}
                                </p>
                            ))}
                        </div>

                        <div className="bg-[#f4f1ec] p-5">
                            <h3 className="text-sm mb-2">Need Assistance?</h3>
                            <button className="text-sm underline">
                                Contact Customer Care
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
