import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Settings = () => {
  const location = useLocation();
  const isNestedRoute = location.pathname.includes('build-user-profile') || location.pathname.includes('manage-users');

  return (
    <div>
      {!isNestedRoute && (
        <>
          <h2>Settings</h2>
          <nav>
            <ul>
              <li><Link to="build-user-profile">Build User Profile</Link></li>
              <li><Link to="manage-users">Manage Users</Link></li>
            </ul>
          </nav>
        </>
      )}
      <Outlet />
    </div>
  );
};

export default Settings;
