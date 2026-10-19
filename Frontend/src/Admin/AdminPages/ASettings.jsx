import React from "react";
import { User, Lock, Bell, Shield, Store, CheckCircle } from "lucide-react";
import { message } from "antd";

const SettingsSection = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden mb-6">
    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50/70">
      <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
        <Icon size={18} />
      </div>
      <h3 className="font-bold text-gray-900 text-sm tracking-tight">{title}</h3>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Settings = () => {
  const handleSave = (e) => {
    e.preventDefault();
    message.success("Preferences saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-display">
          Store Settings
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Configure administrative profile, notifications, and security options.
        </p>
      </div>

      <form onSubmit={handleSave}>
        <SettingsSection title="Administrator Profile" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                defaultValue="Freedom Tree Administrator"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                defaultValue="admin@freedomtree.in"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all font-medium"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Store Bio / Description
              </label>
              <textarea
                rows="3"
                defaultValue="Freedom Tree is an Indian design and lifestyle store specializing in contemporary handcrafted furniture and vibrant home furnishings."
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all resize-none"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </SettingsSection>

        <SettingsSection title="Notification Preferences" icon={Bell}>
          <div className="space-y-4 text-xs">
            {[
              { title: "New Order Alerts", desc: "Instant notifications for Cashfree paid orders" },
              { title: "Low Stock Warnings", desc: "Alert when product stock falls below 3 units" },
              { title: "Customer Registrations", desc: "Daily summary of new accounts" },
              { title: "Promotional Banner Reminders", desc: "Notification when campaign banners expire" },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between py-1">
                <div>
                  <span className="font-bold text-gray-900 block text-xs">{item.title}</span>
                  <span className="text-[11px] text-gray-500">{item.desc}</span>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </div>
            ))}
          </div>
        </SettingsSection>

        <SettingsSection title="Store Security" icon={Lock}>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">Change Admin Password</p>
                <p className="text-[11px] text-gray-500">Keep account credentials safe</p>
              </div>
              <button
                type="button"
                onClick={() => message.info("Password update link sent to your registered email")}
                className="px-3.5 py-1.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Update
              </button>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div>
                <p className="font-bold text-gray-900">Two-Factor Authentication</p>
                <p className="text-[11px] text-gray-500">Extra layer of security on login</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Enabled
              </span>
            </div>
          </div>
        </SettingsSection>
      </form>
    </div>
  );
};

export default Settings;
