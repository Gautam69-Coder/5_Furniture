import React, { useEffect, useState } from "react";
import { Search, Mail, Phone, MapPin, MoreHorizontal } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../../api";

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [country, setcoutnry] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersRes = await axios.get(`${API_BASE_URL}/api/v1/admin/orders`);
        const usersRes = await axios.get(`${API_BASE_URL}/api/v1/users`);

        const token = localStorage.getItem("refreshToken")

        setOrders(ordersRes.data.data);
        setUsers(usersRes.data.data);
        const orderUserIds = ordersRes.data.data.map(o => o.userId.toString());
        const filtered = usersRes.data.data.filter(u =>
          orderUserIds.includes(u._id.toString())
        );

        setFilteredUsers(filtered);
      } catch (error) {
        console.error(error);
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

  const getUserTotals = (userId) => {
    const userOrders = orders.filter(
      order => order.userId.toString() === userId.toString()
    );

    const totalOrders = userOrders[0]?.order_details.length || 0;

    const totalSpent = userOrders.reduce((sum, order) => {
      const orderTotal = order.order_details.reduce((odSum, od) => {
        return odSum + od.status.reduce(
          (statusSum, s) => statusSum + s.totalAmount,
          0
        );
      }, 0);
      return sum + orderTotal;
    }, 0);

    return { totalOrders, totalSpent };
  };

  return (
    <div className="max-w-7xl mx-auto bg-[#F7F4EF] p-6 rounded-3xl">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-[#2E3A2F] tracking-wide">
          Customers
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">
          People who believe in sustainable living
        </p>
      </div>

      <div className="bg-white/70 backdrop-blur p-4 rounded-xl border border-black/5 mb-8 max-w-md">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name"
            className="w-full pl-9 pr-4 py-2 bg-transparent border border-black/10 rounded-lg focus:outline-none focus:border-[#C6A15B]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredUsers.map((customer) => {
          const totals = getUserTotals(customer._id);
          return (
            <div
              key={customer._id}
              className="bg-white rounded-3xl p-6 border border-black/5 hover:border-[#C6A15B]/40 transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#C6A15B]/20 text-[#2E3A2F] flex items-center justify-center font-semibold">
                    {customer.firstName.charAt(0)?.toUpperCase()}
                    {customer.lastName?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-[#2E3A2F]">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Customer ID · {customer._id.slice(-6)}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-3">
                  <Mail size={15} />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={15} />
                  <span>{customer.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={15} />
                  <span>{customer.location || "India"}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-black/5">
                <div>
                  <p className="text-xs text-gray-500">Orders</p>
                  <p className="text-lg font-semibold text-[#2E3A2F]">
                    {totals.totalOrders}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total Spent</p>
                  <p className="text-lg font-semibold text-[#C6A15B]">
                    ₹{totals.totalSpent.toLocaleString()}
                  </p>
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
