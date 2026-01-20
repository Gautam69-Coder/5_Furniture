import connectDB from "./db/db.js";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

// Connect DB once when function is initialized
connectDB()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Database connection failed:", error);
  });

// ❌ NO app.listen()
// ✅ JUST export app
export default app;
