import PropTypes from "prop-types";
import useAuth from "../hooks/useAuth";
import { useLocation, Navigate } from "react-router-dom";
import { Spinner } from "keep-react";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { user, loader } = useAuth();
  if (loader) {
    return (
      <div className="w-full h-[50vh] flex justify-center items-center">
        <Spinner color="info" size="xl" />
      </div>
    );
  }
  if (user) {
    return children;
  }
  return <Navigate to="/login" state={{ from: location }} />;
};
PrivateRoute.propTypes = {
  children: PropTypes.node,
};
export default PrivateRoute;
