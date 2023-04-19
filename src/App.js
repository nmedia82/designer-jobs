import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import auth, { login_user_locally } from "./services/auth";
import jwtDecode from "jwt-decode";

// import useLocalStorage from "./services/useLocalStorage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useState, useEffect } from "react";
import { get_setting } from "./services/helper";
import useLocalStorage from "./services/useLocalStorage";

function App() {
  const [User, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [PopupSeen, setPopupSeen] = useLocalStorage("popup_seen", false);

  useEffect(() => {
    let user = auth.getCurrentUser;
    // Get the token from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      const { data: user_data } = jwtDecode(token);
      login_user_locally(user_data);
      urlParams.delete("token");
      const newUrl = `${window.location.pathname}`;
      window.history.replaceState({}, "", newUrl);
      window.location.reload();
    }

    setUser(user);
  }, []);

  const handleLogin = async (username, password) => {
    const user_info = { username, password };
    try {
      await auth.login(user_info);
      if (showPopupOnLogin()) return setShowModal(true);
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

  const showPopupOnLogin = () => {
    const popup_enabled = get_setting("enable_login_popup") || false;
    // console.log(popup_enabled);
    const popup_appearance =
      get_setting("login_popup_appearance") || "everytime";
    if (popup_enabled) {
      if (
        popup_appearance === "everytime" ||
        (popup_appearance === "firsttime" && !PopupSeen)
      ) {
        return true;
      }
    }
    return false;
  };

  const handlePopupSeen = () => {
    setPopupSeen(true);
    setShowModal(false);
    window.location.reload();
  };

  if (!User)
    return (
      <>
        <Login onLogin={handleLogin} />
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Login successful!</Modal.Title>
          </Modal.Header>
          <Modal.Body
            dangerouslySetInnerHTML={{
              __html: get_setting("login_popup_text"),
            }}
          ></Modal.Body>

          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                handlePopupSeen();
              }}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
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
