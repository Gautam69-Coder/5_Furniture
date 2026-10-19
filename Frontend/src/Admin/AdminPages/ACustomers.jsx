import React, { useEffect, useState } from "react";
import { Search, Mail, Phone, MapPin, Users, ShoppingBag, IndianRupee } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../../api";

const Customers = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/v1/admin/orders`).catch(() => ({ data: { data: [] } })),
          axios.get(`${API_BASE_URL}/api/v1/users`).catch(() => ({ data: { data: [] } })),
        ]);

        const oList = ordersRes.data.data || [];
        const uList = usersRes.data.data || [];

        setOrders(oList);
        setUsers(uList);
        setFilteredUsers(uList);
      } catch (error) {
        console.error("Fetch customers error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(users);
      return;
    }

    const q = search.toLowerCase();
    const filtered = users.filter((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      const email = user.email?.toLowerCase() || "";
      const phone = user.phoneNumber || user.phone || "";
      return fullName.includes(q) || email.includes(q) || phone.includes(q);
    });

    setFilteredUsers(filtered);
  }, [search, users]);

  const getUserTotals = (userId) => {
    if (!userId) return { totalOrders: 0, totalSpent: 0 };

    const userOrders = orders.filter((order) => {
      const uid = order.userId?._id || order.userId;
      return uid && uid.toString() === userId.toString();
    });

    let totalOrders = 0;
    let totalSpent = 0;

    userOrders.forEach((order) => {
      if (order.order_details && Array.isArray(order.order_details)) {
        totalOrders += order.order_details.length;
        order.order_details.forEach((od) => {
          if (od.status && Array.isArray(od.status)) {
            od.status.forEach((st) => {
              totalSpent += Number(st.totalAmount) || 0;
            });
          }
        });
      }
    });

    return { totalOrders, totalSpent };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-display">
              Customer Accounts
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {filteredUsers.length} registered
            </span>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Registered Freedom Tree clientele, lifetime order value, and verified contacts.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs max-w-md">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by customer name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((customer) => {
          const totals = getUserTotals(customer._id);
          const initials = `${customer.firstName?.[0] || ""}${customer.lastName?.[0] || ""}`.toUpperCase() || "FT";

          return (
            <div
              key={customer._id}
              className="bg-white rounded-3xl p-6 border border-gray-200/80 hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Customer Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold text-base border border-emerald-500/20 shadow-xs">
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base leading-snug">
                        {customer.firstName} {customer.lastName || ""}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                        Client ID · #{customer._id?.slice(-6)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2.5 text-xs text-gray-600 mb-6 bg-gray-50/70 p-3.5 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2.5 truncate">
                    <Mail size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate">{customer.email || "No email"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone size={14} className="text-gray-400 shrink-0" />
                    <span>{customer.phoneNumber || customer.phone || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin size={14} className="text-gray-400 shrink-0" />
                    <span>{customer.location || "India"}</span>
                  </div>
                </div>
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100 text-xs">
                <div>
                  <span className="text-[11px] text-gray-400 font-medium block">Total Orders</span>
                  <span className="text-base font-extrabold text-gray-900 font-mono">
                    {totals.totalOrders}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-gray-400 font-medium block">Lifetime Spend</span>
                  <span className="text-base font-extrabold text-emerald-700 font-mono">
                    ₹ {totals.totalSpent.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredUsers.length === 0 && !loading && (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-gray-200">
            <Users size={36} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-600">No customers found</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Try adjusting your search by name or contact info.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
