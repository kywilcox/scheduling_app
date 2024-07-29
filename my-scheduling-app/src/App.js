import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import LandingPage from './components/LandingPage';
import SchedulePage from './components/SchedulePage';
import GenerationPage from './components/GenerationPage';
import ReportsPage from './components/ReportsPage';
import SupportPage from './components/SupportPage';
import Settings from './components/Settings';
import BuildUserProfile from './components/BuildUserProfile';
import ManageUsers from './components/ManageUsers';
import LoginPage from './components/LoginPage';
import Register from './components/Register';
import Layout from './components/Layout';
import AccountSettings from './components/AccountSettings'; // Import the new component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="landing" element={<LandingPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="generation" element={<GenerationPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="settings" element={<Settings />}>
            <Route path="account-settings" element={<AccountSettings />} />
            <Route path="build-user-profile" element={<BuildUserProfile />} />
            <Route path="manage-users" element={<ManageUsers />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
