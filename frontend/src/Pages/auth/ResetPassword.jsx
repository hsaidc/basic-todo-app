import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";

// Icons
import Eye from "../../components/icons/Eye";
import EyeOff from "../../components/icons/EyeOff";

// Actions
import { resetPassword } from "../../actions/auth";

const ResetPassword = () => {
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState("eye");
  const [errMessage, setErrMessage] = useState("");

  let navigate = useNavigate();
  let location = useLocation();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (e) => {
    let password = getValues("password");
    let token = location.search.split("=")[1];

    const res = await resetPassword({ password: password, token: token });

    if (res.status === 201) {
      navigate("/login");
    }

    if (res.status === 400) {
      let body = await res.json();
      setErrMessage(body.data);
    }
  };

  const handleToggle = () => {
    if (type === "password") {
      setIcon("eye");
      setType("text");
    } else {
      setIcon("eyeOff");
      setType("password");
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center text-primary-100">
      <div className="flex w-full flex-col items-center justify-center gap-y-3">
        {errMessage ? (
          <p className="mb-1 px-3 text-center text-xl font-semibold">
            {errMessage}
          </p>
        ) : null}
        <p className="">Please enter a new password</p>
        <form
          className="flex w-full flex-col items-center justify-center gap-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >
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
            <span className={`absolute right-1 z-10`} onClick={handleToggle}>
              {icon === "eye" ? <Eye /> : <EyeOff />}
            </span>
          </div>
          {errors.password ? (
            <span className="text-gray-100">
              Make sure your pass is between 8-16 characters!
            </span>
          ) : null}
          {!isSubmitting ? (
            <button
              className="h-10 w-[70%] rounded bg-primary-100 text-lg font-semibold text-gray-900 transition hover:scale-[1.02]"
              type="submit"
            >
              Reset Password
            </button>
          ) : (
            <button
              className="h-10 w-[70%] rounded bg-primary-100 text-lg font-semibold text-gray-900 transition hover:scale-[1.02]"
              type="submit"
            >
              Processing...
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
