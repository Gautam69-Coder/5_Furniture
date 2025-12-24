// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api/v1",
//   withCredentials: true, 
// });

// // Attach access token from localStorage
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Refresh token automatically
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       try {
//         const res = await axios.post(
//           "/api/v1/user/refresh-token",
//           {},
//           { withCredentials: true }
//         );

//         const newAccessToken = res.data.data.accessToken;
//         localStorage.setItem("accessToken", newAccessToken);

//         error.config.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(error.config);

//       } catch (err) {
//         console.log("Refresh failed");
//         localStorage.removeItem("accessToken");
//         window.location.href = `/login`;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
