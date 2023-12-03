/* eslint-disable react/no-unescaped-entities */
import { useState, useRef } from "react";
import { Spinner, TextInput } from "keep-react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import CheckError from "../components/CheckError";
import useAuth from "../hooks/useAuth";
import errorStatus from "../utility/errorStatus";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import useAxios from "../hooks/useAxios";
import useTitle from "../hooks/useTitle";

const Login = () => {
  const { login } = useAuth();
  const axios = useAxios();
  const changeTitle = useTitle();
  const [spinner, setSpinner] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const recaptcha = useRef(null);
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  changeTitle("Login - DevMingle");

  const submitData = (e) => {
    setSpinner(true);
    const email = e.email;
    const pass = e.password;

    const captchaValue = recaptcha.current.getValue();
    if (!captchaValue) {
      Swal.fire({
        icon: "warning",
        text: "Please verify the reCAPTCHA!",
      });
      return setSpinner(false);
    }
    axios
      .post("/captcha/verify", { captchaValue })
      .then(({ data }) => {
        if (data.success) {
          login(email, pass)
            .then((res) => {
              Swal.fire({
                icon: "success",
                title: res.user.displayName,
                text: "Account successfully logged in!",
              });
              setSpinner(false);
              navigate(location.state ? location.state.from.pathname : "/");
            })
            .catch((err) => {
              errorStatus(err);
              setSpinner(false);
            });
        } else {
          Swal.fire({
            icon: "error",
            text: "Invalid reCaptcha!",
          });
          setSpinner(false);
        }
      })
      .catch((err) => {
        console.error(err);
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
        <ReCAPTCHA ref={recaptcha} sitekey={import.meta.env.VITE_SITE_KEY} />
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
