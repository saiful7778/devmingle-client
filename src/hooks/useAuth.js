import { useContext } from "react";
import { AuthContextData } from "./AuthContext";

const useAuth = () => {
  return useContext(AuthContextData);
};

export default useAuth;
