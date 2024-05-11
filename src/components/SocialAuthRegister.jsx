import { Button } from "keep-react";
import { FaGoogle } from "react-icons/fa";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

const SocialAuthRegister = () => {
  const { googleAuth } = useAuth();
  const axios = useAxios();
  const navigate = useNavigate();
  const location = useLocation();

  const handleGoogleAuth = async () => {
    try {
      const { user } = await googleAuth();
      const { data } = await axios.post("/user", {
        userName: user.displayName,
        userEmail: user.email,
        userToken: user.uid,
        userPhoto: user?.photoURL ? user?.photoURL : null,
      });
      if (!data.success) {
        throw new Error("Something went wrong");
      }
      await Swal.fire({
        title: `"${user.displayName}"`,
        text: "Account created successfully!",
        icon: "success",
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

export default SocialAuthRegister;
