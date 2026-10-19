import fs from "fs";
import path from "path";
import https from "https";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from Backend/src/.env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

function fetchShopify(pathname) {
  return new Promise((resolve) => {
    const options = {
      hostname: "freedomtree.in",
      path: pathname,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
      },
    };

    https
      .get(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            resolve(parsed.products || []);
          } catch (err) {
            console.error(`Failed parsing ${pathname}:`, err.message);
            resolve([]);
          }
        });
      })
      .on("error", (err) => {
        console.error(`Error requesting ${pathname}:`, err.message);
        resolve([]);
      });
  });
}

function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>?/gm, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanTags(rawTags) {
  if (!Array.isArray(rawTags)) return ["Trending", "New Arrival"];
  const cleaned = rawTags
    .map((t) => {
      let tag = t.trim();
      if (tag.startsWith("BE_") || tag.startsWith("Be_")) return null;
      if (tag.startsWith("L1_") || tag.startsWith("L2_") || tag.startsWith("L3_") || tag.startsWith("L4_")) return null;
      if (tag.startsWith("COL_")) tag = tag.replace("COL_", "");
      if (tag.startsWith("MAT_") || tag.startsWith("MATALT_")) tag = tag.replace(/MAT(ALT)?_/, "");
      if (tag.startsWith("SHD_")) tag = tag.replace("SHD_", "");
      if (tag.startsWith("SIZ_")) tag = tag.replace("SIZ_", "");
      if (tag.startsWith("DES_")) tag = tag.replace("DES_", "");
      if (tag.startsWith("STYLE_")) tag = tag.replace("STYLE_", "");
      return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
    })
    .filter(Boolean);

  const unique = [...new Set(cleaned)];
  if (!unique.includes("Trending") && !unique.includes("Best Selling")) {
    unique.unshift("Trending");
  }
  return unique.slice(0, 5);
}

function extractDetail(tags, prefix) {
  if (!Array.isArray(tags)) return null;
  const match = tags.find((t) => t.toUpperCase().startsWith(prefix.toUpperCase()));
  if (!match) return null;
  return match.split("_").slice(1).join(" ").trim();
}

function generateObjectId() {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, "0");
  const randomChars = "0123456789abcdef";
  let rest = "";
  for (let i = 0; i < 16; i++) {
    rest += randomChars[Math.floor(Math.random() * randomChars.length)];
  }
  return timestamp + rest;
}

