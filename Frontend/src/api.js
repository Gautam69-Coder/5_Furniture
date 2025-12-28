const isProd = import.meta.env.PROD;

export const API_BASE_URL = isProd
  ? "https://five-furniture.onrender.com"
  : "http://localhost:5000";
