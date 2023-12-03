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
      setLoader(false);
      setUser(currentUser);
      const userData = { email: currentUser?.email };
      if (currentUser) {
        axios
          .post("/jwt", userData)
          .then(({ data }) => {
            console.log(data);
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        axios
          .post("/jwt/logout", userData)
          .then(({ data }) => {
            console.log(data);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
    return () => {
      unSubscribe();
    };
  }, [axios]);

  const authInfo = { user, loader, register, login, googleAuth, logout };

  return (
    <AuthContextData.Provider value={authInfo}>
      {children}
    </AuthContextData.Provider>
  );
};
AuthContext.propTypes = {
  children: PropTypes.node,
};
export default AuthContext;