const CATEGORY_CONFIGS = [
  {
    category: "furnishing",
    codePrefix: "FT-FN",
    endpoints: ["/collections/furnishing/products.json?limit=25"],
    subCategoryRules: (title, type, tags) => {
      const lower = (title + " " + type + " " + tags.join(" ")).toLowerCase();
      if (lower.includes("cushion")) return "cushions";
      if (lower.includes("curtain") || lower.includes("sheer")) return "curtains";
      if (lower.includes("bed") || lower.includes("dohar") || lower.includes("quilt")) return "bedding";
      if (lower.includes("rug") || lower.includes("throw") || lower.includes("carpet")) return "rugs";
      return "upholstery";
    },
    defaultMaterial: "Pure Cotton / Linen Blend",
    defaultCare: "Gentle machine wash or dry clean. Use mild detergent. Do not bleach.",
    defaultFrame: "TEXTILE",
  },
  {
    category: "dining",
    codePrefix: "FT-DN",
    endpoints: [
      "/collections/dinnerware/products.json?limit=15",
      "/collections/tableware/products.json?limit=15",
      "/collections/plates-platters/products.json?limit=15",
    ],
    subCategoryRules: (title, type, tags) => {
      const lower = (title + " " + type + " " + tags.join(" ")).toLowerCase();
      if (lower.includes("plate") || lower.includes("platter")) return "plates-platters";
      if (lower.includes("bowl") || lower.includes("katori") || lower.includes("dish")) return "bowls-dishes";
      if (lower.includes("mug") || lower.includes("cup") || lower.includes("drink")) return "drinkware";
      if (lower.includes("tray") || lower.includes("stand")) return "trays-stands";
      return "dinnerware";
    },
    defaultMaterial: "Ceramic / Stoneware",
    defaultCare: "Dishwasher and microwave safe. Handle with care to prevent chipping.",
    defaultFrame: "CERAMIC",
  },
  {
    category: "decor",
    codePrefix: "FT-DC",
    endpoints: [
      "/collections/home-decor/products.json?limit=15",
      "/collections/lighting/products.json?limit=15",
    ],
    subCategoryRules: (title, type, tags) => {
      const lower = (title + " " + type + " " + tags.join(" ")).toLowerCase();
      if (lower.includes("lamp") || lower.includes("light") || lower.includes("bulb")) return "lighting";
      if (lower.includes("candle") || lower.includes("stand") || lower.includes("scent")) return "candles-fragrance";
      if (lower.includes("vase") || lower.includes("planter") || lower.includes("pot")) return "vases-planters";
      if (lower.includes("mirror") || lower.includes("wall")) return "wall-decor";
      return "table-accents";
    },
    defaultMaterial: "Brass / Metal / Handblown Glass",
    defaultCare: "Wipe clean with a soft dry cloth. Avoid abrasive cleaners and moisture.",
    defaultFrame: "METAL / WOOD",
  },
  {
    category: "clothing",
    codePrefix: "FT-CL",
    endpoints: ["/collections/clothing/products.json?limit=25"],
    subCategoryRules: (title, type, tags) => {
      const lower = (title + " " + type + " " + tags.join(" ")).toLowerCase();
      if (lower.includes("shirt") || lower.includes("kurta") || lower.includes("men")) return "menswear";
      if (lower.includes("dress") || lower.includes("tunic") || lower.includes("robe")) return "womenswear";
      return "apparel";
    },
    defaultMaterial: "100% Breathable Cotton Muslin",
    defaultCare: "Machine wash cold separately with mild detergent. Line dry in shade.",
    defaultFrame: "COTTON",
  },
  {
    category: "gifting",
    codePrefix: "FT-GF",
    endpoints: ["/collections/gifting/products.json?limit=25"],
    subCategoryRules: (title, type, tags) => {
      const lower = (title + " " + type + " " + tags.join(" ")).toLowerCase();
      if (lower.includes("wedding") || lower.includes("couple")) return "wedding-gifts";
      if (lower.includes("box") || lower.includes("set") || lower.includes("hamper")) return "gift-sets";
      if (lower.includes("table") || lower.includes("accent")) return "table-gifts";
      return "curated-gifts";
    },
    defaultMaterial: "Handcrafted Ceramics / Acacia Wood",
    defaultCare: "Wipe with a damp cloth or gentle hand wash according to item type.",
    defaultFrame: "ASSORTED",
  },
  {
    category: "sale",
    codePrefix: "FT-SL",
    endpoints: ["/collections/sale/products.json?limit=25"],
    subCategoryRules: (title, type, tags) => {
      const lower = (title + " " + type + " " + tags.join(" ")).toLowerCase();
      if (lower.includes("cushion") || lower.includes("fabric") || lower.includes("rug")) return "furnishing-sale";
      if (lower.includes("plate") || lower.includes("bowl") || lower.includes("mug")) return "dining-sale";
      if (lower.includes("shirt") || lower.includes("dress")) return "clothing-sale";
      return "decor-sale";
    },
    defaultMaterial: "Handcrafted Premium Materials",
    defaultCare: "Follow standard care instructions specified for fabric or ceramic pieces.",
    defaultFrame: "ASSORTED",
  },
];

