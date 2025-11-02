import React from "react";
import { useState } from "react";
import { supabase } from './supabaseClient';
import './Style/Login.css';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, SetEmail] = useState('');
  const [password, SetPassword] = useState('');
  const navigate = useNavigate();

  const LoginSubmit = async (e) => {
    e.preventDefault();
    

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.log("Error");
      alert("Wrong Credential")
    } else {
      navigate('/Dashboard');
      alert("Login Succesfull");
    }
  }

  return (
    <div className="container">
      <div className="border">
        <p className="title">Login</p>

        <div>Email</div>
        <input
          className="email"
          type="text"
          placeholder="e.g. myusername@domain.com"
          value={email}
          onChange={(e) => SetEmail(e.target.value)}
          id="email"
        />

        <div>Password</div>
        <input
          className="email"
          type="password"
          placeholder="e.g. *********"
          value={password}
          onChange={(e) => SetPassword(e.target.value)}
          id="password"
        />

        <br />

        <button onClick={LoginSubmit} className="button" id="loginButton">
          Login
        </button>

        <br />

        <button onClick={() => navigate("/Registration")} className="button" id="registrationButton">
          Registration
        </button>

        <div
          id="errorMessage"
          className="errorText"
          style={{ visibility: "hidden" }}
        >
          Wrong Credentials.

        </div>
      </div>
    </div>
  );
};

export default Login;
