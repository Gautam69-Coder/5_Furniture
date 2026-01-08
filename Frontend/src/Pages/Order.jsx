import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api";
import jsPDF from "jspdf";
import { Steps } from 'antd';
import autoTable from 'jspdf-autotable';



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
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 10;

    doc.setFillColor(34, 197, 94);
    doc.rect(0, 0, pageWidth, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('FREEDOM TREE', 15, 18);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('support@freedomtree.com | +91 98765 43210', 15, 25);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth - 40, 18);

    yPosition = 35;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', 15, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    const addr = order?.user_address[0];
    const billToText = `${addr?.firstName || ''} ${addr?.lastName || ''}
${addr?.address || ''}
${addr?.city || ''}, ${addr?.state || ''} - ${addr?.pincode || ''}
${addr?.phone || ''}`;
    
    doc.text(billToText, 15, yPosition + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('INVOICE DETAILS:', pageWidth - 80, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    
    const invoiceDate = orderTime?.slice(0, 10) || new Date().toISOString().slice(0, 10);
    const invoiceDetails = `Invoice #: ${order?.status[0]?.cashfreeOrderId || 'N/A'}
Date: ${invoiceDate}
Payment: Online
Status: ${order?.status[0]?.payment_status || 'Completed'}`;
    
    doc.text(invoiceDetails, pageWidth - 80, yPosition + 6);

    yPosition = 75;

    autoTable(doc, {
        startY: yPosition,
        head: [['#', 'Item & Description', 'Qty', 'Unit Price', 'Amount']],
        body: order?.items?.map((item, i) => {
            const total = item.item_quantity * item.item_original_unit_price;
            return [
                String(i + 1),
                item.item_name || 'N/A',
                String(item.item_quantity),
                `₹${item.item_original_unit_price || '0.00'}`,
                `₹${total || '0.00'}`
            ];
        }) || [],
        headStyles: {
            fillColor: [34, 197, 94],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10,
            padding: 4,
            halign: 'center'
        },
        bodyStyles: {
            fontSize: 9,
            padding: 3,
            halign: 'center'
        },
        alternateRowStyles: {
            fillColor: [245, 253, 244]
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 15 },
            1: { halign: 'left', cellWidth: 95 },
            2: { halign: 'center', cellWidth: 20 },
            3: { halign: 'right', cellWidth: 30 },
            4: { halign: 'right', cellWidth: 30 }
        },
        margin: { left: 15, right: 15 },
        didDrawPage: (data) => {
            yPosition = data.cursor.y;
        }
    });

    yPosition += 15;

    const subtotal = order?.items?.reduce((sum, item) => 
        sum + (item.item_quantity * item.item_original_unit_price), 0) || 0;
    const gst = subtotal * 0.18;
    const grandTotal = subtotal + 0;

    doc.setFillColor(245, 245, 245);
    doc.rect(100, yPosition, 95, 35, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Subtotal:', 110, yPosition + 8);
    doc.text(`₹${subtotal.toFixed(2)}`, 185, yPosition + 8, { align: 'right' });

    doc.text('IGST (18%):', 110, yPosition + 16);
    doc.text(`₹${0}`, 185, yPosition + 16, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(34, 197, 94);
    doc.text('Grand Total:', 110, yPosition + 26);
    doc.text(`₹${grandTotal.toFixed(2)}`, 185, yPosition + 26, { align: 'right' });

    doc.setTextColor(0, 0, 0);
    yPosition += 45;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TERMS & CONDITIONS:', 15, yPosition);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const termsText = doc.splitTextToSize(
        'Payment Terms: Due upon receipt. Thank you for your business! This is a computer-generated invoice and does not require a signature. For any queries, please contact support@freedomtree.com',
        170
    );
    doc.text(termsText, 15, yPosition + 6);

    yPosition = pageHeight - 20;
    
    doc.setDrawColor(34, 197, 94);
    doc.setLineWidth(0.5);
    doc.line(15, yPosition, pageWidth - 15, yPosition);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(
        'FreeDom Tree | GSTIN: 27ABCDE1234F1Z5 | support@freedomtree.com | +91 98765 43210',
        pageWidth / 2,
        yPosition + 8,
        { align: 'center' }
    );

    doc.text(
        `Generated on ${new Date().toLocaleString('en-IN')}`,
        pageWidth / 2,
        yPosition + 14,
        { align: 'center' }
    );

    doc.save(`Invoice_${order?.status[0]?.cashfreeOrderId || 'Invoice'}.pdf`);
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
                                    <p>Method: {item.paymentMethod || "N/A"}</p>
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
