import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api";
import jsPDF from "jspdf";
import { Steps } from 'antd';



const OrderDetails = () => {
    const [order, setOrder] = useState(null);
    const [orderTime, setOrderTime] = useState("");
    const { orderId } = useParams();
    const [count, setcount] = useState(0);

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
        const doc = new jsPDF("p", "mm", "a4");
        let y = 15;

        /* ===== BRAND CIRCLE (LOGO PLACEHOLDER) ===== */
        doc.setFillColor(34, 197, 94); // green
        doc.circle(20, y, 8, "F");
        doc.setTextColor(255);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("H", 17, y + 5);

        doc.setTextColor(0);

        /* ===== SELLER INFO ===== */
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("FreeDom Tree", 140, y - 4);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(
            `GSTIN: 27ABCDE1234F1Z5
            support@freedomtree.com
            +91 98765 43210`,
            140,
            y + 2
        );

        /* ===== INVOICE TITLE ===== */
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("INVOICE", 105, y + 18, { align: "center" });

        y += 30;

        /* ===== BILL TO / INVOICE META ===== */
        const addr = order?.user_address[0];

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Bill To", 14, y);

        doc.setFont("helvetica", "normal");
        doc.text(
            `${addr.firstName} ${addr.lastName}
${addr.address}
${addr.city}, ${addr.state} - ${addr.pin}
${addr.phone}`,
            14,
            y + 6
        );

        doc.setFont("helvetica", "bold");
        doc.text("Invoice #", 140, y);
        doc.setFont("helvetica", "normal");
        doc.text(order?.status[0]?.cashfreeOrderId, 140, y + 6);

        y += 30;

        /* ===== GREEN INFO BAR ===== */
        doc.setFillColor(34, 197, 94);
        doc.rect(14, y, 182, 8, "F");

        doc.setTextColor(255);
        doc.setFontSize(9);
        doc.text("Invoice Date", 18, y + 5);
        doc.text("Payment Method", 80, y + 5);
        doc.text("Due Date", 150, y + 5);

        doc.setTextColor(0);
        y += 12;

        doc.text(orderTime?.slice(0, 10), 18, y);
        doc.text("Online", 80, y);
        doc.text(orderTime?.slice(0, 10), 150, y);

        y += 10;

        /* ===== TABLE HEADER ===== */
        doc.setFillColor(240, 253, 244);
        doc.rect(14, y, 182, 8, "F");

        doc.setFont("helvetica", "bold");
        doc.text("#", 16, y + 5);
        doc.text("Item & Description", 30, y + 5);
        doc.text("Qty", 120, y + 5);
        doc.text("Rate", 145, y + 5);
        doc.text("Amount", 170, y + 5);

        y += 12;
        doc.setFont("helvetica", "normal");

        let subtotal = 0;

        order?.items?.forEach((item, i) => {
            const total = item.item_quantity * item.item_original_unit_price;
            subtotal += total;

            doc.text(String(i + 1), 16, y);
            doc.text(item.item_name, 30, y, { maxWidth: 80 });
            doc.text(String(item.item_quantity), 122, y);
            doc.text(`₹${item.item_original_unit_price}`, 145, y);
            doc.text(`₹${total}`, 170, y);

            y += 8;
        });

        /* ===== TOTAL BOX ===== */
        const gst = subtotal * 0.18;
        const grandTotal = subtotal + gst;

        y += 8;
        doc.setFillColor(245, 245, 245);
        doc.rect(120, y, 76, 30, "F");

        doc.text("Sub Total", 125, y + 7);
        doc.text(`₹${subtotal.toFixed(2)}`, 190, y + 7, { align: "right" });

        doc.text("Tax (18%)", 125, y + 14);
        doc.text(`₹${gst.toFixed(2)}`, 190, y + 14, { align: "right" });

        doc.setFont("helvetica", "bold");
        doc.text("Total", 125, y + 22);
        doc.text(`₹${grandTotal.toFixed(2)}`, 190, y + 22, { align: "right" });

        /* ===== FOOTER ===== */
        y += 45;
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("Thanks for your business.", 14, y);

        doc.text(
            "This is a computer-generated invoice and does not require a signature.",
            105,
            y + 10,
            { align: "center" }
        );

        doc.save(`Invoice_${order?.status[0]?.cashfreeOrderId}.pdf`);
    };


    const content = 'This is a content';
    const items = [
        {
            title: 'Processing',
            content,
        },
        {
            title: 'Shipped',
            content,
        },
        {
            title: 'Delivered',
            content,
        },
    ];


    const handleTimeOut = () => {
        setTimeout(() => {
            setcount(count + 1);
        }, 6000);
    }

    useEffect(() => {
        handleTimeOut()
    }, [count])




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
                            <div className="flex justify-between items-center">
                                <h2 className="text-sm uppercase text-gray-500 mb-4">
                                    Order Status
                                </h2>
                                <h2 className="text-sm uppercase text-gray-500 mb-4">
                                    Payment Status
                                </h2>
                            </div>

                            {order?.status?.map((step, i) => (
                                <div key={i} className="flex justify-between gap-8 mb-2">
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


                        </div>

                        <Steps current={count} status="error" items={items} />

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
