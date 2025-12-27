import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    Menu,
    X,
    Palette,
    FileText,
    LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SidebarLink = ({ to, icon: Icon, label, active }) => (
    <Link to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
            ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm'
            : 'text-white/70 hover:bg-white/5 hover:text-white'
        }`}>
        <Icon size={20} className={`${active ? 'text-brand-accent' : 'group-hover:text-brand-accent'} transition-colors`} />
        <span className="font-medium">{label}</span>
        {active && <motion.div layoutId="active-pill" className="absolute left-0 w-1 h-8 bg-brand-accent rounded-r-full" />}
    </Link>
);

const DashboardLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const menuItems = [
        { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: ShoppingBag, label: 'Products' },
        { path: '/admin/orders', icon: FileText, label: 'Orders' },
        { path: '/admin/customers', icon: Users, label: 'Customers' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="flex h-screen bg-brand-light overflow-hidden">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
                className="bg-brand-primary h-full shadow-2xl z-20 overflow-hidden flex flex-col relative"
            >
                <div className="p-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white font-display tracking-tight">
                        Furniture<span className="text-brand-accent">.</span>
                    </h1>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
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

                <div className="p-4 mt-auto border-t border-white/10">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header */}
                <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 z-10 sticky top-0">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 focus:outline-none transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-secondary font-bold">
                                A
                            </div>
                            <span className="text-sm font-medium text-gray-700">Admin User</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
