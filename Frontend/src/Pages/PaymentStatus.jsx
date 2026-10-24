import React, { useEffect, useState } from "react";
import api from "../Api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";
import { Button, Result } from 'antd';
import { loader } from "../Utils/loarder";
import { getErrorMessage } from "../Utils/errorHandler";

const PaymentStatus = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const orderId = localStorage.getItem("currentOrderId");

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                if (!orderId) {
                    setError("No order identifier found. Please check your order history.");
                    setLoading(false);
                    return;
                }

                const res = await api.get(`/status/${orderId}`);
                console.log("Status Response : ", res.data.data);
                setStatus(res.data?.data);

                try {
                    const res2 = await api.get("/myorders");
                    const myOrders = res2.data?.data?.[0]?.order_details || [];
                    const findOrder = myOrders.slice(-1)[0];
                    if (findOrder) {
                        await api.post("/verify_order/", { findOrder });
                    }
                } catch {
                }
            } catch (err) {
                setError(getErrorMessage(err, "Failed to verify order and payment status."));
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, [orderId]);

    useEffect(() => {
        const deleteItem = async (productId) => {
            try {
                await api.post("/deleteItem", { productId });
            } catch (err) {
                // Silently handle background cart cleanup
            }
        };

        deleteItem();
    }, []);

    if (loading) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
                {loader()}
                <p className="text-gray-600 text-sm">Verifying payment status...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 flex justify-center items-center min-h-[70vh]">
                <Result
                    status="error"
                    title="Order Verification Issue"
                    subTitle={error}
                    extra={[
                        <Button type="primary" key="orders" onClick={() => navigate("/profile")}>
                            View My Orders
                        </Button>,
                        <Button key="home" onClick={() => navigate("/")}>
                            Return to Home
                        </Button>,
                    ]}
                />
            </div>
        );
    }

    const orderStatus = status?.order_status?.toUpperCase();

    if (orderStatus === "PAID" || orderStatus === "SUCCESS") {
        return (
            <div className="p-8 flex justify-center items-center min-h-[70vh]">
                <Result
                    status="success"
                    title="Payment Successful!"
                    subTitle={`Order ID: ${orderId || status?.order_id || 'N/A'}. Thank you for your purchase! Your order is confirmed and being prepared.`}
                    extra={[
                        <Button type="primary" key="orders" onClick={() => navigate("/profile")}>
                            View Order Details
                        </Button>,
                        <Button key="buy" onClick={() => navigate("/collections/furniture")}>
                            Continue Shopping
                        </Button>,
                    ]}
                />
            </div>
        );
    }

    if (orderStatus === "ACTIVE" || orderStatus === "PENDING") {
        return (
            <div className="p-8 flex justify-center items-center min-h-[70vh]">
                <Result
                    status="warning"
                    title="Payment is Pending"
                    subTitle={`Order ID: ${orderId || status?.order_id || 'N/A'}. Your transaction is awaiting confirmation from your bank. Please check your order history shortly.`}
                    extra={[
                        <Button type="primary" key="orders" onClick={() => navigate("/profile")}>
                            Check My Orders
                        </Button>,
                        <Button key="home" onClick={() => navigate("/")}>
                            Return to Home
                        </Button>,
                    ]}
                />
            </div>
        );
    }

    // Default to Failed / Cancelled
    return (
        <div className="p-8 flex justify-center items-center min-h-[70vh]">
            <Result
                status="error"
                title="Payment Failed or Cancelled"
                subTitle={`Order ID: ${orderId || status?.order_id || 'N/A'}. The payment could not be completed. Any deducted funds will be reversed according to your payment provider's timeline.`}
                extra={[
                    <Button type="primary" key="checkout" onClick={() => navigate("/checkout")}>
                        Retry Checkout
                    </Button>,
                    <Button key="home" onClick={() => navigate("/")}>
                        Return to Home
                    </Button>,
                ]}
            />
        </div>
    );
};

export default PaymentStatus;
