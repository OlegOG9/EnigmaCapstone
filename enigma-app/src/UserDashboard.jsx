import React from "react";
import FileUpload from "./FileUpload";
import { useState } from "react";
import FileProcess from "./FileProcess";

const UserDashboard = () => {
  const [newUserInfo, setNewUserInfo] = useState({
    profileImages: [],
  });

  const updateUploadedFiles = (files) =>
    setNewUserInfo({ ...newUserInfo, profileImages: files });

  const handleSubmit = (event) => {
    event.preventDefault();
    //logic to create new user...
  };
  return (
    <div>
      <h1>UserDashboard</h1>
      {/* <form onSubmit={handleSubmit}>
        <FileUpload
          accept=".jpg,.png,.jpeg"
          label="Profile Image(s)"
          multiple
          updateFilesCb={updateUploadedFiles}
        />
        <button type="submit">Create New User</button>
      </form> */}
      <FileProcess />
    </div>
  );
};

export default UserDashboard;
