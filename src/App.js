import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import auth, { login_user_locally } from "./services/auth";
import jwtDecode from "jwt-decode";

// import useLocalStorage from "./services/useLocalStorage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useState, useEffect } from "react";

function App() {
  const [User, setUser] = useState(null);
  useEffect(() => {
    let user = auth.getCurrentUser;
    // Get the token from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      const { data: user_data } = jwtDecode(token);
      login_user_locally(user_data);
      urlParams.delete("token");
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState({}, "", newUrl);
    }

    setUser(user);
  }, []);

  const handleLogin = async (username, password) => {
    const user_info = { username, password };
    try {
      await auth.login(user_info);
      window.location.reload();
    } catch (ex) {
      toast.error("Error while login" + ex);
    }
    // handle login logic
  };

  const handleLogout = () => {
    auth.logout();
    window.location.reload();
  };

  if (!User)
    return (
      <>
        <Login onLogin={handleLogin} />
        <ToastContainer />
      </>
    );
  if (User)
    return (
      <>
        <Dashboard onLogout={handleLogout} User={User} />
        <ToastContainer />
      </>
    );
}

export default App;
