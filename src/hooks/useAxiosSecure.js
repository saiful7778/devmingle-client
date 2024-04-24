import { useEffect } from "react";
import axiosSecure from "../config/axios.config";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const useAxiosSecure = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    axiosSecure.interceptors.response.use(
      (data) => {
        return data;
      },
      (err) => {
        let status = err.response.status;
        if (status === 401 || status === 403) {
          logout()
            .then(() => {
              navigate("/login");
            })
            .catch((err) => console.error(err));
        }
      }
    );
  }, [logout, navigate]);
  return axiosSecure;
};

export default useAxiosSecure;
