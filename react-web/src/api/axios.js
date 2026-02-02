import axios from "axios";
import {BASE_URL} from "../conf";

const axiosInstance = axios.create({
  //baseURL: "https://support.i2gether.com/api",
  baseURL: BASE_URL,
});

// Add response interceptor to handle 401 (unauthorized/expired token)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear session
      console.log("401 Unauthorized - clearing session");
      localStorage.removeItem("accessToken");
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/home')) {
        window.location.href = '/home';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

