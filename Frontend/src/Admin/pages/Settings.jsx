import React from 'react';
import { User, Lock, Bell, Globe, Shield, CreditCard } from 'lucide-react';

const SettingsSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
            <Icon size={20} className="text-brand-primary" />
            <h3 className="font-bold text-gray-900">{title}</h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const Settings = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-dark font-display">Settings</h1>
                <p className="text-gray-500 mt-1">Manage your account and preferences</p>
            </div>

            <SettingsSection title="Profile Information" icon={User}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input type="text" defaultValue="Admin User" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input type="email" defaultValue="admin@furniture.com" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea rows="3" defaultValue="Administrator of the Furniture Store." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"></textarea>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-all font-medium">Save Changes</button>
                </div>
            </SettingsSection>

            <SettingsSection title="Notifications" icon={Bell}>
                <div className="space-y-4">
                    {['New Order Alerts', 'Low Stock Warnings', 'New Customer Registrations', 'Weekly Reports'].map((item) => (
                        <div key={item} className="flex items-center justify-between">
                            <span className="text-gray-700">{item}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </SettingsSection>

            <SettingsSection title="Security" icon={Lock}>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Change Password</p>
                            <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Update</button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Enable</button>
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
};

export default Settings;
