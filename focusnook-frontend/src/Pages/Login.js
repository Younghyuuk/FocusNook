import React, { useState } from 'react';
import './Login.css';
import Logo from '../assets/focusnook-logo.png';

function Login() {
    const [Email, setEmail] = useState('');
    const [Pass, setPass] = useState('');

    return (
        <div className='auth-form-container'> 
        <div className='login-container'>
          <div className= 'logo-container'>
          <img src={Logo} alt="FocusNook-Logo" className='Logo'/>
          </div>
          <form className="login-form">
            <label htmlFor="Email">Email</label>
            <input value={Email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com"/>
            <label htmlFor="Password">Password</label>
            <input value={Pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="Password" name="Password"/>
            <button type="submit">Log in</button>   
          </form>
    
          <p className="signup-text">
            Don't have an account?
          </p>
        </div>
        </div>
      );
}
export default Login;