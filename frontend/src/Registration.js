import React from "react";
import { useState } from "react";
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import "./Style/Register.css";

const Register = () => {

  const [email, SetEmail] = useState('');
  const [password, SetPassword] = useState('');
  const navigate = useNavigate();

  const RegistrationSubmit = async (e)=> {
    e.preventDefault();
    alert("hi");

    const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    });

    if (error) {
      console.log("Error");
      alert("Registration error");
    } else {
      navigate('/');
      alert("Registration was Succesfull Check your email");
    }
  }


  return (
    <div className="container">
      <h1>Register User</h1>
      <form id="register-form">
        
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" required value={email} onChange={(e) => SetEmail(e.target.value)} />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" required value={password} onChange={(e) => SetPassword(e.target.value)} />

        <button onClick={RegistrationSubmit} type="submit">Register</button>
        <button onClick={() => navigate("/")} className="button" id="registrationButton">Login</button>
      </form>
      <div id="response-message"></div>
    </div>
  );
};

export default Register;
