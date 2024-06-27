import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios'; 

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent form from submitting the default way
    console.log('handleLogin function called');
    console.log('Username:', username);
    console.log('Password:', password);

    try {
      console.log('Sending POST request to /api/login/');
      const response = await axios.post('login/', { // The base URL already includes /api/
        username,
        password,
      });

      console.log('Response:', response);

      if (response.status === 200) {
        console.log('Login successful');
        navigate('/landing'); // Redirect to the landing page
      } else {
        setError(response.data.error || 'Login failed. Please check your credentials and try again.');
        console.log('Login failed with status:', response.status);
      }
    } catch (error) {
      setError(error.response?.data?.error || 'An error occurred. Please try again later.');
      console.log('Error:', error);
    }
  };

  return (
    <div className="login-page">
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin} className="d-flex"> {/* Added className="d-flex" for flex layout */}
        <input
          type="text"
          placeholder="User Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="form-control mr-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
        />
        <button type="submit" style={{ display: 'none' }}>Login</button> {/* Hidden button to enable form submission on Enter */}
      </form>
    </div>
  );
};

export default LoginPage;
