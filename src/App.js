import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useLocalStorage from "./services/useLocalStorage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import { doLogin } from "./services/model";
import { useState, useEffect } from "react";
const isLoggedIn = true;

function App() {
  const [userInfo, setuserInfo] = useLocalStorage("user_info", {});

  const handleLogin = async (username, password) => {
    const user_info = { username, password };
    const login_resp = await doLogin(user_info);
    const { success, data } = login_resp.data;
    if (success) {
      setuserInfo(data);
      return window.location.reload();
    }
    return toast.error("Error while login" + data);
    // handle login logic
  };

  const handleLogout = () => {
    setuserInfo({});
  };
  // console.log(userInfo);
  if (!userInfo.data)
    return (
      <>
        <Login onLogin={handleLogin} />
        <ToastContainer />
      </>
    );

  return (
    <>
      <Dashboard onLogout={handleLogout} User={userInfo} />
      <ToastContainer />
    </>
  );
}

export default App;
