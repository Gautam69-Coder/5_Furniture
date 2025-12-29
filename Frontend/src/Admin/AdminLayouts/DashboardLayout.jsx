import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  Menu,
  X,
  FileText,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";

const SidebarLink = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
      ${
        active
          ? "bg-[#3B4A3F] text-[#C6A15B]"
          : "text-white/80 hover:bg-[#3B4A3F]/60 hover:text-white"
      }`}
  >
    <Icon size={18} />
    <span className="text-sm tracking-wide">{label}</span>
  </Link>
);

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/products", icon: ShoppingBag, label: "Products" },
    { path: "/admin/orders", icon: FileText, label: "Orders" },
    { path: "/admin/customers", icon: Users, label: "Customers" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-[#F7F4EF] overflow-hidden">
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 0 }}
        className="bg-[#2E3A2F] h-full shadow-xl overflow-hidden flex flex-col"
      >
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="text-xl font-semibold text-white tracking-wide">
            Furniture<span className="text-[#C6A15B]">.</span>
          </h1>
          <p className="text-xs text-white/60 mt-1">Sustainable Living</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <SidebarLink
              key={item.path}
              to={item.path}
              icon={item.icon}
              label={item.label}
              active={location.pathname === item.path}
            />
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-white/70 hover:text-[#C6A15B] hover:bg-[#3B4A3F]/60 rounded-lg transition-all">
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-[#F7F4EF] border-b border-black/5 flex items-center justify-between px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-black/5 text-gray-700"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C6A15B]/20 flex items-center justify-center text-[#2E3A2F] font-semibold">
              A
            </div>
            <span className="text-sm text-gray-800">Admin</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-[#F7F4EF]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
