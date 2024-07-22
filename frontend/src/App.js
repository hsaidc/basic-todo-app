import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

// Pages
import Home from "./Pages/app/Home";
import Dashboard from "./Pages/app/Dashboard";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import RequestPasswordReset from "./Pages/auth/RequestPasswordReset";
import ResetPassword from "./Pages/auth/ResetPassword";

// Components
import NavigationBar from "./components/Utils/NavigationBar";

// Actions
import { authenticateUser } from "./actions/auth";

const LoggedIn = ({
  isLoggedIn,
  setIsLoggedIn,
  setToken,
  setUserID,
  userID,
}) => {
  return (
    <div className="flex h-full w-full min-w-[375px] flex-col items-center justify-start bg-primary-300 text-primary-100 sm:w-[640px]">
      <NavigationBar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setToken={setToken}
        setUserID={setUserID}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard userID={userID} />} />
      </Routes>
    </div>
  );
};

const NotLoggedIn = ({ isLoggedIn, setIsLoggedIn, setToken, setUserID }) => {
  return (
    <div className="flex h-96 w-[95%] flex-col items-center justify-center rounded-lg bg-primary-300 sm:w-[400px]">
      <NavigationBar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setToken={setToken}
        setUserID={setUserID}
      />
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/request-password-reset"
          element={<RequestPasswordReset />}
        />
        <Route
          path="/login"
          element={
            <Login
              setToken={setToken}
              setUserID={setUserID}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />
        <Route
          path="/register"
          element={
            <Register
              setToken={setToken}
              setUserID={setUserID}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />
      </Routes>
    </div>
  );
};

const Wrapper = ({
  isLoggedIn,
  setIsLoggedIn,
  setToken,
  userID,
  setUserID,
}) => {
  const navigate = useNavigate();
  let location = useLocation();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      authenticateUser(authToken)
        .then((res) => {
          if (res.status === true) {
            setToken(authToken);
            setUserID(res.userID);
            setIsLoggedIn(true);
            navigate("/dashboard");
          } else {
            localStorage.removeItem("authToken");
            navigate("/login");
          }
        })
        .catch((err) => console.log(err));
    } else if (location.pathname === "/reset-password" && location.search) {
      navigate(location.pathname + location.search);
    } else {
      navigate("/login");
    }
  }, []);

  if (!isLoggedIn) {
    return (
      <div className="flex h-dvh w-screen items-center justify-center overflow-hidden bg-primary-100">
        <NotLoggedIn
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setToken={setToken}
          setUserID={setUserID}
        />
      </div>
    );
  } else {
    return (
      <div className="flex h-[940px] w-screen items-center justify-center overflow-y-auto overflow-x-hidden bg-primary-100 lg:h-screen">
        <LoggedIn
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setToken={setToken}
          userID={userID}
          setUserID={setUserID}
        />
      </div>
    );
  }
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [userID, setUserID] = useState("");

  return (
    <BrowserRouter>
      <Wrapper
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        token={token}
        setToken={setToken}
        userID={userID}
        setUserID={setUserID}
      />
    </BrowserRouter>
  );
};

export default App;
