import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  withCredentials: true, // Allow cookies to be sent
});

// Request Interceptor to attach Authorization Header (JWT Token)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to handle global errors (like 401 Unauthorized)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear storage
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("user");
      
      // Redirect to login page if window is defined
      if (typeof window !== "undefined" && window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(error);
  }
);

export default API;
