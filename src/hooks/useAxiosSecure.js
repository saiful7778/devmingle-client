import { useEffect } from "react";
import axiosSecure from "../config/axios.config";

const useAxiosSecure = () => {
  useEffect(() => {
    axiosSecure.interceptors.response.use(
      (data) => {
        return data;
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);
  return axiosSecure;
};

export default useAxiosSecure;
