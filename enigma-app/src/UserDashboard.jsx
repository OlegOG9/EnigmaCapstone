import React from "react";
import FileUpload from "./FileUpload";
import { useState } from "react";

import { useParams } from "react-router-dom";
import FileProcess from "./FileProcess";

const UserDashboard = () => {
  const { userId } = useParams();

  console.log("userId in UserDashboard: ", userId);

  return (
    <div>
      <h1>UserDashboard</h1>

      <FileProcess userId={userId} />
    </div>
  );
};

export default UserDashboard;