async function main() {
  console.log("=== Starting Freedom Tree Product Ingestion & Database Sync ===");

  const jsonFilePath = path.resolve(__dirname, "../../Furniture_DataBase.products.json");
  const rawExisting = fs.readFileSync(jsonFilePath, "utf8");
  const existingProducts = JSON.parse(rawExisting);

  console.log(`Loaded ${existingProducts.length} existing products from JSON.`);

  // Ensure stock is present on all existing products
  let updatedExistingCount = 0;
  existingProducts.forEach((p, idx) => {
    if (p.stock === undefined) {
      // Assign realistic stock value between 10 and 25
      p.stock = 10 + (idx % 16);
      updatedExistingCount++;
    }
  });
  console.log(`Updated 'stock' field on ${updatedExistingCount} existing products.`);

  const allNewProducts = [];
  const TARGET_PER_CATEGORY = 11; // At least 10 products per category

  for (const config of CATEGORY_CONFIGS) {
    console.log(`\nFetching products for category: '${config.category}'...`);
    const seenTitles = new Set();
    const categoryProducts = [];

    for (const endpoint of config.endpoints) {
      if (categoryProducts.length >= TARGET_PER_CATEGORY) break;
      const fetched = await fetchShopify(endpoint);
      console.log(`  Endpoint ${endpoint} returned ${fetched.length} raw products.`);

      for (const item of fetched) {
        if (categoryProducts.length >= TARGET_PER_CATEGORY) break;
        const title = item.title ? item.title.trim() : "";
        if (!title || seenTitles.has(title)) continue;
        seenTitles.add(title);

        const variant = item.variants?.[0] || {};
        const price = Math.round(parseFloat(variant.price) || 1200);
        if (price <= 0) continue;

        const images = (item.images || []).map((img) => img.src).filter(Boolean);
        if (images.length === 0) continue;

        const subCategory = config.subCategoryRules(title, item.product_type || "", item.tags || []);
        const rawDesc = stripHtml(item.body_html || "");
        const description = rawDesc.length > 50
          ? (rawDesc.length > 280 ? rawDesc.substring(0, 277) + "..." : rawDesc)
          : `${title}. Thoughtfully designed and handcrafted in India with premium materials, bringing character and elegance to your living space.`;

        const extractedMat = extractDetail(item.tags, "MATALT") || extractDetail(item.tags, "MAT");
        const material = extractedMat || config.defaultMaterial;

        const extractedCol = extractDetail(item.tags, "SHD") || extractDetail(item.tags, "COL");
        const color = extractedCol || "Assorted";

        const extractedSize = extractDetail(item.tags, "SIZ");
        const sizeCM = extractedSize ? extractedSize.toUpperCase() : "Standard Size";
        const sizeIN = sizeCM.includes("CM")
          ? sizeCM.replace(/CM/g, "IN")
          : `${sizeCM} (Standard)`;

        const seqNum = String(categoryProducts.length + 1).padStart(4, "0");
        const productIdCode = `${config.codePrefix}-${seqNum}`;
        const oid = generateObjectId();

        // Realistic stock count (between 12 and 30)
        const stock = 12 + Math.floor(Math.random() * 18);

        const newProduct = {
          _id: { $oid: oid },
          id: productIdCode,
          name: title,
          category: config.category,
          subCategory: subCategory,
          price: price,
          stock: stock,
          currency: "INR",
          tags: cleanTags(item.tags),
          images: [images[0]],
          gallery: images.slice(0, 6),
          description: description,
          width: "N/A",
          material: material,
          color: color,
          style: "Contemporary",
          technique: "Handcrafted",
          fabricWeight: "N/A",
          collection: "Freedom Tree Signature",
          careInstructions: config.defaultCare,
          returnPolicy: "Standard return policy; replacement available for manufacturing defect or delivery damage.",
          warranty: "1 year (manufacturing defect)",
          origin: "India (Freedom Tree Retail LLP)",
          details: {
            sizeCM: sizeCM,
            sizeIN: sizeIN,
            additionalSizes: {
              seatHeight: 0,
              seatBackHeight: 0,
              seatDepth: 0,
              backRestAngle: 0,
              armWidth: 0,
              armHeightFromSeating: 0,
              armHeightFromFloor: 0,
            },
            frameMaterial: config.defaultFrame,
            color: color.toUpperCase(),
            style: "CONTEMPORARY",
            technique: "HANDCRAFTED",
            foamFeel: "N/A",
            fabricCustomisation: "N/A",
          },
        };

        categoryProducts.push(newProduct);
      }
    }

    console.log(`  -> Prepared ${categoryProducts.length} products for '${config.category}'.`);
    allNewProducts.push(...categoryProducts);
  }

  // Combine existing furniture products with all newly fetched products
  const combinedProducts = [...existingProducts, ...allNewProducts];

  console.log(`\nWriting ${combinedProducts.length} total products to ${jsonFilePath}...`);
  fs.writeFileSync(jsonFilePath, JSON.stringify(combinedProducts, null, 2), "utf8");
  console.log("Successfully updated Furniture_DataBase.products.json!");

  // Now sync to MongoDB Atlas
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.warn("MONGO_URI not found in environment, skipping MongoDB sync.");
    return;
  }

  console.log("\nConnecting to MongoDB Atlas to sync products collection...");
  try {
    await mongoose.connect(mongoUri, { dbName: "Furniture_DataBase" });
    console.log("Connected to MongoDB Atlas!");

    const db = mongoose.connection.db;
    const productsCollection = db.collection("products");

    // Convert $oid format to native MongoDB ObjectId for DB insertion
    const dbDocs = combinedProducts.map((p) => {
      const doc = { ...p };
      if (doc._id && doc._id.$oid) {
        doc._id = new mongoose.Types.ObjectId(doc._id.$oid);
      }
      return doc;
    });

    // Delete existing products and replace with full new set to keep them completely synchronized
    console.log("Clearing existing products in MongoDB collection...");
    await productsCollection.deleteMany({});
    console.log(`Inserting ${dbDocs.length} products into MongoDB collection...`);
    const insertRes = await productsCollection.insertMany(dbDocs);
    console.log(`Successfully synced ${insertRes.insertedCount} products in MongoDB Atlas!`);

    await mongoose.disconnect();
    console.log("MongoDB disconnected. All sync operations complete!");
  } catch (dbErr) {
    console.error("MongoDB Atlas sync failed:", dbErr.message);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
