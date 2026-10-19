import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import axios from "axios";
import { message, Modal } from "antd";
import { API_BASE_URL } from "../../api";
import AddProductPopup from "./Components/AddProductPopup";

const Products = () => {
  const [productsData, setProductsData] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  // Modal State for Add & Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/product`);
      const items = res.data.data || [];
      setProductsData(items);
      setFilteredProducts(items);
    } catch (error) {
      console.error("Fetch products error:", error);
      message.error("Failed to fetch product catalog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter & Search Logic
  useEffect(() => {
    let list = [...productsData];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          p._id?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      list = list.filter(
        (p) =>
          p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          p.subCategory?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(list);
  }, [search, selectedCategory, productsData]);

  // Open Modal in Add Mode
  const handleOpenAdd = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  // Open Modal in Edit Mode
  const handleOpenEdit = (product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  // Delete Product Handler
  const handleDeleteProduct = (product) => {
    Modal.confirm({
      title: "Delete Product",
      icon: <AlertTriangle className="text-rose-500 mr-2" size={22} />,
      content: `Are you sure you want to permanently remove "${product.name}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await axios.delete(`${API_BASE_URL}/api/v1/product/${product._id}`);
          message.success("Product deleted successfully");
          setProductsData((prev) => prev.filter((p) => p._id !== product._id));
        } catch (err) {
          console.error("Delete error:", err);
          message.error(err.response?.data?.message || "Failed to delete product");
        }
      },
    });
  };

  const getProductImage = (product) => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    if (typeof product.images === "string" && product.images) {
      return product.images;
    }
    return "https://placehold.co/100x100?text=No+Image";
  };

  // Unique categories for filter dropdown
  const categories = [
    "all",
    ...new Set(
      productsData
        .map((p) => p.category)
        .filter(Boolean)
        .map((c) => c.toLowerCase())
    ),
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-display">
              Product Catalog
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {filteredProducts.length} items
            </span>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Manage, update, and publish luxury home furnishing products.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-semibold text-sm cursor-pointer"
        >
          <Plus size={18} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name, category, or product ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50/80 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-600">
            <Filter size={14} className="text-gray-400" />
            <span className="font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent focus:outline-none font-semibold text-gray-800 capitalize cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
            }}
            className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Material</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Stock</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const imgUrl = getProductImage(product);
                const stock = product.stock !== undefined ? product.stock : 12;

                return (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    {/* Product Name & Thumbnail */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                          <img
                            src={imgUrl}
                            alt={product.name}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://placehold.co/100x100?text=No+Image";
                            }}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs sm:max-w-md">
                          <div className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors truncate">
                            {product.name}
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono">
                            ID: #{product._id?.slice(-8)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold bg-gray-100 text-gray-700 capitalize">
                        {product.category || "Furniture"}
                      </span>
                    </td>

                    {/* Material */}
                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      {product.material ||
                        product.details?.frameMaterial ||
                        "Teak Wood"}
                    </td>

                    {/* Price in INR */}
                    <td className="py-3.5 px-4 text-sm font-extrabold text-gray-900 font-mono">
                      ₹ {Number(product.price || 0).toLocaleString("en-IN")}
                    </td>

                    {/* Stock Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          stock > 5
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : stock > 0
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        {stock > 0 ? `${stock} in stock` : "Out of stock"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-12">
                    <Package size={36} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm font-semibold text-gray-600">
                      No products found
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Try adjusting your search query or category filter.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <AddProductPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productToEdit={productToEdit}
        onSuccess={fetchProducts}
      />
    </div>
  );
};

export default Products;
