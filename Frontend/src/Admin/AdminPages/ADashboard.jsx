import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';


const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50 hover:shadow-md transition-all"
    >
        <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon size={24} className="text-white" />
            </div>
            <span className={`flex items-center text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {change >= 0 ? '+' : ''}{change}%
                <ArrowUpRight size={16} className="ml-1" />
            </span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
        <h2 className="text-2xl font-bold text-brand-dark font-display">{value}</h2>
    </motion.div>
);

const SectionHeader = ({ title, subtitle }) => (
    <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 font-display">{title}</h2>
        <p className="text-gray-500">{subtitle}</p>
    </div>
);

const Dashboard = () => {

    const [Orders, setOrders] = useState([]);
    const [totalAmount, setTotalAmount] = useState();
    const [totalOrder, settotalOrder] = useState();
    const [totalUser, settotalUser] = useState();

    useEffect(() => {
        // Fetch orders from the backend API
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/admin/orders`);
                setOrders(response.data.data.map((item => item.order_details.slice(0, 5))));
                let total = response.data.data.map((item=>item.order_details.map(item=>item.status[0].totalAmount)))
                setTotalAmount(total.map(item=>item.reduce((acc, amount) => acc + amount, 0)).reduce((acc, amount) => acc + amount, 0))
                settotalOrder(response.data.data.map((item=>item.order_details.map(order => order.items).length)).reduce((acc, amount) => acc + amount, 0));
            }
            catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/v1/users`);
                settotalUser(res.data.data.length);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-brand-dark font-display">Welcome Back, Admin</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening with your store today.</p>
                </div>
                <button className="px-4 py-2 bg-brand-primary text-white rounded-lg shadow-lg shadow-brand-primary/30 hover:bg-brand-primary/90 transition-all font-medium">
                    Download Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={`₹ ${totalAmount}`}
                    change={12.5}
                    icon={DollarSign}
                    color="bg-brand-primary"
                />
                <StatCard
                    title="Orders"
                    value={totalOrder}
                    change={8.2}
                    icon={ShoppingBag}
                    color="bg-brand-secondary"
                />
                <StatCard
                    title="Customers"
                    value={totalUser}
                    change={-2.4}
                    icon={Users}
                    color="bg-brand-accent"
                />
                <StatCard
                    title="Growth"
                    value="18.6%"
                    change={4.3}
                    icon={TrendingUp}
                    color="bg-indigo-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <SectionHeader title="Recent Orders" subtitle="Latest transactions from your store" />

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-gray-100">
                                    <th className="pb-4 text-sm font-semibold text-gray-500">Order ID</th>
                                    <th className="pb-4 text-sm font-semibold text-gray-500">Customer</th>
                                    <th className="pb-4 text-sm font-semibold text-gray-500">Product</th>
                                    <th className="pb-4 text-sm font-semibold text-gray-500">Status</th>
                                    <th className="pb-4 text-sm font-semibold text-gray-500">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {Orders.slice(0,5).map((item) => (
                                    (item.slice(0,1).map((order) => (
                                        <tr key={order.items.item_id} className="group hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 text-sm font-medium text-brand-primary">{order.status[0].cashfreeOrderId}</td>
                                            <td className="py-4 text-sm text-gray-800">{order.user_address[0]?.firstName?.charAt(0).toUpperCase() + order.user_address[0].firstName?.slice(1).toLowerCase()} {order.user_address[0].lastName?.charAt(0).toUpperCase() + order.user_address[0].lastName?.slice(1).toLowerCase()}</td>
                                            <td className="py-4 text-sm text-gray-600 line-clamp-1">{order.items[0].item_name.substring(0, 15) + '...'}</td>
                                            <td className="py-4">
                                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
                                                    {order.status[0].paymentStatus}
                                                </span>
                                            </td>
                                            <td className="py-4 text-sm font-bold text-gray-800">₹ {order.status[0].totalAmount}</td>
                                        </tr>
                                    )))
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Popular Products Sidebar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <SectionHeader title="Popular Items" subtitle="Top selling furniture this week" />

                    <div className="space-y-6">
                        {Orders.slice(0,3).map((order, index) => (
                            (order.slice(0,1).map((item) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-gray-100 shrink-0">
                                        <img src={item.items[0].item_image_url} alt={item.items[0].item_name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 line-clamp-1">{item.items[0].item_name.substring(0, 15) + '...'}</h4>
                                        <p className="text-xs text-gray-500 mb-1">Living Room</p>
                                        <span className="text-brand-primary font-bold text-sm">₹ {item.status[0].totalAmount}</span>
                                    </div>
                                </div>
                            )))
                        ))}
                    </div>

                    <button className="w-full mt-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                        View All Products
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
