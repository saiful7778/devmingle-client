import { Button } from "keep-react";
import { FaGoogle } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

const SocialAuthLogin = () => {
  const { googleAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleGoogleAuth = async () => {
    try {
      const { user } = await googleAuth();
      Swal.fire({
        icon: "success",
        title: user.displayName,
        text: "Account successfully logged in!",
      });
      navigate(location.state ? location.state.from.pathname : "/");
    } catch (err) {
      Swal.fire({
        icon: "error",
        text: err,
      });
    }
  };
  return (
    <div className="flex gap-2 justify-center items-center mt-4">
      <Button
        onClick={handleGoogleAuth}
        type="outlinePrimary"
        color="success"
        size="xs"
        className="btn p-2 text-xl"
      >
        <span className="pr-2">
          <FaGoogle />
        </span>
        Google
      </Button>
    </div>
  );
};

export default SocialAuthLogin;
