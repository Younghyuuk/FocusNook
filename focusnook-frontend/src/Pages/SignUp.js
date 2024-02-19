import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css';
import Logo from '../assets/focusnook-logo.png';

/**
 * The `SignUp` page provides a form for users to register a new account.
 * It includes fields for the user's email, password, and username.
 * Upon successful registration, the user is navigated to the login page.
 */
function SignUp() {
  const [Email, setEmail] = useState('');
  const [Pass, setPass] = useState('');
  const [Username, setUName] = useState('');



  return (
    <div className='auth-form-container'>
      <div className='signup-container'>
      <div className= 'logo-container'>
          <img src={Logo} alt="FocusNook-Logo" className='Logo'/>
          </div>
      <form className="signup-form">
        <label htmlFor="Email">* Email</label>
        <input value={Email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter an email"/>
        <label htmlFor="Password">* Password</label>
        <input value={Pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Enter a password" id="Password" name="Password"/>
        <label htmlFor="Username">* Username</label>
        <input value={Username} onChange={(e) => setUName(e.target.value)} type="text" placeholder="Enter username (can be changed later)"/>
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