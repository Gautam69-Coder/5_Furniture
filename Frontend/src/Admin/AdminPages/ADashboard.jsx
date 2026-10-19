import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  IndianRupee,
  ArrowUpRight,
  Package,
  Flag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../api";

const StatCard = ({ title, value, change, icon: Icon, color, subtitle }) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ duration: 0.2 }}
    className="bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-gray-200/80 hover:shadow-md transition-all"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} text-white flex items-center justify-center shadow-xs`}>
        <Icon size={22} />
      </div>
      {change && (
        <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          +{change}%
          <ArrowUpRight size={12} className="ml-0.5" />
        </span>
      )}
    </div>
    <h3 className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">
      {title}
    </h3>
    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
      {value}
    </h2>
    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [usersCount, setUsersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [statusCounts, setStatusCounts] = useState({
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch Orders
        const ordersRes = await axios.get(`${API_BASE_URL}/api/v1/admin/orders`);
        const rawOrders = ordersRes.data.data || [];

        // Flatten all sub-orders
        const flattened = [];
        let revenue = 0;
        const counts = { processing: 0, shipped: 0, delivered: 0, cancelled: 0 };

        rawOrders.forEach((doc) => {
          if (doc.order_details && Array.isArray(doc.order_details)) {
            doc.order_details.forEach((od) => {
              flattened.push({
                ...od,
                parentUserId: doc.userId,
                docCreatedAt: doc.createdAt,
              });

              const statusObj = od.status?.[0];
              if (statusObj) {
                const amount = Number(statusObj.totalAmount) || 0;
                revenue += amount;

                const oStatus = (statusObj.orderStatus || "processing").toLowerCase();
                if (counts[oStatus] !== undefined) {
                  counts[oStatus] += 1;
                } else {
                  counts.processing += 1;
                }
              }
            });
          }
        });

        setOrders(flattened);
        setTotalRevenue(revenue);
        setStatusCounts(counts);

        // Fetch Products count
        const productsRes = await axios.get(`${API_BASE_URL}/api/v1/product`);
        setProducts(productsRes.data.data || []);

        // Fetch Users count
        const usersRes = await axios.get(`${API_BASE_URL}/api/v1/users`);
        setUsersCount(usersRes.data.data?.length || 0);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#111827] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-emerald-500/10 blur-3xl pointer-events-none rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Store Overview
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-display">
              Freedom Tree Admin Portal
            </h1>
            <p className="text-gray-300 text-sm mt-1 max-w-xl">
              Track real-time orders, manage catalog inventory, update promotional banners, and monitor your home decor brand.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/admin/products")}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md transition-all flex items-center gap-2"
            >
              <Package size={16} />
              <span>Catalog Products</span>
            </button>
            <button
              onClick={() => navigate("/admin/banners")}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/15 transition-all flex items-center gap-2"
            >
              <Flag size={16} />
              <span>Promo Flags & Banners</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value={`₹ ${totalRevenue.toLocaleString("en-IN")}`}
          change={12.4}
          icon={IndianRupee}
          color="bg-emerald-600"
          subtitle="Processed via Cashfree"
        />
        <StatCard
          title="Total Orders"
          value={orders.length}
          change={8.5}
          icon={ShoppingBag}
          color="bg-indigo-600"
          subtitle="Across all channels"
        />
        <StatCard
          title="Catalog Products"
          value={products.length}
          icon={Package}
          color="bg-amber-600"
          subtitle="Active live listings"
        />
        <StatCard
          title="Registered Customers"
          value={usersCount}
          icon={Users}
          color="bg-cyan-600"
          subtitle="Total accounts created"
        />
      </div>

      {/* 2-Column Section: Order Fulfillment Status & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Fulfillment Health</h3>
              <span className="text-xs text-gray-400 font-medium">{orders.length} Total</span>
            </div>
            <p className="text-xs text-gray-500 mb-6">
              Status distribution across customer orders.
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <Clock size={14} /> Processing
                  </span>
                  <span className="text-gray-900">{statusCounts.processing}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${orders.length ? (statusCounts.processing / orders.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-blue-700">
                    <Truck size={14} /> Shipped
                  </span>
                  <span className="text-gray-900">{statusCounts.shipped}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${orders.length ? (statusCounts.shipped / orders.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 size={14} /> Delivered
                  </span>
                  <span className="text-gray-900">{statusCounts.delivered}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${orders.length ? (statusCounts.delivered / orders.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-rose-700">
                    <XCircle size={14} /> Cancelled
                  </span>
                  <span className="text-gray-900">{statusCounts.cancelled}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-rose-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${orders.length ? (statusCounts.cancelled / orders.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-gray-100">
            <Link
              to="/admin/orders"
              className="w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-gray-200"
            >
              <span>Manage All Orders</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Recent Orders</h3>
              <p className="text-xs text-gray-500">Latest customer purchases across India</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View Full List
              <ExternalLink size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.slice(0, 6).map((order, idx) => {
                  const status = order.status?.[0];
                  const address = order.user_address?.[0];
                  const item = order.items?.[0];

                  return (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                      onClick={() => navigate("/admin/orders")}
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-gray-700">
                        {status?.cashfreeOrderId || `#${order._id?.slice(-8)}`}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {address?.firstName ? `${address.firstName} ${address.lastName || ""}` : "Guest Customer"}
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-[180px] truncate">
                        {item?.item_name || "Custom Furniture Item"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-semibold border text-[11px] capitalize ${getStatusBadge(
                            status?.orderStatus
                          )}`}
                        >
                          {status?.orderStatus || "Processing"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-gray-900">
                        ₹ {status?.totalAmount ? Number(status.totalAmount).toLocaleString("en-IN") : 0}
                      </td>
                    </tr>
                  );
                })}

                {orders.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400 text-xs">
                      No orders found in the database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
