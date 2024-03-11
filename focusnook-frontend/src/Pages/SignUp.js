import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import '../styles/Login.css';
import Logo from '../assets/focusnook-logo.png';

function SignUp() {
  const [Email, setEmail] = useState('');
  const [Pass, setPass] = useState('');
  const [PassConfirm, setPassConfirm] = useState(''); 
  const [Username, setUName] = useState('');
  const [errorMsg, setErrorMsg] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    // Check if passwords match
    if (Pass !== PassConfirm) {
      setErrorMsg('Passwords do not match.'); // Set error message
      return; // Prevent form submission
    }
    setErrorMsg(''); // Clear any previous error messages

    const userData = {
      email: Email,
      password: Pass,
      username: Username,
    };

    axios.post('http://localhost:2000/register', userData)
    .then(function (response) {
      console.log('Registered User:', response.data);
      const userId = response.data.userId; // Store user ID for later use
        // Now call the calendar create endpoint
        return axios.post('http://localhost:2000/calendar/create', /* necessary data for calendar creation */)
        .then(function (calendarResponse) {
        console.log('Calendar Created:', calendarResponse.data);
        const calendarId = calendarResponse.data.id; // Retrieve calendar ID from the response
       
               // Make sure you're returning this for the next .then() in the chain
        return { userId, calendarId }; // Return both _id and calendarId for the next step
      }); 
    }) 
    .then(function (data) {
      console.log('Data:', data);
      return axios.put(`http://localhost:2000/updateCalendarId/${data.userId}`, {calendarId : data.calendarId});
    })
    .then(function (updateResponse) {
      console.log('User updated with calendar ID:', updateResponse.data);
      navigate('/login'); // Redirect to login page or dashboard
    })
    .catch(function (error) {
      console.error('Error:', error);
      setErrorMsg('Sign up failed. Check if email is not already in use or try again later.');
    });
  };
    
  return (
    <div className='auth-form-container'>
      <div className='signup-container'>
        <div className='logo-container'>
          <img src={Logo} alt="FocusNook Logo" className='Logo'/>
        </div>
        <form className="signup-form" onSubmit={handleSubmit}> {/* Add onSubmit handler */}
          <label htmlFor="Email">* Email</label>
          <input value={Email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter an email"/>
          <label htmlFor="Password">* Password</label>
          <input value={Pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Enter a password" id="Password" name="Password"/>
          <label htmlFor="ConfirmPassword">* Confirm Password</label>
          <input value={PassConfirm} onChange={(e) => setPassConfirm(e.target.value)} type="password" placeholder="Re-enter your password" id="ConfirmPassword" name="ConfirmPassword"/>
          <label htmlFor="Username">* Username</label>
          <input value={Username} onChange={(e) => setUName(e.target.value)} type="text" placeholder="Enter username (can be changed later)"/>
          {errorMsg && <div className="error-message">{errorMsg}</div>}
          <button type="submit">Register</button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/Login">Login here</Link>.
        </p>
      </div>
    </div>
  );
}

export default SignUp;