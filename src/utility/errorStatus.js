import Swal from "sweetalert2";

const errorStatus = (errorCode) => {
  switch (errorCode.code) {
    case "auth/email-already-in-use":
      Swal.fire({
        icon: "error",
        text: "This email is already in use! please login",
      });
      break;
    case "auth/email-already-exists":
      Swal.fire({
        icon: "error",
        text: "This email is already exist! please login",
      });
      break;
    case "auth/insufficient-permission":
      Swal.fire({
        icon: "error",
        text: "Permission is declined. Please retry.",
      });
      break;
    case "auth/invalid-credential":
      Swal.fire({
        icon: "error",
        text: "Email or Password doesn't match",
      });
      break;
    default:
      Swal.fire({
        icon: "error",
        text: errorCode,
      });
      break;
  }
};
export default errorStatus;
