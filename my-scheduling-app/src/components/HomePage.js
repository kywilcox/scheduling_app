// src/components/HomePage.js

import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';
import { Link } from 'react-router-dom';
import { fetchCsrfToken, getCsrfTokenFromCookies } from '../utils';

const HomePage = () => {
    useEffect(() => {
        const token = getCsrfTokenFromCookies();
        if (!token) {
            fetchCsrfToken();
        }
    }, []);

    return (
        <div className="homepage">
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
        </div>
    );
};

export default HomePage;
