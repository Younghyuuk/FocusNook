import React, { useState, useContext, useEffect, } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from 'react-router-dom'; // Import Navigate
import "../styles/Account.css";

function Account() {
  const { authToken, logout} = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [emailNotification, setEmailNotification] = useState(true);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:2000/profile", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setEmail(response.data.email);
      setName(response.data.username);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleLogout = () => {
    logout(); // Call logout function from AuthContext

    // Redirect to login page after logout using Navigate
    return <Navigate to="/Login" />;
  };


  const handleSave = async () => {
    try {
      // Check if the name field is empty
      if (!name.trim()) {
        setNameError(true);
        return;
      } else {
        setNameError(false);
      }

      // Check if the password and confirm password fields match
      if (password !== confirmPassword) {
        setPasswordMismatch(true);
        return;
      } else {
        setPasswordMismatch(false);
      }

      // Fetch the profile data to compare with the current state
      const profileResponse = await axios.get("http://localhost:2000/profile", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Create an object to hold updated data
      const updatedData = {};

      // Check if the password field is not empty and matches the confirmPassword field
      if (password && password === confirmPassword) {
        updatedData.password = password;
      }

      // Include other fields if they have changed
      if (name !== profileResponse.data.username) {
        updatedData.username = name;
      }

      // Check if email notification preference has changed
    if (emailNotification !== profileResponse.data.notification) {
      updatedData.notification = emailNotification;
    }

      // Call the update service only if there are updated fields
      if (Object.keys(updatedData).length > 0) {
        const response = await axios.put(
          "http://localhost:2000/profile/update",
          updatedData,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        console.log("Profile updated:", response.data);
        setSuccessMessage("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Function to handle change of input fields after saving
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
    } else if (name === "confirm-password") {
      setConfirmPassword(value);
    } else if (name === "name") {
      setName(value);
    }
    setSuccessMessage(""); // Clear success message
  };

  return (
    <div className="account-main-container">
      <h1>Account</h1>
      <div className="account-container">
        <form>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} readOnly />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={handleInputChange} // Clear success message on input change
          />

          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={handleInputChange} // Clear success message on input change
          />

          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={handleInputChange} // Clear success message on input change
          />

          <div className="email-notification-toggle">
            <label htmlFor="email-notification">Email Notification</label>
            <input
              id="email-notification"
              type="checkbox"
              checked={emailNotification}
              onChange={() => setEmailNotification(!emailNotification)}
            />
          </div>

          <div className="message-container">
            {passwordMismatch && (
              <p className="error-message">Passwords do not match!</p>
            )}
            {nameError && (
              <p className="error-message">Name cannot be empty!</p>
            )}
            {successMessage && (
              <p className="success-message">{successMessage}</p>
            )}
          </div>

          <button type="button" onClick={handleSave}>
            Save
          </button>
        </form>
        
      </div>
      <div className="logout-button-container">
      <button onClick={handleLogout}>Logout</button>
    </div>
    
    </div>
  );
}

export default Account;