import React, { useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  UploadCloud,
  X,
  RotateCcw,
  Check,
  ChevronRight,
  Eye,
  Layers,
  ArrowRight
} from "lucide-react";
import { message } from "antd";
import { API_BASE_URL } from "../api";

export default function RoomVisualizer({ product, onClose }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [visualData, setVisualData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0.9);
  const fileInputRef = useRef(null);

  // Handle image selection
  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith("image/")) {
      message.error("Please upload a valid image file (JPEG, PNG, WebP).");
      return;
    }

    if (selected.size > 8 * 1024 * 1024) {
      message.error("Image file size should be under 8MB.");
      return;
    }

    setFile(selected);
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(selected);
  };

  // Submit image to backend
  const handleAnalyze = async () => {
    if (!previewUrl) {
      message.warning("Please upload a room photo first.");
      return;
    }

    setAnalyzing(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/ai/room-visualize`, {
        image: previewUrl,
      });

      const data = response.data?.data;
      if (data) {
        // Prepend current product if viewing from a product page
        let mergedProducts = data.products || [];
        if (product && product._id) {
          const alreadyIn = mergedProducts.some((p) => p._id === product._id);
          if (!alreadyIn) {
            const currentItem = {
              ...product,
              zone: "center",
              images: Array.isArray(product.images)
                ? product.images
                : [product.images],
            };
            mergedProducts = [currentItem, ...mergedProducts.slice(0, 5)];
          }
        }

        setVisualData({
          ...data,
          products: mergedProducts,
        });
        setSelectedProduct(mergedProducts[0] || null);
        message.success("Room analyzed and products placed successfully!");
      }
    } catch (err) {
      console.error("Room visualizer error:", err);
      message.error(
        err.response?.data?.message ||
          "Could not analyze room. Please try again with another photo."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setVisualData(null);
    setSelectedProduct(null);
  };

  // Zone positioning mappings for overlay placement
  const getZoneStyle = (zone, index) => {
    switch (zone) {
      case "left":
        return { bottom: "18%", left: "12%" };
      case "right":
        return { bottom: "18%", right: "12%" };
      case "center":
        return { bottom: "12%", left: "50%", transform: "translateX(-50%)" };
      case "corner":
        return { bottom: "25%", left: "20%" };
      default:
        return { bottom: `${15 + index * 6}%`, left: `${25 + index * 18}%` };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-5xl bg-[#faf9f5] border border-neutral-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-black text-[#faf9f5] border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold tracking-wide text-white">
                  Try In My Room
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  AI Visualizer
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Upload your room photo to preview matching furniture in real space
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!visualData ? (
            /* Upload & Preview Step */
            <div className="max-w-2xl mx-auto flex flex-col items-center">
              {!previewUrl ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-neutral-300 hover:border-black rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-white hover:bg-[#f7f6f2] group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-16 h-16 rounded-full bg-neutral-100 group-hover:bg-black group-hover:text-white flex items-center justify-center mb-4 transition-colors text-neutral-700">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-semibold text-neutral-900 mb-1">
                    Upload a photo of your room
                  </h4>
                  <p className="text-sm text-neutral-500 mb-4 max-w-sm">
                    Drag and drop your living room or bedroom photo, or click to browse files
                  </p>
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black text-white text-xs font-medium tracking-wide uppercase hover:bg-neutral-800">
                    Select Photo
                  </span>
                  <p className="text-[11px] text-neutral-400 mt-3">
                    Supports JPG, PNG, WebP up to 8MB
                  </p>
                </div>
              ) : (
                /* Photo selected preview */
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-full max-h-[420px] rounded-2xl overflow-hidden border border-neutral-300 bg-neutral-100 flex items-center justify-center mb-5">
                    <img
                      src={previewUrl}
                      alt="Room preview"
                      className="w-full h-auto max-h-[420px] object-contain"
                    />
                    <button
                      onClick={handleReset}
                      className="absolute top-3 right-3 bg-black/75 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Change Photo
                    </button>
                  </div>

                  {product && (
                    <div className="w-full flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-xl mb-5">
                      <img
                        src={
                          Array.isArray(product.images)
                            ? product.images[0]
                            : product.images
                        }
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-neutral-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                          Featured Item to Place
                        </p>
                        <p className="text-sm font-semibold text-neutral-900 truncate">
                          {product.name}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-neutral-900">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-neutral-800 text-white font-semibold rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {analyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Uploading to Cloudinary & Analyzing Room...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Place Furniture In Room</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Results View */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Room Visualizer Viewport */}
              <div className="lg:col-span-2 flex flex-col">
                {/* Meta details bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white border border-neutral-200 rounded-xl mb-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 bg-neutral-100 rounded-md font-medium text-neutral-700">
                      Room:{" "}
                      <strong className="text-black uppercase">
                        {visualData.roomData?.roomType || "Living Room"}
                      </strong>
                    </span>
                    <span className="px-2.5 py-1 bg-neutral-100 rounded-md font-medium text-neutral-700">
                      Style:{" "}
                      <strong className="text-black uppercase">
                        {visualData.roomData?.style || "Modern Luxe"}
                      </strong>
                    </span>
                    {visualData.roomData?.colors?.length > 0 && (
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-neutral-100 rounded-md">
                        <span className="text-neutral-500 font-medium">Palette:</span>
                        {visualData.roomData.colors.map((c, idx) => (
                          <span
                            key={idx}
                            className="w-3.5 h-3.5 rounded-full border border-neutral-300"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Opacity</span>
                    <input
                      type="range"
                      min="0.4"
                      max="1"
                      step="0.05"
                      value={overlayOpacity}
                      onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                      className="w-20 accent-black cursor-pointer"
                    />
                  </div>
                </div>

                {/* The Visual Canvas */}
                <div className="relative w-full h-[400px] sm:h-[480px] bg-neutral-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center select-none">
                  {/* Background Room Photo */}
                  <img
                    src={visualData.roomPhotoUrl || previewUrl}
                    alt="Decorated room"
                    className="w-full h-full object-cover"
                  />

                  {/* Overlaid Products in Detected Zones */}
                  {visualData.products?.map((item, index) => {
                    const isSelected = selectedProduct?._id === item._id;
                    const itemImg = Array.isArray(item.images)
                      ? item.images[0]
                      : item.images;

                    return (
                      <motion.div
                        key={item._id || index}
                        style={getZoneStyle(item.zone, index)}
                        onClick={() => setSelectedProduct(item)}
                        whileHover={{ scale: 1.08 }}
                        className={`absolute cursor-pointer transition-all ${
                          isSelected ? "z-30" : "z-20"
                        }`}
                      >
                        {/* Cutout / floating preview */}
                        <div
                          style={{ opacity: overlayOpacity }}
                          className={`relative group p-1.5 rounded-xl transition-all ${
                            isSelected
                              ? "ring-2 ring-amber-400 bg-white/90 shadow-2xl"
                              : "bg-white/70 hover:bg-white/90 shadow-md"
                          }`}
                        >
                          <img
                            src={itemImg}
                            alt={item.name}
                            className="w-20 h-20 sm:w-28 sm:h-28 object-contain drop-shadow-md rounded-lg"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow flex items-center gap-1">
                            <span>₹{Number(item.price || 0).toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-neutral-500">
                  <span>💡 Click on any placed furniture piece to inspect details</span>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-black font-semibold hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Try Another Photo
                  </button>
                </div>
              </div>

              {/* Recommendations Sidebar */}
              <div className="flex flex-col bg-white border border-neutral-200 rounded-2xl p-4 h-full">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-3">
                  <h4 className="text-sm font-bold text-neutral-900 tracking-wide uppercase">
                    Fitted Furniture ({visualData.products?.length || 0})
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    AI Matched
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[460px] pr-1">
                  {visualData.products?.map((item) => {
                    const isSelected = selectedProduct?._id === item._id;
                    const itemImg = Array.isArray(item.images)
                      ? item.images[0]
                      : item.images;

                    return (
                      <div
                        key={item._id}
                        onClick={() => setSelectedProduct(item)}
                        className={`flex gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-black bg-[#faf9f5] shadow-sm"
                            : "border-neutral-200 hover:border-neutral-400 bg-white"
                        }`}
                      >
                        <img
                          src={itemImg}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg bg-neutral-100 flex-shrink-0"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <p className="text-xs font-semibold text-neutral-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-neutral-600 font-bold mt-0.5">
                            ₹{Number(item.price || 0).toLocaleString("en-IN")}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] uppercase font-medium text-neutral-500">
                              Zone: {item.zone}
                            </span>
                            <Link
                              to={`/collections/${item.category || "furniture"}/products/${item.name?.toLowerCase().replace(/\s+/g, "-")}`}
                              onClick={onClose}
                              className="text-[10px] text-black font-semibold hover:underline inline-flex items-center gap-0.5 ml-auto"
                            >
                              View <ArrowRight className="w-2.5 h-2.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {selectedProduct && (
                  <div className="mt-4 pt-3 border-t border-neutral-200">
                    <Link
                      to={`/collections/${selectedProduct.category || "furniture"}/products/${selectedProduct.name?.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={onClose}
                      className="w-full py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Explore Selected Product</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
