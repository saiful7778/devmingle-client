import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "https://devmingle.vercel.app",
  withCredentials: true,
});

export default axiosSecure;
