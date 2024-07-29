// src/components/LoginPage.js

import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();

    const getCsrfToken = () => {
        const csrfToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
        return csrfToken ? csrfToken.split('=')[1] : '';
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/login/', formData, {
                headers: {
                    'X-CSRFToken': getCsrfToken(),
                },
            });
            console.log('Login successful:', response.data);
            // Store account_id in session storage
            sessionStorage.setItem('account_id', response.data.account_id);
            // Redirect to the landing page
            navigate('/landing');
        } catch (error) {
            console.error('There was an error logging in!', error);
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="form-control"
                    onChange={handleChange}
                    value={formData.email}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="form-control"
                    onChange={handleChange}
                    value={formData.password}
                />
                <button type="submit" className="btn btn-primary mt-3">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
