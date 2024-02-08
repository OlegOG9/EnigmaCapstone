import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("values at login", values);
    //call the API
    axios
      .post("http://localhost:8081/login", values)
      .then((res) => {
        if (res.data.rows.length > 0) {
          console.log(res);
          navigate("/userdashboard");
        } else {
          alert(res.data.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="d-flex justify-content-ceenter align-items-center bg-primary vh-100">
      <div className="bg-white p-5 rounded">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter your email here"
              className="form-control rounded-0"
              id="email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter your password here"
              className="form-control rounded-0"
              id="password"
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 rounded-0">
            Login
          </button>
          <p>
            Logging-in means you agree to use our website in accordance to our
            policies{" "}
          </p>
          <Link
            to="/register"
            className="text-decoration-none btn btn-default w-100 bg-light rounded-0"
          >
            Create an account
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
