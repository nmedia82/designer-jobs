import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import auth from "./services/auth";

// import useLocalStorage from "./services/useLocalStorage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useState, useEffect } from "react";

function App() {
  const [User, setUser] = useState(null);
  useEffect(() => {
    const user = auth.getCurrentUser;
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
