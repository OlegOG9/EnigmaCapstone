import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const Register = () => {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(values);
    //call the API
    axios
      .post("http://localhost:8081/register", values)
      .then((res) => {
        if (res.data.status === "Success") {
          console.log(res);

          navigate("/userdashboard");
        } else {
          console.log(res.data.Status);
          console.log("res: ", res);
          console.log("res.data ", res.data);
          console.log("res.data.description", res.data.description);
          alert("Error");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="d-flex justify-content-ceenter align-items-center bg-primary vh-100">
      <div className="bg-white p-5 rounded">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">
              <strong>Name</strong>
            </label>
            <input
              type="text"
              placeholder="Enter your name here"
              className="form-control rounded-0"
              id="name"
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>
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
            Sign Up
          </button>
          <Link
            to="/login"
            className="text-decoration-none btn btn-default w-100 bg-light rounded-0"
          >
            Sign-in
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
