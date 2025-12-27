import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PaymentStatus = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                // console.log("hello")
                const orderId = localStorage.getItem("currentOrderId");
                console.log(orderId)
                if (!orderId) {
                    setError("No order found");
                    setLoading(false);
                    return;
                }

                const res = await axios.get(`/api/v1/status/${orderId}`);
                setStatus(res.data.data);
                console.log(res.data.data);
                navigate("/")
            } catch (err) {
                console.error(err);
                setError("Failed to fetch order status");
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
    }, []);


    useEffect(() => {
        const deleteItem = async (productId) => {
            try {

                const token = localStorage.getItem("refreshToken")
                const res = await axios.post("/api/v1/deleteItem",
                    { productId },
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                )
            } catch (error) {
                console.log(error)
            }
        }

        deleteItem();
    }, [])


    if (loading) return <p>Loading payment status...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-8">

        </div>
    );
};

export default PaymentStatus;
