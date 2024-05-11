import axios from "axios";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

export default axiosSecure;
