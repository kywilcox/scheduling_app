// src/components/HomePage.js

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';
import axios from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const HomePage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('login/', formData);
      console.log('Login successful:', response.data);
      navigate('/landing');
    } catch (error) {
      console.error('There was an error logging in!', error);
    }
  };

  return (
    <div className="homepage">
      <header className="d-flex justify-content-between align-items-center p-3 bg-primary text-white">
        <div>
          <img src="logo-placeholder.jpg" alt="Logo" className="logo" />
        </div>
        <div className="login-fields">
          <form onSubmit={handleSubmit} className="d-flex">
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              className="form-control mr-2" 
              onChange={handleChange} 
              value={formData.email} 
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              className="form-control mr-2" 
              onChange={handleChange} 
              value={formData.password} 
            />
            <button type="submit" className="btn btn-light d-none" id="login-button">Login</button>
          </form>
        </div>
      </header>

      <main className="container mt-5">
        <section className="placeholder-container">
          <div className="placeholder">Placeholder 1</div>
          <div className="placeholder">Placeholder 2</div>
          <div className="placeholder">Placeholder 3</div>
        </section>

        <section className="call-to-action text-center mt-5">
          <Link to="/register" className="btn btn-primary">Register New Account</Link>
        </section>
      </main>

      <footer className="bg-secondary text-white text-center py-3 mt-5">
        <p>&copy; 2024 Scheduling App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
