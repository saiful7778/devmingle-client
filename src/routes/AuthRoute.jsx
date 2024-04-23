import Loading from "@/components/Loading";
import useAuth from "@/hooks/useAuth";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ children }) => {
  const { user, loader } = useAuth();

  if (loader) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="lg:w-1/2 bg-white w-full mx-auto rounded-lg shadow-md p-4">
      {children}
    </div>
  );
};

AuthRoute.propTypes = {
  children: PropTypes.node,
};

export default AuthRoute;
