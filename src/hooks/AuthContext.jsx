import { onAuthStateChanged } from "firebase/auth";
import PropTypes from "prop-types";
import { createContext, useState, useEffect } from "react";
import { auth } from "../firebase";

export const AuthContextData = createContext(null);

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (userData) => {
      setLoader(false);
      setUser(userData);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const authInfo = { user, loading: loader };

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
