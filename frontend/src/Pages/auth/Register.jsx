import { useState } from "react";

import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// Actions
import { registerUser } from "../../actions/auth";

// Components
import Eye from "../../components/icons/Eye";
import EyeOff from "../../components/icons/EyeOff";

const schema = yup
  .object({
    email: yup.string().email("Invalid email").required("Email is required!"),
    fullName: yup
      .string()
      .required("Name is required")
      .min(3, "Isn't your name too short?")
      .max(40, "Isn't your name too long?"),
    password: yup
      .string()
      .required("Password is required!")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/,
        "Password must include at least one number, one special character (dot is accepted as special character.), and be 8-16 characters long",
      ),
  })
  .required();

const Register = ({ setToken, setUserID, setIsLoggedIn }) => {
  let [type, setType] = useState("password");
  let [icon, setIcon] = useState("eye");
  let [errMessage, setErrMessage] = useState("");

  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (e) => {
    let userData = {
      name: getValues("fullName"),
      email: getValues("email"),
      password: getValues("password"),
    };

    const res = await registerUser(userData);

    if (res.status === 201) {
      let body = await res.json();
      if (body.status !== true)
        throw new Error("Failed to register user. Please try again!");

      const token = body.data.token;
      const userID = body.data.userID;

      setToken(token);
      setUserID(userID);
      setIsLoggedIn(true);
      localStorage.setItem("authToken", token);

      setErrMessage("");

      navigate("/");
    } else {
      let body = await res.json();
      setErrMessage(body.data);
    }
  };

  const handleTogglePassword = () => {
    if (type === "password") {
      setIcon("eye");
      setType("text");
    } else {
      setIcon("eyeOff");
      setType("password");
    }
  };
  return (
    <div className="flex w-full flex-1 justify-center px-5 py-5 text-primary-100">
      <div className="flex w-full flex-col items-center justify-center">
        {errMessage ? (
          <p className="mb-1 text-xl font-semibold">{errMessage}</p>
        ) : null}

        <form
          className="flex w-full flex-col items-center justify-center gap-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text"
            className="w-[90%] appearance-none rounded border bg-primary-100 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            placeholder="Full Name"
            {...register("fullName")}
          />
          {errors.fullName ? (
            <span className="text-gray-100">{errors.fullName.message}</span>
          ) : null}
          <input
            type="email"
            className="w-[90%] appearance-none rounded border bg-primary-100 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            placeholder="E-mail"
            {...register("email")}
          />
          {errors.email ? (
            <span className="text-gray-100">{errors.email.message}</span>
          ) : null}

          <div className="relative flex w-[90%] items-center justify-center">
            <input
              type={type}
              className="w-full appearance-none rounded border bg-primary-100 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              placeholder="Password"
              {...register("password")}
            />
            <span
              className={`absolute right-1 z-10`}
              onClick={handleTogglePassword}
            >
              {icon === "eye" ? <Eye /> : <EyeOff />}
            </span>
          </div>
          {errors.password ? (
            <span className=" items-center justify-center text-center text-gray-100">
              {errors.password.message}
            </span>
          ) : null}

          {!isSubmitting ? (
            <button
              className="h-12 w-[70%] rounded bg-primary-100 text-lg font-semibold text-gray-900 transition hover:scale-[1.02]"
              type="submit"
            >
              Sign up
            </button>
          ) : (
            <button
              className="h-12 w-[70%] rounded bg-primary-100 text-lg font-semibold text-gray-900 transition hover:scale-[1.02]"
              type="submit"
              disabled
            >
              Signing up...
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

Register.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Register;
