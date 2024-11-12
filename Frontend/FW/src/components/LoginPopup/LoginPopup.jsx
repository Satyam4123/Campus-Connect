import React, { useState } from 'react';
import axios from 'axios';
import './LoginPopup.css';
import { assets } from '../../assets/assets';


const LoginPopup = ({ setShowLogin }) => {
    const [currState, setcurrState] = useState("Sign Up");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [department, setDepartment] = useState("");
    const [year, setYear] = useState("");
    const [error, setError] = useState("");

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            if (currState === "Sign Up") {
                // Sign-up request
                await axios.post("http://localhost:3000/auth/signup", { name, email, password });
                alert("Account created successfully! Please log in.");
                setcurrState("Login"); // Switch to login after signup
            } else {
                // Login request
                await axios.post("http://localhost:3000/auth/login", { email, password });
                alert("Login successful!");
                setShowLogin(false); // Close the login popup on success
            }
        } catch (error) {
            setError("Failed to " + currState.toLowerCase() + ": " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={handleSubmit} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
                    )}
                    <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <input type="text" placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
                    <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">{currState === "Sign Up" ? "Create account" : "Login"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy</p>
                </div>
                {currState === "Login" ? (
                    <p>Create a new account? <span onClick={() => setcurrState("Sign Up")}>Click Here</span></p>
                ) : (
                    <p>Already have an account? <span onClick={() => setcurrState("Login")}>Click Here</span></p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;
