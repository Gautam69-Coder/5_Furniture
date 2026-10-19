import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// GET all products
const productData = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, products, "Products fetched successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to fetch products");
  }
});

// GET single product by ID
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product retrieved successfully"));
});

// CREATE a new product
const createProduct = asyncHandler(async (req, res) => {
  const data = req.body.formData || req.body;

  if (!data || !data.name || !data.price) {
    throw new ApiError(400, "Product name and price are required");
  }

  // Format images as array of strings
  let imageList = [];
  if (Array.isArray(data.images)) {
    imageList = data.images.filter(Boolean);
  } else if (typeof data.images === "string" && data.images.trim()) {
    imageList = [data.images.trim()];
  } else if (typeof data.imageUrl === "string" && data.imageUrl.trim()) {
    imageList = [data.imageUrl.trim()];
  }

  const category = (data.category || data.subCategory || "furniture").toLowerCase();
  const subCategory = (data.subCategory || data.subcategory || "chairs").toLowerCase();

  const product = await Product.create({
    name: data.name.trim(),
    category: category,
    subcategory: subCategory,
    price: Number(data.price),
    description: data.description || "",
    images: imageList,
    galleryImages: data.gallery || imageList,
    material: data.material || data.frameMaterial || "Mango Wood",
    color: data.color || "Natural",
    style: data.style || "Modern Luxe",
    stock: data.stock !== undefined ? Number(data.stock) : 10,
    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : ["Trending"]),
    details: {
      sizeCM: data.sizeCM || "",
      frameMaterial: data.frameMaterial || "ASSORTED",
      color: data.color || "ASSORTED",
      style: data.style || "MODERN LUXE",
    },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product added successfully"));
});

// UPDATE product by ID
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body.formData || req.body;

  if (!data) {
    throw new ApiError(400, "Update data is required");
  }

  // Handle image list formatting
  let imageList = undefined;
  if (data.images !== undefined) {
    if (Array.isArray(data.images)) {
      imageList = data.images.filter(Boolean);
    } else if (typeof data.images === "string" && data.images.trim()) {
      imageList = [data.images.trim()];
    }
  }

  const updateFields = {};
  if (data.name !== undefined) updateFields.name = data.name.trim();
  if (data.category !== undefined) updateFields.category = data.category.toLowerCase();
  if (data.subCategory !== undefined || data.subcategory !== undefined) {
    updateFields.subcategory = (data.subCategory || data.subcategory).toLowerCase();
  }
  if (data.price !== undefined) updateFields.price = Number(data.price);
  if (data.description !== undefined) updateFields.description = data.description;
  if (imageList !== undefined) updateFields.images = imageList;
  if (data.stock !== undefined) updateFields.stock = Number(data.stock);
  if (data.material !== undefined || data.frameMaterial !== undefined) {
    updateFields.material = data.material || data.frameMaterial;
  }
  if (data.color !== undefined) updateFields.color = data.color;
  if (data.style !== undefined) updateFields.style = data.style;
  if (data.tags !== undefined) {
    updateFields.tags = Array.isArray(data.tags) ? data.tags : [data.tags];
  }

  if (data.sizeCM !== undefined || data.frameMaterial !== undefined) {
    updateFields.details = {
      sizeCM: data.sizeCM || "",
      frameMaterial: data.frameMaterial || "ASSORTED",
      color: data.color || "ASSORTED",
    };
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

// DELETE product by ID
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Product deleted successfully"));
});

export {
  productData,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};