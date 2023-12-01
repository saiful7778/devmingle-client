import PropTypes from "prop-types";
import useAuth from "../hooks/useAuth";
import { useLocation, Navigate } from "react-router-dom";
import Loading from "../components/Loading";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const { user, loader } = useAuth();
  if (loader) {
    return <Loading />;
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
