import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

// Components
import Eye from "../../components/icons/Eye";
import EyeOff from "../../components/icons/EyeOff";

// Actions
import { login } from "../../actions/auth";

const Login = ({ setToken, setUserID, setIsLoggedIn }) => {
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState("eye");
  let [errMessage, setErrMessage] = useState("");

  let navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (e) => {
    let userData = {
      email: getValues("email"),
      password: getValues("password"),
    };

    const res = await login(userData);

    if (res.status === 200) {
      const body = await res.json();
      if (body.status !== true)
        throw new Error("Failed to login user. Please try again!");

      const token = body.data.token;
      const userID = body.data.userID;

      setToken(token);
      setUserID(userID);
      localStorage.setItem("authToken", token);
      setIsLoggedIn(true);

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
    <div className="flex w-full flex-1 flex-col items-center justify-center px-5 py-5 text-primary-100">
      <div className="flex w-full flex-col items-center justify-center">
        {errMessage ? (
          <p className="mb-1 text-xl font-semibold">{errMessage}</p>
        ) : null}
        <p className="mb-5 text-xl font-semibold">a basic todo app.</p>
        <form
          className="flex w-full flex-col items-center justify-center gap-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="email"
            className="w-[90%] appearance-none rounded border bg-primary-100 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            placeholder="E-mail"
            {...register("email", {
              required: "Please enter a valid e-mail address!",
              maxLength: 330,
            })}
          />
          {errors.email ? (
            <span className="text-gray-100">{errors.email.message}</span>
          ) : null}
          <div className="relative flex w-[90%] items-center justify-center">
            <input
              type={type}
              className="w-full appearance-none rounded border bg-primary-100 px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
              placeholder="Password"
              {...register("password", {
                required: "Make sure your pass is between 8-16 characters!",
                minLength: 8,
                maxLength: 16,
              })}
            />
            <span
              className={`absolute right-1 z-10`}
              onClick={handleTogglePassword}
            >
              {icon === "eye" ? <Eye /> : <EyeOff />}
            </span>
          </div>
          {errors.password ? (
            <span className="text-gray-100">{errors.password.message}</span>
          ) : null}

          {!isSubmitting ? (
            <button
              className="h-10 w-[70%] rounded bg-primary-100 text-lg font-semibold text-gray-900 transition hover:scale-[1.02]"
              type="submit"
            >
              Log in
            </button>
          ) : (
            <button
              disabled
              className="h-10 w-[70%] cursor-not-allowed rounded bg-primary-100 text-lg font-semibold text-gray-900 transition hover:scale-[1.02]"
              type="submit"
            >
              Logging in...
            </button>
          )}

          <div
            className="flex w-full cursor-pointer justify-center"
            onClick={() => navigate("/request-password-reset")}
          >
            forgot your password?
          </div>
        </form>
      </div>
    </div>
  );
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Login;
