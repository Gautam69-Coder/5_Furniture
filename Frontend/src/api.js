export const API_BASE_URL = import.meta.env.VITE_PRODUCTION === "true"
    ? "https://five-furniture.onrender.com"
    : "http://localhost:5000";


console.log(API_BASE_URL)


