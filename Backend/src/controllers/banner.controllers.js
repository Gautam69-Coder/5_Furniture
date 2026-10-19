import { Banner } from "../models/banner.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

// Fetch all banners (with optional query filter: activeOnly=true)
const getAllBanners = asyncHandler(async (req, res) => {
  const { activeOnly } = req.query;
  const filter = activeOnly === "true" ? { isActive: true } : {};
  const banners = await Banner.find(filter).sort({ order: 1, createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, banners, "Banners fetched successfully"));
});

// Create new banner
const createBanner = asyncHandler(async (req, res) => {
  const { title, subtitle, badge, imageUrl, linkUrl, position, order, isActive } =
    req.body;

  if (!title || !imageUrl) {
    throw new ApiError(400, "Title and Image URL are required");
  }

  const banner = await Banner.create({
    title,
    subtitle: subtitle || "",
    badge: badge || "FEATURED",
    imageUrl,
    linkUrl: linkUrl || "/collections/furniture",
    position: position || "home_hero",
    order: Number(order) || 0,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, banner, "Banner created successfully"));
});

// Update banner by ID
const updateBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const banner = await Banner.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, banner, "Banner updated successfully"));
});

// Delete banner by ID
const deleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const banner = await Banner.findByIdAndDelete(id);

  if (!banner) {
    throw new ApiError(404, "Banner not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Banner deleted successfully"));
});

export { getAllBanners, createBanner, updateBanner, deleteBanner };
