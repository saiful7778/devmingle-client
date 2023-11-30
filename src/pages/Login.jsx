/* eslint-disable react/no-unescaped-entities */
import { Spinner, TextInput } from "keep-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import {
  loadCaptchaEnginge,
  LoadCanvasTemplateNoReload,
  validateCaptcha,
} from "react-simple-captcha";
import CheckError from "../components/CheckError";
import useAuth from "../hooks/useAuth";
import errorStatus from "../utility/errorStatus";
import Swal from "sweetalert2";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const [spinner, setSpinner] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    loadCaptchaEnginge(6);
  }, []);

  const submitData = (e) => {
    setSpinner(true);
    const email = e.email;
    const pass = e.password;
    const captchaCode = e.captcha;
    if (validateCaptcha(captchaCode) === false) {
      Swal.fire({
        icon: "error",
        title: "Invalide captcha",
      });
      return setSpinner(false);
    }
    login(email, pass)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: res.user.displayName,
          text: "Account successfully logged in!",
        });
        navigate(location.state ? location.state : "/");
        setSpinner(false);
      })
      .catch((err) => {
        errorStatus(err);
        setSpinner(false);
      });
  };
  return (
    <div className="lg:w-1/2 bg-white w-full mx-auto rounded-lg shadow-md p-4">
      <h3 className="text-blue-600 text-5xl font-bold text-center mb-6">
        Login
      </h3>
      <form onSubmit={handleSubmit(submitData)} className="space-y-3">
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
        Don't have any account?{" "}
        <Link className="text-blue-600 italic underline" to="/register">
          register
        </Link>
      </p>
    </div>
  );
};

export default Login;
