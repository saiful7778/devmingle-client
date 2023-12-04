import PropTypes from "prop-types";
import Loading from "../components/Loading";
import useAuth from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";

const AdminRoute = ({ children }) => {
  const { user, loader } = useAuth();
  const [isAdmin, isLoading] = useAdmin();
  if (loader || isLoading) {
    return <Loading />;
  }
  if (user && isAdmin) {
    return children;
  }
  return <Navigate to="/login" />;
};
AdminRoute.propTypes = {
  children: PropTypes.node,
};
export default AdminRoute;
