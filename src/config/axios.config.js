import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "https://devmingle.vercel.app",
  // baseURL: "http://localhost:5001",
  withCredentials: true,
});

export default axiosSecure;
