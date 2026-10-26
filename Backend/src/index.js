import "dotenv/config";
import connectDB from "./db/db.js";
import app from "./app.js";

// Connect DB once when function is initialized
connectDB()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.log("Database connection failed:", error);
  });

  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });

export default app;
