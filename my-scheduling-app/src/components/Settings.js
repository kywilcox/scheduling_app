import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Settings = () => {
  const location = useLocation();
  const isNestedRoute = location.pathname.includes('build-user-profile') 
                        || location.pathname.includes('manage-users') 
                        || location.pathname.includes('account-settings') 
                        || location.pathname.includes('locations')
                        || location.pathname.includes('manage-assignments'); // Include new route

  return (
    <div>
      {!isNestedRoute && (
        <>
          <h2>Settings</h2>
          <nav>
            <ul>
              <li><Link to="account-settings">Account Settings</Link></li>
              <li><Link to="locations">Locations</Link></li>
              <li><Link to="build-user-profile">Build User Profile</Link></li>
              <li><Link to="manage-users">Manage Users</Link></li>
              <li><Link to="manage-assignments">Manage Assignments</Link></li> {/* New link */}
            </ul>
          </nav>
        </>
      )}
      <Outlet />
    </div>
  );
};

export default Settings;
