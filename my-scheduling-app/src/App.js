import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LandingPage from './components/LandingPage';
import SchedulePage from './components/SchedulePage';
import GenerationPage from './components/GenerationPage';
import ReportsPage from './components/ReportsPage';
import SupportPage from './components/SupportPage';
import Settings from './components/Settings';
import LoginPage from './components/LoginPage';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/generation" element={<GenerationPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
