export const API_BASE_URL = import.meta.env.VITE_PRODUCTION
    ? "https://five-furniture.onrender.com"
    : "http://localhost:5000";

console.log(import.meta.env.VITE_PRODUCTION)
