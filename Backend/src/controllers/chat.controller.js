import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";
import { SYSTEM_PROMPT } from "../prompts/chatPrompt.js";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const chat = asyncHandler(async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message?.trim()) throw new ApiError(400, "Message is required");

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new ApiError(500, "AI service not configured");

  // Fetch a relevant sample of products to give the AI context
  // Fetch active products to give the AI context
  // shortcut: sends full catalog; with >500 products switch to vector search
  const products = await Product.find({}, "name category price style material stock images _id").lean();

  const catalogText = products
    .map(p => `ID:${p._id}|${p.name}|₹${p.price}|${p.category}${p.material ? `|${p.material}` : ""}`)
    .join("\n");

  const messages = [
    { role: "system", content: SYSTEM_PROMPT + "\n\nCATALOG:\n" + catalogText },
    ...history.slice(-8), // last 4 turns to stay within context
    { role: "user", content: message },
  ];

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: "openai/gpt-oss-120b", messages, temperature: 0.6, max_tokens: 650 }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      return res.status(200).json(new ApiResponse(200, {
        reply: "I'm receiving quite a few requests right now! Please give me a brief moment and ask again.",
        products: []
      }, "Rate limited"));
    }
    const err = await response.text();
    throw new ApiError(502, `AI error: ${err}`);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't respond right now.";

  // Extract product IDs if AI embedded them
  let recommendedProducts = [];
  let cleanReply = reply;

  const match = reply.match(/\|\|\|PRODUCTS\|\|\|(\{[\s\S]*?\})(?:\|\|\|END\|\|\||$)/);
  if (match) {
    cleanReply = reply.replace(/\|\|\|PRODUCTS\|\|\|[\s\S]*?(?:\|\|\|END\|\|\||$)/, "").trim();
    try {
      const parsed = JSON.parse(match[1]);
      const ids = parsed.ids || [];
      recommendedProducts = products.filter(p => ids.includes(String(p._id)));
    } catch (_) { /* malformed JSON from AI — skip */ }
  }

  return res.status(200).json(new ApiResponse(200, { reply: cleanReply, products: recommendedProducts }, "OK"));
});
