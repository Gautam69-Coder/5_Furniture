import React, { useState, useEffect } from "react";
import {
  Flag,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Sparkles,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import axios from "axios";
import { message, Modal } from "antd";
import { API_BASE_URL } from "../../api";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_STARTER_BANNERS = [
  {
    title: "Soft, Serene, Sensory Nest",
    subtitle: "Thoughtful designs and joyful finds for every living room occasion",
    badge: "NEW ARRIVAL",
    imageUrl:
      "https://freedomtree.in/cdn/shop/files/NOV_START_25_c5440a48-26cb-4ec7-8c30-a5beba163d0d_1900x.jpg?v=1762593648",
    linkUrl: "/collections/furniture",
    position: "home_hero",
    order: 1,
    isActive: true,
  },
  {
    title: "Handcrafted Modern Luxury",
    subtitle: "Solid mango wood & teak wood contemporary furniture collections",
    badge: "FEATURED",
    imageUrl:
      "https://freedomtree.in/cdn/shop/files/furniture_banner_desktop_1900x.jpg?v=1762240841",
    linkUrl: "/collections/furniture",
    position: "home_hero",
    order: 2,
    isActive: true,
  },
  {
    title: "Freedom Tree Festive Sale",
    subtitle: "Curated home accents, upholstery, and decorative lamps",
    badge: "SALE",
    imageUrl:
      "https://freedomtree.in/cdn/shop/files/02-_Small_Banner_File__2025_e3fc23b9-1dbe-4d84-945e-577588e7cc7c_1900x.jpg?v=1758280962",
    linkUrl: "/collections/furniture",
    position: "promo_strip",
    order: 3,
    isActive: true,
  },
];

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerToEdit, setBannerToEdit] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    badge: "FEATURED",
    imageUrl: "",
    linkUrl: "/collections/furniture",
    position: "home_hero",
    order: 0,
    isActive: true,
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/banners`);
      setBanners(res.data.data || []);
    } catch (err) {
      console.error("Fetch banners error:", err);
      message.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Open Modal Add Mode
  const handleOpenAdd = () => {
    setBannerToEdit(null);
    setFormData({
      title: "",
      subtitle: "",
      badge: "FEATURED",
      imageUrl: "",
      linkUrl: "/collections/furniture",
      position: "home_hero",
      order: banners.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open Modal Edit Mode
  const handleOpenEdit = (b) => {
    setBannerToEdit(b);
    setFormData({
      title: b.title || "",
      subtitle: b.subtitle || "",
      badge: b.badge || "FEATURED",
      imageUrl: b.imageUrl || "",
      linkUrl: b.linkUrl || "/collections/furniture",
      position: b.position || "home_hero",
      order: b.order || 0,
      isActive: b.isActive !== undefined ? b.isActive : true,
    });
    setIsModalOpen(true);
  };

  // Toggle Active State
  const handleToggleActive = async (banner) => {
    try {
      const newActive = !banner.isActive;
      await axios.put(`${API_BASE_URL}/api/v1/banners/${banner._id}`, {
        isActive: newActive,
      });
      message.success(`Banner is now ${newActive ? "Active" : "Hidden"}`);
      setBanners((prev) =>
        prev.map((b) => (b._id === banner._id ? { ...b, isActive: newActive } : b))
      );
    } catch (err) {
      message.error("Failed to toggle banner status");
    }
  };

  // Delete Banner
  const handleDeleteBanner = (b) => {
    Modal.confirm({
      title: "Delete Promotional Banner",
      icon: <AlertTriangle className="text-rose-500 mr-2" size={22} />,
      content: `Are you sure you want to delete "${b.title}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/api/v1/banners/${b._id}`);
          message.success("Banner deleted successfully");
          setBanners((prev) => prev.filter((item) => item._id !== b._id));
        } catch (err) {
          message.error("Failed to delete banner");
        }
      },
    });
  };

  // Populate Starter Banners
  const handleSeedBanners = async () => {
    try {
      setLoading(true);
      for (const starter of DEFAULT_STARTER_BANNERS) {
        await axios.post(`${API_BASE_URL}/api/v1/banners`, starter);
      }
      message.success("Default Freedom Tree banners populated successfully!");
      fetchBanners();
    } catch (err) {
      message.error("Failed to populate starter banners");
    } finally {
      setLoading(false);
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.imageUrl.trim()) {
      message.error("Title and Image URL are required");
      return;
    }

    setModalLoading(true);
    try {
      if (bannerToEdit) {
        await axios.put(`${API_BASE_URL}/api/v1/banners/${bannerToEdit._id}`, formData);
        message.success("Banner updated successfully");
      } else {
        await axios.post(`${API_BASE_URL}/api/v1/banners`, formData);
        message.success("New banner created successfully");
      }

      setIsModalOpen(false);
      fetchBanners();
    } catch (err) {
      message.error(err.response?.data?.message || "Failed to save banner");
    } finally {
      setModalLoading(false);
    }
  };

  const getBadgeStyle = (badge) => {
    switch (badge?.toUpperCase()) {
      case "SALE":
        return "bg-rose-500 text-white";
      case "NEW ARRIVAL":
      case "NEW":
        return "bg-emerald-600 text-white";
      case "FESTIVE":
        return "bg-amber-500 text-white";
      case "EXCLUSIVE":
        return "bg-purple-600 text-white";
      default:
        return "bg-gray-900 text-white";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-display">
              Banners & Promotional Flags
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {banners.length} slides
            </span>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Manage homepage hero slides, campaign banners, and promotional flags across Freedom Tree.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {banners.length === 0 && !loading && (
            <button
              onClick={handleSeedBanners}
              className="px-3.5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2"
            >
              <Sparkles size={16} className="text-amber-500" />
              <span>Load Starter Banners</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-semibold text-sm cursor-pointer"
          >
            <Plus size={18} />
            <span>Add Banner / Flag</span>
          </button>
        </div>
      </div>

      {/* Grid of Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div
            key={banner._id}
            className={`bg-white rounded-3xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
              banner.isActive ? "border-gray-200" : "border-gray-200/60 opacity-75"
            }`}
          >
            {/* Visual Slide Preview */}
            <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden">
              <img
                src={banner.imageUrl}
                alt={banner.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/600x340?text=Banner+Image+Error";
                }}
                className="w-full h-full object-cover"
              />

              {/* Campaign Flag Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-md ${getBadgeStyle(
                    banner.badge
                  )}`}
                >
                  {banner.badge || "FEATURED"}
                </span>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/60 text-white backdrop-blur-xs">
                  {banner.position || "home_hero"}
                </span>
              </div>

              {/* Status Indicator */}
              <button
                onClick={() => handleToggleActive(banner)}
                className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md cursor-pointer transition-all flex items-center gap-1 ${
                  banner.isActive
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-800/90 text-gray-300"
                }`}
                title="Click to toggle active status"
              >
                {banner.isActive ? (
                  <>
                    <CheckCircle size={11} />
                    <span>Live</span>
                  </>
                ) : (
                  <>
                    <XCircle size={11} />
                    <span>Hidden</span>
                  </>
                )}
              </button>
            </div>

            {/* Info Body */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-1">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {banner.subtitle}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-1 text-[11px] font-medium text-gray-600 truncate max-w-[180px]">
                  <ExternalLink size={12} className="shrink-0 text-emerald-600" />
                  <span className="truncate">{banner.linkUrl}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(banner)}
                    className="p-1.5 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    title="Edit Banner"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteBanner(banner)}
                    className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Banner"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && !loading && (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
          <Flag size={44} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-gray-800">
            No Banners or Promotional Flags Configured
          </h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto mt-1 mb-5">
            Add custom hero slides or load starter banners to feature seasonal collections and promotional announcements.
          </p>
          <button
            onClick={handleSeedBanners}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs"
          >
            Load Starter Freedom Tree Banners
          </button>
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-xs z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden my-auto"
            >
              {/* Header */}
              <div className="bg-[#111827] text-white px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Flag size={18} className="text-emerald-400" />
                  <h3 className="text-base font-bold">
                    {bannerToEdit ? "Edit Banner Slide" : "New Promotional Banner"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-white rounded-full p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
                {/* Image URL with Preview */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Banner Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://freedomtree.in/cdn/shop/files/hero-slide.jpg"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 font-mono"
                    required
                  />

                  {formData.imageUrl && (
                    <div className="mt-2.5 rounded-xl overflow-hidden aspect-[16/7] border border-gray-200 bg-gray-50">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/600x260?text=Invalid+Image+URL";
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Banner Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. India's Happiest Living Store"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. Explore contemporary furniture handcrafted with joy"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Campaign Flag Badge
                    </label>
                    <select
                      value={formData.badge}
                      onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 font-bold"
                    >
                      <option value="FEATURED">FEATURED</option>
                      <option value="SALE">SALE</option>
                      <option value="NEW ARRIVAL">NEW ARRIVAL</option>
                      <option value="FESTIVE">FESTIVE</option>
                      <option value="EXCLUSIVE">EXCLUSIVE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Position
                    </label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                    >
                      <option value="home_hero">Home Hero Slider</option>
                      <option value="promo_strip">Promo Mid Strip</option>
                      <option value="category_banner">Category Banner</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                    Destination Link
                  </label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="/collections/furniture"
                    className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 font-mono"
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <span className="font-bold text-gray-900 block">Status: Active</span>
                    <span className="text-[11px] text-gray-500">
                      Display banner on the live storefront
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 text-emerald-600 rounded cursor-pointer"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {modalLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      "Save Banner Slide"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Banners;
