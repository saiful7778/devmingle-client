import { useState, useRef } from "react";
import { TextInput, Spinner } from "keep-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import CheckError from "../../components/CheckError";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import useAuth from "../../hooks/useAuth";
import { updateProfile } from "firebase/auth";
import Swal from "sweetalert2";
import useAxios from "../../hooks/useAxios";
import errorStatus from "../../utility/errorStatus";
import ReCAPTCHA from "react-google-recaptcha";
import useTitle from "../../hooks/useTitle";
import SocialAuthRegister from "../../components/SocialAuthRegister";
import imageUpload from "@/utility/imageUpload";

const Register = () => {
  const { register: signUp } = useAuth();
  const axios = useAxios();
  const recaptcha = useRef(null);
  const navigate = useNavigate();
  const changeTitle = useTitle();
  const [spinner, setSpinner] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  changeTitle("Register - DevMingle");

  const handleNavigate = () => {
    navigate("/");
  };

  const submitData = async (e) => {
    try {
      setSpinner(true);

      const userProfilePic = e.profilePic[0];
      const userName = e.fullName;
      const email = e.email;
      const pass = e.password;

      const captchaValue = recaptcha.current.getValue();
      if (!captchaValue) {
        Swal.fire({
          icon: "warning",
          text: "Please verify the reCAPTCHA!",
        });
        setSpinner(false);
        return;
      }

      const { data: reCaptcha } = await axios.post("/captcha/verify", {
        captchaValue,
      });
      if (!reCaptcha.success) {
        Swal.fire({
          icon: "error",
          text: "Invalid reCaptcha!",
        });
        setSpinner(false);
        return;
      }

      if (userProfilePic) {
        const imageLink = await imageUpload(userProfilePic);
        if (!imageLink) {
          setSpinner(false);
          return;
        }
        await userRegister(
          axios,
          signUp,
          {
            email,
            pass,
            userName,
            imgUrl: imageLink,
          },
          handleNavigate
        );
      } else {
        await userRegister(
          axios,
          signUp,
          { email, pass, userName },
          handleNavigate
        );
      }
    } catch (err) {
      errorStatus(err);
    } finally {
      setSpinner(false);
      reset();
    }
  };

  return (
    <>
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
        <ReCAPTCHA ref={recaptcha} sitekey={import.meta.env.VITE_SITE_KEY} />
        <button
          className="w-full bg-blue-600 text-white rounded-md p-2 font-medium active:focus:scale-95 duration-150"
          type="submit"
        >
          {spinner ? <Spinner color="info" size="sm" /> : "REGISTER"}
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Do you have an account?{" "}
        <Link className="text-blue-600 italic underline" to="/login">
          login
        </Link>
      </p>
      <SocialAuthRegister />
    </>
  );
};

const userRegister = async (axios, signUp, userData, handleNavigate) => {
  const { user } = await signUp(userData.email, userData.pass);

  await updateProfile(user, {
    displayName: userData.userName,
    photoURL: userData?.imgUrl,
  });

  const { data } = await axios.post("/user", {
    userName: userData.userName,
    userEmail: userData.email,
    userPhoto: userData?.imgUrl ? userData?.imgUrl : null,
    userToken: user.uid,
  });

  if (!data.success) {
    throw new Error("User do not create");
  }

  const { isConfirmed } = await Swal.fire({
    title: `"${userData.userName}"`,
    text: "Account created successfully!",
    icon: "success",
  });

  if (isConfirmed) {
    handleNavigate();
  }
};

export default Register;
