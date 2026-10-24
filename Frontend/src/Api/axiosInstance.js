import axios from "axios";
import { API_BASE_URL } from "../api";

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export default api;
