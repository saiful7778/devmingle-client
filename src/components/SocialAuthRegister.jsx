import { Button } from "keep-react";
import { FaGoogle } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

const SocialAuthRegister = () => {
  const { googleAuth } = useAuth();
  const axios = useAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const handleGoogleAuth = () => {
    googleAuth()
      .then((res) => {
        const user = res.user;
        const data = {
          userName: user.displayName,
          userEmail: user.email,
          userPhoto: user?.photoURL ? user?.photoURL : null,
          userToken: user.uid,
          badge: "bronze",
          userRole: "user",
          postCount: 0,
        };
        axios
          .post("/user", data)
          .then((res) => {
            if (res.data.acknowledged) {
              Swal.fire({
                title: `"${user.displayName}"`,
                text: "Account created successfully!",
                icon: "success",
              }).then(() => {
                navigate(location.state ? location.state.from.pathname : "/");
              });
            }
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              text: err,
            });
          });
      })
      .catch((err) => {
        console.error(err);
      });
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
