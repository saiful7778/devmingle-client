import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import useAxios from "./useAxios";

export const AuthContextData = createContext(null);

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loader, setLoader] = useState(true);
  const axios = useAxios();

  const register = (email, pass) => {
    setLoader(true);
    return createUserWithEmailAndPassword(auth, email, pass);
  };

  const googleAuth = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const login = (email, pass) => {
    setLoader(true);
    return signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      const userData = { userEmail: currentUser?.email };
      if (currentUser) {
        axios
          .post("/authentication/login", userData)
          .then(({ data }) => {
            setUserData(data.userData);
            setToken(data.token);
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        setUserData(null);
        setToken(null);
      }
      setLoader(false);
    });

    return () => {
      unSubscribe();
    };
  }, [axios]);

  return (
    <AuthContextData.Provider
      value={{
        user,
        loader,
        register,
        login,
        googleAuth,
        logout,
        token,
        userData,
      }}
    >
      {children}
    </AuthContextData.Provider>
  );
};
AuthContext.propTypes = {
  children: PropTypes.node,
};
export default AuthContext;
