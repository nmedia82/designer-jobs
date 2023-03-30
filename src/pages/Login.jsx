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
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1>Login</h1>
          <Form onSubmit={onLoginForm}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button
                id="login-btn"
                variant="primary"
                type="submit"
                className="mt-3"
              >
                Submit
              </Button>
              <Link
                href={`${siteurl}/my-account/lost-password/`}
                id="reset-password-btn"
                variant="primary"
                type="submit"
                className="mt-3 btn btn-info"
              >
                Reset password
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
