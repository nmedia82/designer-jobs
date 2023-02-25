import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useLocalStorage from "./services/useLocalStorage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { doLogin } from "./services/model";
import { useState, useEffect } from "react";
const isLoggedIn = true;

function App() {
  const [userInfo, setuserInfo] = useLocalStorage("user_info", {});

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleLogin = async (username, password) => {
    const user_info = { username, password };
    const login_resp = await doLogin(user_info);
    const { success, data } = login_resp.data;
    if (success) {
      console.log(data);
      setuserInfo(data);
      await sleep(500);
      // return window.location.reload();
    }
    return toast.error("Error while login" + data);
    // handle login logic
  };

  const handleLogout = () => {
    setuserInfo({});
  };
  console.log("user login", userInfo);
  if (!userInfo)
    return (
      <>
        <Login onLogin={handleLogin} />
        <ToastContainer />
      </>
    );
  if (userInfo)
    return (
      <>
        <Dashboard onLogout={handleLogout} User={userInfo} />
        <ToastContainer />
      </>
    );
}

export default App;
