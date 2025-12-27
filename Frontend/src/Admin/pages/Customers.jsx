import React from 'react';
import { Search, Mail, Phone, MapPin, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Customers = () => {
    // Dummy data
    const [user, setuser] = useState([]);
    const [Orders, setOrders] = useState([]);
    const [search, setsearch] = useState("")
    const [filteredUser, setfilteredUser] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res2 = await axios.get('/api/v1/admin/orders');
                setOrders(res2.data.data);
                // console.log(res2.data.data)

                const res = await axios.get('/api/v1/users');
                setuser(res.data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);


    useEffect(() => {
        if (!search) {
            setfilteredUser(user);
            return
        }

        const searchText = search.toLowerCase();
        console.log(searchText)

        const filtered = user.filter((item) => {

            const user = `${item.firstName || ""} ${item.lastName || ""}`.toLowerCase()
            console.log(user)

            return (
                user.includes(searchText)
            )
        })

        console.log(filtered)
        setfilteredUser(filtered)

    }, [search, user])



    const customers = [
        { id: 1, name: 'Jane Doe', email: 'jane@example.com', phone: '+1 (555) 123-4567', location: 'New York, USA', orders: 12, spent: '$2,450.00' },
        { id: 2, name: 'John Smith', email: 'john@example.com', phone: '+1 (555) 987-6543', location: 'London, UK', orders: 5, spent: '$890.00' },
        { id: 3, name: 'Alice Johnson', email: 'alice@example.com', phone: '+1 (555) 456-7890', location: 'Toronto, Canada', orders: 8, spent: '$1,200.00' },
        { id: 4, name: 'Bob Wilson', email: 'bob@example.com', phone: '+1 (555) 234-5678', location: 'Sydney, Australia', orders: 3, spent: '$450.00' },
        { id: 5, name: 'Emma Brown', email: 'emma@example.com', phone: '+1 (555) 876-5432', location: 'Paris, France', orders: 15, spent: '$3,100.00' },
        { id: 6, name: 'Michael Davis', email: 'michael@example.com', phone: '+1 (555) 345-6789', location: 'Berlin, Germany', orders: 6, spent: '$950.00' },
    ];

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
                        onChange={(e) => {
                            setsearch(e.target.value)
                        }}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUser.map((customer) => (
                    <div key={customer._id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-lg">
                                    {customer.firstName.charAt(0)?.toUpperCase()} {customer.lastName.charAt(0)?.toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-brand-primary transition-colors">
                                        {customer.firstName.charAt(0)?.toUpperCase() + customer.firstName.slice(1)?.toLowerCase()} {customer.lastName.charAt(0)?.toUpperCase() + customer.lastName.slice(1)?.toLowerCase()}
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
                                <p className="font-bold text-gray-900">{customer.totalOrders}</p>
                            </div>
                            <div className="w-px h-8 bg-gray-100"></div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                                <p className="font-bold text-brand-primary">{customer.spent}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Customers;
