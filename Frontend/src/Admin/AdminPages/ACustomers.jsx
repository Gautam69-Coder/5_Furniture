import React, { useEffect, useState } from 'react';
import { Search, Mail, Phone, MapPin, MoreHorizontal } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../../api';


const Customers = () => {
    const [users, setUsers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch orders first
                const ordersRes = await axios.get(`${API_BASE_URL}/api/v1/admin/orders`);
                setOrders(ordersRes.data.data);

                // Fetch users
                const usersRes = await axios.get(`${API_BASE_URL}/api/v1/users`);
                setUsers(usersRes.data.data);

                // Filter only users who have orders
                const orderUserIds = ordersRes.data.data.map(o => o.userId.toString());
                const filteredUsersWithOrders = usersRes.data.data.filter(u =>
                    orderUserIds.includes(u._id.toString())
                );

                setFilteredUsers(filteredUsersWithOrders);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!search) {
            setFilteredUsers(users);
            return;
        }

        const searchText = search.toLowerCase();
        const filtered = users.filter(user => {
            const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
            return fullName.includes(searchText);
        });

        setFilteredUsers(filtered);
    }, [search, users]);

    // Compute totals for each user
    const getUserTotals = (userId) => {
        const userOrders = orders.filter(order => order.userId.toString() === userId.toString());
        const totalOrders = userOrders[0]?.order_details.length || 0;
        console.log(userOrders[0]?.order_details.length)
        const totalSpent = userOrders.reduce((sum, order) => {
            const orderTotal = order.order_details.reduce((odSum, od) => {
                return odSum + od.status.reduce((statusSum, s) => statusSum + s.totalAmount, 0);
            }, 0);
            return sum + orderTotal;
        }, 0);
        return { totalOrders, totalSpent };
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-dark font-display">Customers</h1>
                    <p className="text-gray-500 mt-1">View and manage your customer base</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6 max-w-md w-full">
                <div className="relative w-full">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((customer) => {
                    const totals = getUserTotals(customer._id);
                    return (
                        <div key={customer._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-lg">
                                        {customer.firstName.charAt(0)?.toUpperCase()} {customer.lastName?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                                            {customer.firstName.charAt(0)?.toUpperCase() + customer.firstName?.slice(1)?.toLowerCase()} {customer.lastName?.charAt(0)?.toUpperCase() + customer.lastName?.slice(1)?.toLowerCase()}
                                        </h3>
                                        <p className="text-xs text-gray-500 ">CID # {customer._id}</p>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail size={16} className="text-gray-400" />
                                    <span>{customer.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone size={16} className="text-gray-400" />
                                    <span>{customer.phoneNumber}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <MapPin size={16} className="text-gray-400" />
                                    <span>{customer.location || "No location"}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-1">Total Orders</p>
                                    <p className="font-bold text-gray-900">{totals.totalOrders}</p>
                                </div>
                                <div className="w-px h-8 bg-gray-100"></div>
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                                    <p className="font-bold text-brand-primary">₹{totals.totalSpent.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Customers;
