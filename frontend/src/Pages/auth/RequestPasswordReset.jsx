import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { initiatePasswordReset } from "../../actions/auth";

const RequestPasswordReset = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const onEmailSubmit = async (e) => {
    let userData = {
      email: getValues("email"),
    };

    const res = await initiatePasswordReset(userData);

    if (res.status === 200) {
      setIsEmailSent(true);
    }

    if (res.status === 400) {
      let body = await res.json();
      setErrMessage(body.data);
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center text-primary-100">
      {!isEmailSent ? (
        <div className="flex w-full flex-col items-center justify-center gap-y-3">
          {errMessage ? (
            <p className="mb-1 px-3 text-center text-xl font-semibold">
              {errMessage}
            </p>
          ) : null}

          <p className="">Please enter email you registered.</p>
          <form
            className="flex w-full flex-col items-center justify-center gap-y-3"
            onSubmit={handleSubmit(onEmailSubmit)}
          >
            <input
              type="email"
              className="w-[80%] appearance-none rounded border bg-primary-100 px-3 py-2 text-center leading-tight text-gray-700 shadow focus:outline-none"
              placeholder="E-mail"
              {...register("email", {
                required: "Please enter a valid e-mail",
                maxLength: 330,
              })}
            />
            {errors.email ? (
              <span className="text-gray-100">{errors.email.message}</span>
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
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-y-3">
          Please check your e-mail to reset your password.
        </div>
      )}
    </div>
  );
};

export default RequestPasswordReset;
