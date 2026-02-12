import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 ONLY attach token for NON-auth requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && !config.url.startsWith("/auth")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
