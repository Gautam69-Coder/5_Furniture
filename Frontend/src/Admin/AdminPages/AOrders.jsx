import React, { useState } from 'react';
import { Search, Filter, Eye, Download, CheckCircle, Clock, XCircle, Truck } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';


const Orders = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [Orders, setOrders] = useState([]);
    const [search, setsearch] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [filterOpen, setfilterOpen] = useState(false)

    useEffect(() => {
        // Fetch orders from the backend API
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/admin/orders`);
                setOrders(response.data.data.map(order => order.order_details.map(item => item)));
                // console.log(response.data.data.map(order => order.order_details.map(item => item)));
                // console.log(response.data.data[0].order_details);
            }
            catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        if (!search) {
            setFilteredOrders(Orders);
        }

        const searchText = search.toLowerCase();

        const filtered = Orders.filter((order) => {

            const customerName = order.map((item) => {
                return `${item?.user_address[0]?.firstName || ""} ${item?.user_address[0]?.lastName || ""}`.toLowerCase();
            })

            console.log(customerName)


            const orderId = order.map((item) => {
                return item?.status[0]?.cashfreeOrderId?.toLowerCase() || ""
            })

            console.log(orderId)

            return (
                orderId.some(item => item.includes(searchText)) || customerName.some(item => item.includes(searchText))
            )
        })

        console.log(filtered)
        setFilteredOrders(filtered)

    }, [search, Orders])



    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-50 text-green-700 border-green-200';
            case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Shipped': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
            case 'Cancelled': return 'bg-red-50 text-red-700 border-red-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={14} className="mr-1" />;
            case 'Processing': return <Clock size={14} className="mr-1" />;
            case 'Shipped': return <Truck size={14} className="mr-1" />;
            case 'Cancelled': return <XCircle size={14} className="mr-1" />;
            default: return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-dark font-display">Orders</h1>
                    <p className="text-gray-500 mt-1">Manage and track customer orders</p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-50 transition-all font-medium">
                    <Download size={20} />
                    <span>Export Orders</span>
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-6 overflow-x-auto">
                {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-medium capitalize transition-colors relative ${activeTab === tab ? 'text-brand-primary' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative flex-1 w-full md:max-w-md">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by order ID or customer..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                        value={search}
                        onChange={(e) => {
                            setsearch(e.target.value)
                            // console.log(e.target.value)
                        }}
                    />
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div>
                        <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-sm font-medium">
                        <Filter size={18} />
                        <span onClick={() => { setfilterOpen(!filterOpen) }}>Filter Date</span>
                    </button>
                    {/* {filterOpen && (
                        <div className='sticky right-15  bg-white p-2'>
                            <div className='flex gap-2'>
                                <input type="checkbox" name="" id="" /><p>Lowest</p>
                            </div>
                        </div>
                    )} */}
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredOrders.map((item) => (
                            (item.map((order) => (
                                <tr key={order.item_id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-primary">
                                        {order.status[0].cashfreeOrderId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.timestamps.slice(0, 10)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent text-xs font-bold">
                                                {order.user_address[0].firstName.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{order.user_address[0].firstName} {order.user_address[0].lastName}</span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <span className={`px-2 py-0.5 rounded text-xs border ${order.status[0].paymentStatus === 'Paid' ? 'border-green-200 text-green-700 bg-green-50' : 'border-yellow-200 text-yellow-700 bg-yellow-50'}`}>
                                            {order.status[0].paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status[0].orderStatus)}
                                            {order.status[0].orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.items.map(item => item).length}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-900">
                                        ₹ {order.status[0].totalAmount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-gray-400 hover:text-brand-primary transition-colors">
                                            <Eye size={18} />
                                        </button>
                                    </td>

                                </tr>
                            )))
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
