import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>
        <strong>Enigma</strong>
      </h1>
      <p>
        We help people control their finances by automating their bookkeeping
        and safeguarding their important documents
      </p>
      <Link
        to="/register"
        className="text-decoration-none btn btn-default w-100 bg-light rounded-0"
      >
        Interested? Create an account
      </Link>
      <Link
        to="/login"
        className="text-decoration-none btn btn-default w-100 bg-light rounded-0"
      >
        If you are a member already, please log-in
      </Link>
    </div>
  );
};

export default Home;
