const isProd = import.meta.env.PROD;

// export const API_BASE_URL = isProd
//   ? "https://five-furniture.onrender.com"
//   : "http://localhost:5000";

// export const API_BASE_URL = "http://localhost:5000";

export const API_BASE_URL = "https://five-furniture.onrender.com" || "http://localhost:5000";
