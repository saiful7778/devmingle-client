import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "https://assignment12-server-lilac.vercel.app",
  withCredentials: true,
});

export default axiosSecure;
