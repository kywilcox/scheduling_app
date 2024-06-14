// src/App.js
import React, { useState } from 'react';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // State to track login status

  const handleLogin = (username, password) => {
    console.log("Login attempt:", username, password);
    setIsLoggedIn(true);  // Placeholder, replace with actual authentication logic
  };

  return (
    <div>
      {isLoggedIn ? <MainPage /> : <LoginPage onLogin={handleLogin} />}
    </div>
  );
}

export default App;
