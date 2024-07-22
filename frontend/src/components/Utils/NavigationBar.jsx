import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NavigationBar = (params) => {
  const navigate = useNavigate();

  const logOut = () => {
    params.setToken("");
    params.setUserID("");
    params.setIsLoggedIn(false);
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <nav className="z-10 mb-2 flex h-12 max-h-12 min-h-12 w-full items-center justify-center border-b-2 border-gray-50 text-primary-100">
      {params.isLoggedIn ? (
        <Link
          className="flex h-full w-1/2 items-center justify-center bg-primary-300 font-medium shadow-sm transition hover:scale-[1.02] hover:ring-1 hover:ring-white"
          to="/"
          style={{ padding: 5 }}
        >
          Home
        </Link>
      ) : null}
      {params.isLoggedIn ? (
        <Link
          className="flex h-full w-1/2 items-center justify-center  bg-primary-300 font-medium shadow-sm transition hover:scale-[1.02] hover:ring-1 hover:ring-white"
          to="/dashboard"
          style={{ padding: 5 }}
        >
          Tasks
        </Link>
      ) : null}
      {params.isLoggedIn ? (
        <button
          className="flex h-full w-1/2 items-center justify-center bg-primary-300 font-medium shadow-sm transition hover:scale-[1.02] hover:ring-1 hover:ring-white"
          onClick={logOut}
        >
          Logout
        </button>
      ) : null}
      {!params.isLoggedIn ? (
        <Link
          className="flex h-full w-1/2 items-center justify-center  bg-primary-300 font-medium shadow-sm transition hover:scale-[1.02] hover:ring-1 hover:ring-white"
          to="/login"
          style={{ padding: 5 }}
        >
          <span>Login</span>
        </Link>
      ) : null}
      {!params.isLoggedIn ? (
        <Link
          className="flex h-full w-1/2 items-center justify-center  bg-primary-300 font-medium shadow-sm transition hover:scale-[1.02] hover:ring-1 hover:ring-white"
          to="/register"
          style={{ padding: 5 }}
        >
          <span>Sign Up</span>
        </Link>
      ) : null}
    </nav>
  );
};

export default NavigationBar;
