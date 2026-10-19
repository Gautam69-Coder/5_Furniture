import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
  Package,
  Calendar,
  MapPin,
  Phone,
  User,
  CreditCard,
  X,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";
import { message, Modal } from "antd";
import { API_BASE_URL } from "../../api";
import { motion, AnimatePresence } from "framer-motion";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [rawOrders, setRawOrders] = useState([]);
  const [flattenedOrders, setFlattenedOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Selected Order for Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders from backend
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/admin/orders`);
      const docs = response.data.data || [];
      setRawOrders(docs);

      const flat = [];
      docs.forEach((doc) => {
        if (doc.order_details && Array.isArray(doc.order_details)) {
          doc.order_details.forEach((od) => {
            flat.push({
              ...od,
              parentDocId: doc._id,
              userId: doc.userId,
              createdAt: od.timestamps || doc.createdAt,
            });
          });
        }
      });

      setFlattenedOrders(flat);
      setFilteredOrders(flat);
    } catch (error) {
      console.error("Fetch orders error:", error);
      message.error("Failed to fetch customer orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter & Search
  useEffect(() => {
    let list = [...flattenedOrders];

    // Filter by Tab
    if (activeTab !== "all") {
      list = list.filter((ord) => {
        const s = ord.status?.[0]?.orderStatus?.toLowerCase() || "processing";
        return s === activeTab.toLowerCase();
      });
    }

    // Filter by Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((ord) => {
        const cashfreeId = ord.status?.[0]?.cashfreeOrderId?.toLowerCase() || "";
        const orderId = ord._id?.toLowerCase() || "";
        const addr = ord.user_address?.[0];
        const custName = `${addr?.firstName || ""} ${addr?.lastName || ""}`.toLowerCase();
        const phone = addr?.phone?.toLowerCase() || "";
        const itemNames = ord.items?.map((it) => it.item_name?.toLowerCase()).join(" ") || "";

        return (
          cashfreeId.includes(q) ||
          orderId.includes(q) ||
          custName.includes(q) ||
          phone.includes(q) ||
          itemNames.includes(q)
        );
      });
    }

    setFilteredOrders(list);
  }, [activeTab, search, flattenedOrders]);

  // Handle Order Status Update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/api/v1/admin/orders/${orderId}/status`, {
        status: newStatus,
      });

      message.success(`Order marked as ${newStatus}`);

      // Update state in memory
      setFlattenedOrders((prev) =>
        prev.map((ord) => {
          if (ord._id === orderId) {
            const updatedStatus = [...(ord.status || [])];
            if (updatedStatus[0]) {
              updatedStatus[0] = { ...updatedStatus[0], orderStatus: newStatus };
            }
            return { ...ord, status: updatedStatus };
          }
          return ord;
        })
      );

      // If details modal is open for this order, update it too
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => {
          const s = [...(prev.status || [])];
          if (s[0]) s[0] = { ...s[0], orderStatus: newStatus };
          return { ...prev, status: s };
        });
      }
    } catch (error) {
      console.error("Update status error:", error);
      message.error(error.response?.data?.message || "Failed to update order status");
    }
  };

  // Export as CSV
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      message.warning("No orders to export");
      return;
    }

    const headers = [
      "Order ID",
      "Date",
      "Customer Name",
      "Phone",
      "City",
      "Total Amount (INR)",
      "Payment Status",
      "Order Status",
    ];

    const rows = filteredOrders.map((ord) => {
      const status = ord.status?.[0];
      const addr = ord.user_address?.[0];
      return [
        `"${status?.cashfreeOrderId || ord._id}"`,
        `"${new Date(ord.createdAt).toLocaleDateString()}"`,
        `"${addr?.firstName || ""} ${addr?.lastName || ""}"`,
        `"${addr?.phone || ""}"`,
        `"${addr?.city || ""}"`,
        status?.totalAmount || 0,
        `"${status?.paymentStatus || "PENDING"}"`,
        `"${status?.orderStatus || "processing"}"`,
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `freedom_tree_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success("Orders exported to CSV successfully");
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle size={14} className="mr-1 text-emerald-600" />;
      case "processing":
        return <Clock size={14} className="mr-1 text-amber-600" />;
      case "shipped":
        return <Truck size={14} className="mr-1 text-blue-600" />;
      case "cancelled":
        return <XCircle size={14} className="mr-1 text-rose-600" />;
      default:
        return null;
    }
  };

  const getStatusPill = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "processing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-display">
              Orders Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {filteredOrders.length} orders
            </span>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Track customer transactions, update shipping stages, and inspect order details.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl shadow-xs font-semibold text-xs sm:text-sm transition-all"
        >
          <Download size={17} />
          <span>Export Orders (CSV)</span>
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-px">
        {[
          { id: "all", label: "All Orders" },
          { id: "processing", label: "Processing" },
          { id: "shipped", label: "Shipped" },
          { id: "delivered", label: "Delivered" },
          { id: "cancelled", label: "Cancelled" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs sm:text-sm font-semibold transition-all relative whitespace-nowrap ${
              activeTab === tab.id
                ? "text-emerald-700"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50/50 rounded-t-xl"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative flex-1 w-full">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by Cashfree order ID, customer name, phone, or product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Order ID</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4 text-right">Total</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((ord) => {
                const status = ord.status?.[0];
                const addr = ord.user_address?.[0];
                const currentStatus = status?.orderStatus || "processing";

                return (
                  <tr
                    key={ord._id}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    {/* Order ID */}
                    <td className="py-3.5 px-4 sm:px-6 font-mono font-semibold text-gray-900">
                      {status?.cashfreeOrderId || `#${ord._id?.slice(-8)}`}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-gray-500">
                      {ord.createdAt
                        ? new Date(ord.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Recent"}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">
                        {addr?.firstName} {addr?.lastName || ""}
                      </div>
                      <div className="text-[11px] text-gray-400">
                        {addr?.city ? `${addr.city}, India` : "India"}
                      </div>
                    </td>

                    {/* Payment Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${
                          status?.paymentStatus === "PAID" || status?.paymentStatus === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        {status?.paymentStatus || "PENDING"}
                      </span>
                    </td>

                    {/* Order Status Selector */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={currentStatus.toLowerCase()}
                          onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-xs font-bold border cursor-pointer focus:outline-none transition-all capitalize ${getStatusPill(
                            currentStatus
                          )}`}
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>

                    {/* Items Count */}
                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      {ord.items?.length || 1} {ord.items?.length === 1 ? "item" : "items"}
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 text-right font-extrabold text-gray-900 font-mono text-sm">
                      ₹ {Number(status?.totalAmount || 0).toLocaleString("en-IN")}
                    </td>

                    {/* View Details Action */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="View Full Order Details"
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <Package size={36} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-semibold text-gray-600">No orders found</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      No orders match the current filter or search criteria.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-xs z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden my-auto"
            >
              {/* Modal Header */}
              <div className="bg-[#111827] text-white px-6 py-4 flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <span>Order:</span>
                    <span className="font-mono text-emerald-400">
                      {selectedOrder.status?.[0]?.cashfreeOrderId || selectedOrder._id}
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Placed on{" "}
                    {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-white rounded-full p-1"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
                {/* Shipping Address & Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-gray-900 mb-2 uppercase text-[11px]">
                      <MapPin size={14} className="text-emerald-600" />
                      <span>Shipping Address</span>
                    </div>
                    {selectedOrder.user_address?.[0] ? (
                      <div className="text-gray-600 leading-relaxed">
                        <div className="font-semibold text-gray-900">
                          {selectedOrder.user_address[0].firstName}{" "}
                          {selectedOrder.user_address[0].lastName}
                        </div>
                        <div>{selectedOrder.user_address[0].address}</div>
                        <div>
                          {selectedOrder.user_address[0].city},{" "}
                          {selectedOrder.user_address[0].state} -{" "}
                          {selectedOrder.user_address[0].pin}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-gray-700">
                          <Phone size={12} />
                          <span>{selectedOrder.user_address[0].phone}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400">No address recorded</div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-gray-900 mb-2 uppercase text-[11px]">
                      <CreditCard size={14} className="text-emerald-600" />
                      <span>Payment & Stage</span>
                    </div>
                    <div className="space-y-2 text-gray-600">
                      <div>
                        Gateway: <strong className="text-gray-900">Cashfree PG</strong>
                      </div>
                      <div>
                        Payment:{" "}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            selectedOrder.status?.[0]?.paymentStatus === "PAID"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {selectedOrder.status?.[0]?.paymentStatus || "PENDING"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <span>Fulfillment:</span>
                        <select
                          value={selectedOrder.status?.[0]?.orderStatus || "processing"}
                          onChange={(e) =>
                            handleStatusChange(selectedOrder._id, e.target.value)
                          }
                          className="px-2 py-1 bg-white border border-gray-300 rounded-lg text-xs font-bold capitalize cursor-pointer focus:outline-none"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-3">
                    Order Items ({selectedOrder.items?.length || 0})
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200"
                      >
                        <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                          <img
                            src={item.item_image_url || "https://placehold.co/100x100"}
                            alt={item.item_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-gray-900 truncate">
                            {item.item_name}
                          </h5>
                          <div className="text-[11px] text-gray-500">
                            Qty: {item.item_quantity || 1}
                            {item.item_size ? ` · Size: ${item.item_size}` : ""}
                            {item.item_material ? ` · Material: ${item.item_material}` : ""}
                          </div>
                        </div>
                        <div className="text-right font-extrabold text-gray-900 font-mono text-sm">
                          ₹ {Number(item.item_discounted_unit_price || item.item_original_unit_price || 0).toLocaleString("en-IN")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Summary */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <span className="text-sm font-bold text-gray-900">Total Charged</span>
                  <span className="text-xl font-extrabold text-emerald-700 font-mono">
                    ₹ {Number(selectedOrder.status?.[0]?.totalAmount || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-semibold text-xs rounded-xl"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
