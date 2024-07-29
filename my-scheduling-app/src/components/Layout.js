import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from '../api/axios'; // Import the configured Axios instance
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [userName, setUserName] = useState('');

  const getCsrfToken = () => {
    const csrfToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
    if (csrfToken) {
      return csrfToken.split('=')[1];
    } else {
      console.error('CSRF token not found in cookies');
      return '';
    }
  };

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('get_csrf_token/', {
        withCredentials: true,
      });
      if (response.data.csrfToken) {
        document.cookie = `csrftoken=${response.data.csrfToken}; path=/`;
        console.log('Fetched and set CSRF token:', response.data.csrfToken);
      }
    } catch (error) {
      console.error('Error fetching CSRF token:', error);
    }
  };

  useEffect(() => {
    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('login/', formData, {
        headers: {
          'X-CSRFToken': getCsrfToken(),
        },
      });
      setIsLoggedIn(true);
      setUserName(response.data.user_name);
      sessionStorage.setItem('account_id', response.data.account_id);
      navigate('/landing');
    } catch (error) {
      console.error('There was an error logging in!', error);
    }
  };

  const handleLogout = async () => {
    try {
      const csrfToken = getCsrfToken();
      const response = await axios.post('logout/', {}, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
        withCredentials: true,
      });
      setIsLoggedIn(false);
      setUserName('');
      sessionStorage.removeItem('account_id');
      navigate('/');
    } catch (error) {
      console.error('There was an error logging out!', error);
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleDropdownBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    setDropdownVisible(false);
  }, [location]);

  useEffect(() => {
    if (location.pathname !== '/') {
      setIsLoggedIn(true);
      const fetchUserName = async () => {
        try {
          const response = await axios.get('get_user_name/', {
            headers: {
              'X-CSRFToken': getCsrfToken(),
            },
            withCredentials: true,
          });
          setUserName(response.data.user_name);
        } catch (error) {
          console.error('Error fetching user name:', error);
        }
      };

      fetchUserName();
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }
  }, [location]);

  return (
    <div className="landing-page">
      <header className="d-flex justify-content-between align-items-center p-3 bg-primary text-white">
        <div>
          <img src="logo-placeholder.jpg" alt="Logo" className="logo" />
        </div>
        {isLoggedIn ? (
          <div className="user-info">
            <span>Welcome, {userName ? userName : 'User'}</span>
            <button onClick={handleLogout} className="btn btn-secondary ml-3">Logout</button>
          </div>
        ) : (
          <div className="login-fields d-flex">
            <form onSubmit={handleSubmit} className="d-flex">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="form-control mr-2"
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="form-control mr-2"
                onChange={handleChange}
              />
              <button type="submit" className="btn btn-light">Login</button>
            </form>
          </div>
        )}
      </header>

      <nav>
        <ul className="nav">
          <li className="nav-item"><Link to="/landing" className="nav-link">Landing</Link></li>
          <li className="nav-item"><Link to="/schedule" className="nav-link">Schedule</Link></li>
          <li className="nav-item"><Link to="/generation" className="nav-link">Generation</Link></li>
          <li className="nav-item"><Link to="/reports" className="nav-link">Reports</Link></li>
          <li className="nav-item"><Link to="/support" className="nav-link">Support</Link></li>
          <li className="nav-item dropdown" onBlur={handleDropdownBlur}>
            <button className="nav-link dropbtn" onClick={toggleDropdown}>Settings</button>
            {dropdownVisible && (
              <div className="dropdown-content">
                <Link to="/settings/account-settings">Account Settings</Link>
                <Link to="/settings/build-user-profile">Build User Profile</Link>
                <Link to="/settings/manage-users">Manage Users</Link>
              </div>
            )}
          </li>
        </ul>
      </nav>

      <main className="container mt-5">
        <Outlet />
      </main>

      <footer className="text-center p-3 bg-success text-white">
        <p>© 2024 Scheduling App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
