import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", 
  timeout: 30000, 
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized! Logging out...");
      localStorage.removeItem("token");
      window.location.href = "/user/login";
    }
    return Promise.reject(error);
  }
);

export default api;
