import React, { useState, useEffect } from "react";
import { useQuickView } from "../../../context/PopupContext";
import { motion } from "framer-motion";
import axios from "axios";
import { message } from "antd";
import { API_BASE_URL } from "../../../api";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";

const AddProductPopup = ({
  isOpen: propIsOpen,
  onClose: propOnClose,
  productToEdit = null,
  onSuccess,
}) => {
  const { isOpenEdit, setisOpenEdit } = useQuickView();

  // Support both props and legacy context
  const isVisible = propIsOpen !== undefined ? propIsOpen : isOpenEdit;
  const handleClose = () => {
    if (propOnClose) propOnClose();
    setisOpenEdit(false);
  };

  const isEditing = Boolean(productToEdit && productToEdit._id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "furniture",
    subCategory: "Chairs",
    price: "",
    stock: "15",
    description: "",
    imageUrl: "",
    sizeCM: "",
    frameMaterial: "TEAK WOOD",
    color: "Natural",
  });

  // Prepopulate if editing
  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name || "",
        category: productToEdit.category || "furniture",
        subCategory: productToEdit.subCategory || productToEdit.subcategory || "Chairs",
        price: productToEdit.price !== undefined ? String(productToEdit.price) : "",
        stock: productToEdit.stock !== undefined ? String(productToEdit.stock) : "10",
        description: productToEdit.description || "",
        imageUrl:
          Array.isArray(productToEdit.images) && productToEdit.images.length > 0
            ? productToEdit.images[0]
            : typeof productToEdit.images === "string"
            ? productToEdit.images
            : "",
        sizeCM: productToEdit.details?.sizeCM || productToEdit.sizeCM || "",
        frameMaterial:
          productToEdit.details?.frameMaterial ||
          productToEdit.frameMaterial ||
          productToEdit.material ||
          "TEAK WOOD",
        color: productToEdit.color || "Natural",
      });
    } else {
      setFormData({
        name: "",
        category: "furniture",
        subCategory: "Chairs",
        price: "",
        stock: "15",
        description: "",
        imageUrl: "",
        sizeCM: "",
        frameMaterial: "TEAK WOOD",
        color: "Natural",
      });
    }
  }, [productToEdit, isVisible]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.price) {
      message.error("Product name and price are required");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        subCategory: formData.subCategory,
        price: Number(formData.price),
        stock: Number(formData.stock) || 10,
        description: formData.description,
        images: formData.imageUrl ? [formData.imageUrl.trim()] : [],
        material: formData.frameMaterial,
        color: formData.color,
        sizeCM: formData.sizeCM,
        frameMaterial: formData.frameMaterial,
      };

      if (isEditing) {
        await axios.put(`${API_BASE_URL}/api/v1/product/${productToEdit._id}`, payload);
        message.success("Product updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/v1/product`, payload);
        message.success("Product added to catalog successfully!");
      }

      handleClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Save product error:", error);
      message.error(error.response?.data?.message || "Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-xs z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col max-w-2xl w-full rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 my-auto"
      >
        {/* Header */}
        <div className="bg-[#111827] text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-lg font-bold tracking-tight">
              {isEditing ? `Edit Product: ${productToEdit?.name?.slice(0, 25)}...` : "Add New Product"}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Image URL with Live Visual Preview */}
          <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80 space-y-3">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              Product Image URL (Direct Link)
            </label>
            <div className="flex gap-3">
              <input
                type="url"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://freedomtree.in/cdn/shop/files/sample-chair.jpg"
                className="flex-1 bg-white border border-gray-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all font-mono"
              />
              {formData.imageUrl && (
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, imageUrl: "" }))}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-semibold rounded-xl"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Live Preview Display */}
            {formData.imageUrl ? (
              <div className="mt-2 flex items-center gap-4 bg-white p-2.5 rounded-xl border border-gray-200">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/100x100?text=Invalid+URL";
                  }}
                  className="w-16 h-16 object-cover rounded-lg border border-gray-100 shrink-0"
                />
                <div className="text-xs text-gray-500">
                  <div className="font-semibold text-gray-800">Image Preview Loaded</div>
                  <div className="truncate max-w-sm text-[11px] text-gray-400">
                    {formData.imageUrl}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-400 flex items-center gap-2 pt-1">
                <ImageIcon size={14} />
                <span>Paste a direct Cloudinary or image link to see real-time preview</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Kyoto Solid Mango Wood Armchair"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Main Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
              >
                <option value="furniture">Furniture</option>
                <option value="furnishing">Furnishing</option>
                <option value="dining">Dining</option>
                <option value="decor">Decor & Lights</option>
                <option value="clothing">Clothing</option>
                <option value="gifting">Gifting</option>
                <option value="sale">Sale</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Sub Category
              </label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
              >
                <option value="Chairs">Chairs</option>
                <option value="Sofas">Sofas</option>
                <option value="Tables">Tables</option>
                <option value="Beds">Beds</option>
                <option value="Storage">Storage</option>
                <option value="Lighting">Lighting</option>
                <option value="Cushions">Cushions</option>
                <option value="Decor">Decor</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Price (₹ INR) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="24990"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="10"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Material / Frame
              </label>
              <select
                name="frameMaterial"
                value={formData.frameMaterial}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
              >
                <option value="TEAK WOOD">Teak Wood</option>
                <option value="MANGOWOOD">Mango Wood</option>
                <option value="METAL">Metal</option>
                <option value="ASSORTED">Assorted</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Dimensions / Size (CM)
              </label>
              <input
                type="text"
                name="sizeCM"
                value={formData.sizeCM}
                onChange={handleChange}
                placeholder="e.g. 76L X 48D X 38H"
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter rich product details, craftsmanship, and styling recommendations..."
                rows={3}
                className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 resize-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : isEditing ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddProductPopup;
