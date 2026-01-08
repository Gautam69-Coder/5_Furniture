import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";
import { Button, Result } from 'antd';
import { loader } from "../Utils/loarder";
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

                const res = await axios.get(`${API_BASE_URL}/api/v1/status/${orderId}`);
                const token = localStorage.getItem("refreshToken");
                const res2 = await axios.get(`${API_BASE_URL}/api/v1/myorders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStatus(res.data.data);
                console.log(res.data.data);
                let my = res2.data.data[0].order_details.map((item => item));
                let findOrder = my.slice(-1)[0]
                console.log(findOrder)
                const ordersSend = await axios.post(`${API_BASE_URL}/api/v1/verify_order/`,
                    { findOrder },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                )
                
                console.log(ordersSend)
                setLoading(false);

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
                const res = await axios.post(`${API_BASE_URL}/api/v1/deleteItem`,
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


    if (loading) return <p className="h-[70vh] flex items-center justify-center">{loader()}</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-8 flex justify-center items-center h-[80vh]">
            <Result
                status="success"
                title="Successfully Purchased Cloud Server ECS!"
                subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
                extra={[
                    <Button type="primary" key="console" onClick={() => { navigate("/") }}>
                        Home
                    </Button>,
                    <Button key="buy" onClick={() => { navigate("/collections/furniture") }} >Buy Again</Button>,
                ]}
            />
        </div>
    );
};

export default PaymentStatus;
