import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log('Logout button clicked');
    try {
      const response = await axios.post('/logout/');
      console.log('Logout response:', response);
      navigate('/');
    } catch (error) {
      console.error('There was an error logging out!', error);
    }
  };

  return (
    <div className="landing-page">
      <header className="d-flex justify-content-between align-items-center p-3 bg-primary text-white">
        <div>
          <img src="logo-placeholder.jpg" alt="Logo" className="logo"/>
        </div>
        <div className="user-info">
          <span>Welcome, User</span>
          <button onClick={handleLogout} className="btn btn-secondary ml-3">Logout</button>
        </div>
      </header>
      
      <nav>
        <ul className="nav">
          <li className="nav-item"><Link to="/landing" className="nav-link">Landing</Link></li>
          <li className="nav-item"><Link to="/schedule" className="nav-link">Schedule</Link></li>
          <li className="nav-item"><Link to="/generation" className="nav-link">Generation</Link></li>
          <li className="nav-item"><Link to="/reports" className="nav-link">Reports</Link></li>
          <li className="nav-item"><Link to="/support" className="nav-link">Support</Link></li>
          <li className="nav-item"><Link to="/settings" className="nav-link">Settings</Link></li>
        </ul>
      </nav>

      <main className="container mt-5">
        {children}
      </main>
      
      <footer className="text-center p-3 bg-success text-white">
        <p>© 2024 Scheduling App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
