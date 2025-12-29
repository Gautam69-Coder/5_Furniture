import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-4 rounded-2xl ${color} flex items-center justify-center`}>
        <Icon size={24} className="text-white" />
      </div>
      <span
        className={`flex items-center text-sm font-semibold ${
          change >= 0 ? 'text-green-600' : 'text-red-500'
        }`}
      >
        {change >= 0 ? '+' : ''}
        {change}%
        <ArrowUpRight size={16} className="ml-1" />
      </span>
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
  </motion.div>
);

const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    <p className="text-gray-500 text-sm">{subtitle}</p>
  </div>
);

const Dashboard = () => {
  const [Orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalOrder, settotalOrder] = useState(0);
  const [totalUser, settotalUser] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/admin/orders`);
        setOrders(response.data.data.map(item => item.order_details.slice(0, 5)));

        let total = response.data.data
          .map(item => item.order_details.map(o => o.status[0].totalAmount))
          .flat();
        setTotalAmount(total.reduce((acc, amount) => acc + amount, 0));

        let orderCount = response.data.data
          .map(item => item.order_details.map(order => order.items.length))
          .flat();
        settotalOrder(orderCount.reduce((acc, amount) => acc + amount, 0));
      } catch (error) {
        console.error('Error fetching orders:', error);
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
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome Back, Admin</h1>
          <p className="text-gray-500">Here's what's happening with your store today.</p>
        </div>
        <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-medium">
          Download Report
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="Total Revenue"
          value={`₹ ${totalAmount.toLocaleString()}`}
          change={12.5}
          icon={DollarSign}
          color="bg-blue-600"
        />
        <StatCard
          title="Orders"
          value={totalOrder}
          change={8.2}
          icon={ShoppingBag}
          color="bg-purple-500"
        />
        <StatCard
          title="Customers"
          value={totalUser}
          change={-2.4}
          icon={Users}
          color="bg-green-500"
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
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-md border border-gray-100 p-6">
          <SectionHeader title="Recent Orders" subtitle="Latest transactions from your store" />
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-4 text-sm font-medium text-gray-500">Order ID</th>
                  <th className="pb-4 text-sm font-medium text-gray-500">Customer</th>
                  <th className="pb-4 text-sm font-medium text-gray-500">Product</th>
                  <th className="pb-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="pb-4 text-sm font-medium text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {Orders.flat().slice(0, 5).map(order => (
                  <tr key={order.items[0].item_id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-sm font-medium text-blue-600">{order.status[0].cashfreeOrderId}</td>
                    <td className="py-4 text-sm text-gray-800">
                      {order.user_address[0]?.firstName} {order.user_address[0]?.lastName}
                    </td>
                    <td className="py-4 text-sm text-gray-600 line-clamp-1">{order.items[0].item_name}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
                        {order.status[0].paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 text-sm font-bold text-gray-900">₹ {order.status[0].totalAmount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
          <SectionHeader title="Popular Items" subtitle="Top selling furniture this week" />
          <div className="space-y-5">
            {Orders.flat().slice(0, 3).map((order, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  <img
                    src={order.items[0].item_image_url}
                    alt={order.items[0].item_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 line-clamp-1">{order.items[0].item_name}</h4>
                  <p className="text-xs text-gray-500 mb-1">Living Room</p>
                  <span className="text-blue-600 font-bold text-sm">₹ {order.status[0].totalAmount}</span>
                </div>
              </div>
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
