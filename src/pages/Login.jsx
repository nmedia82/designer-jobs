import { Link } from "@mui/material";
import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import data from "./../services/data.json";
const { siteurl } = data;

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLoginForm = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="container">

      {/* Image */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          src="https://lh3.googleusercontent.com/mopLJ9UHWKzwePgUa_ItRu8DGx6bmsoGsegqMXcdylFo3vxHQrXqK0SJLP3Jqhvnwk7wTZxcjfTIaURletGAuGG6RwXyHoTnEfxpA1I"
          alt="Your Logo"
          style={{ margin: "20px 0" }}
        />
      </div>
      <div>
        <div className="row justify-content-center">
          <div
            className="col-md-4"
            style={{
              backgroundColor: "#543bb0",

              borderRadius: "10px",
            }}
          >
            <Form onSubmit={onLoginForm}>
              <Form.Group
                controlId="formBasicEmail"
                style={{ margin: "20px 0" }}
              >
                <Form.Label style={{ textAlign: "right", color: "white" }}>
                  Email address or Username
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Email address or Username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Form.Group>

              <Form.Group
                controlId="formBasicPassword"
                style={{ margin: "20px 0" }}
              >
                <Form.Label style={{ textAlign: "right", color: "white" }}>
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Form.Group>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <Button
                  id="login-btn"
                  variant="primary"
                  type="submit"
                  className="mt-3"
                  style={{ backgroundColor: "black" }}
                >
                  Login
                </Button>
                <Link
                  href={`${siteurl}/my-account/lost-password/`}
                  id="reset-password-btn"
                  type="submit"
                  className="mt-3 btn btn-info"
                  style={{ backgroundColor: "yellow", color: "black" }}
                >
                  Reset password
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
