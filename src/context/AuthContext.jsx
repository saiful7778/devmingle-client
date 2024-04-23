import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import useAxios from "@/hooks/useAxios";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "@/firebase";

export const AuthContext = createContext(null);

const AuthContextProvider = ({ children }) => {
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
    <AuthContext.Provider
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
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthContextProvider;
