import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { cloudinary } from "../config/cloudinary.js";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const ROOM_PROMPT = `Analyze this room interior photo. Return ONLY valid raw JSON (no markdown formatting, no code blocks):
{
  "roomType": "living room|bedroom|dining room|office|other",
  "style": "MODERN LUXE|CLASSIC|CONTEMPORARY|RUSTIC|OTHER",
  "colors": ["#hex1", "#hex2"],
  "emptyZones": ["left", "center", "right"]
}`;

export const roomVisualize = asyncHandler(async (req, res) => {
  const { image } = req.body;
  if (!image) throw new ApiError(400, "Room image is required");

  // 1. Upload to Cloudinary if image is base64 DataURL
  let roomPhotoUrl = image;
  if (image.startsWith("data:")) {
    try {
      const uploadResult = await cloudinary.uploader.upload(image, {
        folder: "freedom_tree/room_visualizer",
        resource_type: "image",
      });
      roomPhotoUrl = uploadResult.secure_url;
    } catch (uploadErr) {
      console.error("Cloudinary upload error:", uploadErr);
      throw new ApiError(500, "Failed to upload room photo to Cloudinary");
    }
  }

  const apiKey = process.env.GROQ_API_KEY;

  // 2. Call Groq Vision API
  let roomData = {
    roomType: "living room",
    style: "MODERN LUXE",
    colors: ["#8A735E", "#F4F1EA"],
    emptyZones: ["left", "center", "right"],
  };

  if (apiKey) {
    try {
      const aiResponse = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "llama-3.2-11b-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                { type: "image_url", image_url: { url: roomPhotoUrl } },
                { type: "text", text: ROOM_PROMPT },
              ],
            },
          ],
        }),
      });

      if (aiResponse.ok) {
        const data = await aiResponse.json();
        const content = data.choices?.[0]?.message?.content || "{}";
        const cleaned = content.replace(/```json/gi, "").replace(/```/gi, "").trim();
        const parsed = JSON.parse(cleaned);
        roomData = { ...roomData, ...parsed };
      } else {
        console.warn("Groq vision response not OK:", await aiResponse.text());
      }
    } catch (err) {
      console.warn("Groq vision analysis warning:", err.message);
    }
  }

  const { style, roomType } = roomData;

  // 3. Query MongoDB for matching products
  const categoryMap = {
    "living room": ["sofas", "seating", "tables", "living"],
    "bedroom": ["beds", "dressers", "bedroom"],
    "dining room": ["dining-tables", "dining-chairs", "dining"],
    "office": ["desks", "chairs", "office"],
  };
  const categoryKeywords = categoryMap[roomType?.toLowerCase()] || [];

  const query = {};
  if (style && style !== "OTHER") {
    query["$or"] = [
      { "details.style": new RegExp(style, "i") },
      { style: new RegExp(style, "i") },
    ];
  }

  // shortcut: basic mongo query; vector/embedding search when catalog scales past 500
  let products = await Product.find(query, "name category price style material images _id description")
    .limit(6)
    .lean();

  if (!products.length) {
    products = await Product.find({}, "name category price style material images _id description")
      .limit(6)
      .lean();
  }

  const zones = roomData.emptyZones?.length ? roomData.emptyZones : ["left", "center", "right"];
  const productsWithPlacement = products.map((p, i) => ({
    ...p,
    zone: zones[i % zones.length],
  }));

  return res.status(200).json(
    new ApiResponse(200, {
      roomPhotoUrl,
      roomData,
      products: productsWithPlacement,
    }, "Room visualization generated successfully")
  );
});
