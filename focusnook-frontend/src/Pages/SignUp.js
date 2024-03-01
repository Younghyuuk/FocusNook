import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import '../styles/Login.css';
import Logo from '../assets/focusnook-logo.png';

function SignUp() {
  const [Email, setEmail] = useState('');
  const [Pass, setPass] = useState('');
  const [Username, setUName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    const userData = {
      email: Email,
      password: Pass,
      username: Username,
    };

    axios.post('http://localhost:2000/register', userData)
      .then(function (response) {
        console.log('Success:', response.data);
        navigate('/Login'); // Redirect to login page on successful registration
      })
      .catch(function (error) {
        console.error('Error:', error);
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
