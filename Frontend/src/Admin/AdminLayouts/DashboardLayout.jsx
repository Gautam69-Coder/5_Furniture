import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  Menu,
  X,
  FileText,
  Flag,
  ExternalLink,
  Store,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/products", icon: ShoppingBag, label: "Products" },
    { path: "/admin/orders", icon: FileText, label: "Orders" },
    { path: "/admin/banners", icon: Flag, label: "Banners & Flags" },
    { path: "/admin/customers", icon: Users, label: "Customers" },
    { path: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  // Helper for active path
  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname.startsWith(path);
  };

  // Current page title
  const getCurrentTitle = () => {
    const item = menuItems.find((m) => isActive(m.path));
    return item ? item.label : "Admin Portal";
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans text-gray-900 antialiased">
      {/* Sidebar Desktop & Responsive Drawer */}
      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? 270 : 0,
          opacity: isSidebarOpen ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="bg-[#111827] text-white h-full shadow-2xl overflow-hidden flex flex-col shrink-0 border-r border-gray-800 z-30"
      >
        {/* Brand Header */}
        <div className="px-6 py-5 border-b border-gray-800/80 flex items-center justify-between">
          <Link to="/" className="flex flex-col gap-1 group">
            <img
              src="https://res.cloudinary.com/gautamcloudinary/image/upload/v1766924191/freedomtree_phpfqw.avif"
              alt="Freedom Tree"
              className="h-7 w-auto invert brightness-200 transition-transform group-hover:scale-105"
            />
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium tracking-widest text-emerald-400 uppercase">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-gray-400 uppercase">
            Store Management
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? "bg-emerald-500/15 text-emerald-400 font-semibold border-l-4 border-emerald-500 shadow-sm"
                    : "text-gray-300 hover:bg-gray-800/60 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={19}
                    className={`transition-colors ${
                      active
                        ? "text-emerald-400"
                        : "text-gray-400 group-hover:text-white"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {active && (
                  <ChevronRight size={14} className="text-emerald-400 opacity-80" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Quick Links */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/50 space-y-2">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all border border-gray-800/80"
          >
            <div className="flex items-center gap-2">
              <Store size={15} className="text-emerald-400" />
              <span>Live Storefront</span>
            </div>
            <ExternalLink size={13} className="text-gray-500" />
          </Link>

          <div className="flex items-center gap-2 px-2 pt-1 text-[11px] text-gray-500">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Freedom Tree E-Commerce v2.4</span>
          </div>
        </div>
      </motion.aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200/80 px-6 flex items-center justify-between shrink-0 shadow-xs z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none"
              title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 hidden sm:inline">Freedom Tree</span>
              <span className="text-xs text-gray-300 hidden sm:inline">/</span>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                {getCurrentTitle()}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200/80 rounded-lg transition-colors border border-gray-200"
            >
              <Store size={14} className="text-emerald-600" />
              <span>Visit Website</span>
            </Link>

            <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                FT
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-semibold text-gray-900 leading-tight">
                  Admin Team
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">Online</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F8F9FA]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
