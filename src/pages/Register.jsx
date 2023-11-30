import { useState, useEffect } from "react";
import { Button, Modal, TextInput, Spinner } from "keep-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import CheckError from "../components/CheckError";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplateNoReload,
  validateCaptcha,
} from "react-simple-captcha";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { updateProfile } from "firebase/auth";

const Register = () => {
  const { register: signUp } = useAuth();
  const [messageStatus, setMessageStatus] = useState("");
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const handleModalButton = () => {
    navigate("/");
    setShowModal((l) => !l);
  };

  const submitData = async (e) => {
    setSpinner(true);
    setMessageStatus("");

    const captchaCode = e.captcha;
    const userProfilePic = e.profilePic[0];
    const userName = e.fullName;
    const email = e.email;
    const pass = e.password;

    if (validateCaptcha(captchaCode) === false) {
      setMessageStatus("Invalid captcha");
      setSpinner(false);
      return setShowModal(true);
    }
    if (userProfilePic) {
      const formData = new FormData();
      formData.set("key", import.meta.env.VITE_IMGBB_API);
      formData.append("image", userProfilePic);
      axios
        .post("https://api.imgbb.com/1/upload", formData)
        .then((res) => {
          UserRegister(
            signUp,
            {
              email,
              pass,
              userName,
              imgUrl: res.data.data.url,
            },
            setSpinner,
            setMessageStatus,
            setShowModal,
            reset
          );
        })
        .catch((err) => {
          console.error(err);
          setMessageStatus(err);
          setShowModal(true);
          setSpinner(false);
        });
    } else {
      UserRegister(
        signUp,
        { email, pass, userName },
        setSpinner,
        setMessageStatus,
        setShowModal,
        reset
      );
    }
  };
  return (
    <div className="lg:w-1/2 bg-white w-full mx-auto rounded-lg shadow-md p-4">
      <h3 className="text-blue-600 text-5xl font-bold text-center mb-6">
        Register
      </h3>
      <form onSubmit={handleSubmit(submitData)} className="space-y-3">
        <input type="file" accept="image/*" {...register("profilePic")} />
        <TextInput
          placeholder="Full name"
          {...register("fullName", { required: true })}
        />
        <CheckError error={errors} inputName="fullName" fieldName="required">
          Name is required
        </CheckError>
        <TextInput
          placeholder="Email address"
          type="email"
          {...register("email", {
            required: "Email Address is required",
            pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
          })}
          aria-invalid={errors.email ? "true" : "false"}
        />
        <CheckError error={errors} inputName="email" fieldName="required">
          Email Address is required
        </CheckError>
        <CheckError error={errors} inputName="email" fieldName="pattern">
          Invalid email address
        </CheckError>
        <div className="relative">
          <TextInput
            placeholder="Password"
            type={showPass ? "text" : "password"}
            {...register("password", {
              required: "Minimum 6 characters password",
              pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,12}$/,
            })}
            aria-invalid={errors.password ? "true" : "false"}
          />
          <button
            onClick={() => setShowPass((l) => !l)}
            className="absolute top-1/2 -translate-y-1/2 right-2 z-30 text-gray-500 p-2"
            type="button"
          >
            {showPass ? <IoIosEye size={25} /> : <IoIosEyeOff size={25} />}
          </button>
        </div>
        <CheckError error={errors} inputName="password" fieldName="required">
          Password is required
        </CheckError>
        <CheckError error={errors} inputName="password" fieldName="pattern">
          <div className="leading-4">
            Password required:
            <ul className="ml-5 list-disc">
              <li>minimum 6 characters</li>
              <li>numbers</li>
              <li>uppercase</li>
              <li>lowercase</li>
              <li>special character</li>
            </ul>
          </div>
        </CheckError>
        <LoadCanvasTemplateNoReload />
        <TextInput
          placeholder="Captcha code"
          type="text"
          {...register("captcha", {
            required: "captcha is required",
            pattern: /^.{6}$/,
          })}
        />
        <CheckError error={errors} inputName="captcha" fieldName="required">
          Captcha is required
        </CheckError>
        <CheckError error={errors} inputName="captcha" fieldName="pattern">
          Invalid captcha
        </CheckError>
        <button
          className="w-full bg-blue-600 text-white rounded-md p-2 font-medium active:focus:scale-95 duration-150"
          type="submit"
        >
          {spinner ? <Spinner color="info" size="sm" /> : "LOGIN"}
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Do you have an account?{" "}
        <Link className="text-blue-600 italic underline" to="/login">
          login
        </Link>
      </p>
      <Modal size="xl" show={showModal}>
        <Modal.Body>
          <div className="text-xl font-bold text-center my-10">
            {messageStatus}
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-center">
          <Button
            type="primary"
            color="error"
            size="xs"
            onClick={handleModalButton}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const UserRegister = (
  signUp,
  userData,
  setSpinner,
  setMessageStatus,
  setShowModal,
  reset
) => {
  signUp(userData.email, userData.pass)
    .then((result) => {
      const user = result.user;
      updateProfile(user, {
        displayName: userData.userName,
        photoURL: userData?.imgUrl,
      })
        .then(() => {
          setMessageStatus(
            `"${userData.userName}" account created successfully!`
          );
          setShowModal(true);
          reset();
          setSpinner(false);
        })
        .catch((err) => {
          console.error(err);
          setMessageStatus(err);
          setShowModal(true);
          setSpinner(false);
        });
    })
    .catch((err) => {
      console.error(err);
      setMessageStatus(err);
      setShowModal(true);
      setSpinner(false);
    });
};

export default Register;
