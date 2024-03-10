import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';
import Logo from '../assets/focusnook-logo.png';
import { AuthContext } from '../contexts/AuthContext';

function Login() {
    const [Email, setEmail] = useState('');
    const [Pass, setPass] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State to store the error message
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            email: Email,
            password: Pass,
        };

        axios.post('http://localhost:2000/login', userData)
            .then(function (response) {
                console.log('Success:', response.data);
                login(response.data.token);
                navigate('/Home');
            })
            .catch(function (error) {
                console.log(error.response);
                // Update the error message state based on the response from the server
                if (error.response && error.response.data) {
                    setErrorMessage(error.response.data.message || "Incorrect email or password.");
                } else {
                    setErrorMessage("An unexpected error occurred. Please try again.");
                }
            });
    };

    return (
        <div className='auth-form-container'>
            <div className='login-container'>
                <div className='logo-container'>
                    <img src={Logo} alt="FocusNook Logo" className='Logo'/>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="Email">Email</label>
                    <input value={Email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com"/>
                    <label htmlFor="Password">Password</label>
                    <input value={Pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="Password" name="Password"/>
                    <button type="submit">Log in</button>
                    {/* Conditional rendering of the error message */}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </form>

                <p className="signup-text">
                    Don't have an account? <Link to="/SignUp">Sign up here</Link>.
                </p>
            </div>
        </div>
    );
}

export default Login;
