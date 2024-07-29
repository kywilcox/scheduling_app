import React, { useState, useEffect } from 'react';
import axios from '../api/axios';  // Import the axios instance

const defaultFields = [
  { name: 'User Type', required: true, type: 'text' },
  { name: 'First Name', required: true, type: 'text' },
  { name: 'Last Name', required: true, type: 'text' },
  { name: 'Primary Email', required: true, type: 'email' },
  { name: 'Secondary Email', required: false, type: 'email' },
  { name: 'Password', required: true, type: 'password' },
  { name: 'Permissions', required: true, type: 'text' },
  { name: 'Professional Suffix', required: false, type: 'text' },
  { name: 'NPI', required: false, type: 'text' },
  { name: 'Mobile Phone', required: false, type: 'text' },
  { name: 'Pager', required: false, type: 'text' },
  { name: 'Schedule Name', required: true, type: 'text' }
];

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [fields, setFields] = useState(defaultFields);
  const [userTypes, setUserTypes] = useState([]);
  const [changedUsers, setChangedUsers] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/');
        setUsers(response.data);
      } catch (error) {
        console.error('There was an error fetching the users!', error);
      }
    };

    const fetchFields = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user_profile_fields/');
        const customFields = response.data.map(field => ({
          name: field.field_name,
          required: field.required,
          type: field.field_type
        }));
        setFields([...defaultFields, ...customFields]);
      } catch (error) {
        console.error('There was an error fetching the fields!', error);
      }
    };

    const fetchUserTypes = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user_types/');
        setUserTypes(response.data);
      } catch (error) {
        console.error('There was an error fetching the user types!', error);
      }
    };

    fetchUsers();
    fetchFields();
    fetchUserTypes();
  }, []);

  const handleInputChange = (userId, fieldName, value) => {
    const newUsers = users.map(user => {
      if (user.user_id === userId) {
        if (fieldName in user) {
          return { ...user, [fieldName]: value };
        } else {
          return { ...user, custom_fields: { ...user.custom_fields, [fieldName]: value } };
        }
      }
      return user;
    });
    setUsers(newUsers);
    setChangedUsers({ ...changedUsers, [userId]: true });
  };

  const addUser = () => {
    const newUser = {
      user_id: '', // Empty ID for new user
      account: 1, // Default account ID or dynamically set based on your application context
      is_active: true,
      first_name: '',
      last_name: '',
      user_type: '',
      primary_email: '',
      secondary_email: '',
      password: '',
      permissions: '',
      professional_suffix: '',
      npi: '',
      mobile_phone: '',
      pager: '',
      schedule_name: '',
      custom_fields: {}, // Empty custom fields object
      // Add other necessary fields with default values
    };
    setUsers([newUser, ...users]); // Add new user to the top of the list
  };
  

  const handleSave = async () => {
    try {
      const changedUsersArray = users.filter(user => changedUsers[user.user_id] || !user.user_id);
      const promises = changedUsersArray.map(user => {
        const method = user.user_id ? 'put' : 'post';
        const url = user.user_id
          ? `http://localhost:8000/api/users/${user.user_id}/`
          : 'http://localhost:8000/api/users/';
        console.log('Request payload:', user); // Log the request payload
        return axios[method](url, user);
      });
      const responses = await Promise.all(promises);
      const updatedUsers = responses.map(response => response.data);
      setUsers(prevUsers =>
        prevUsers.map(user =>
          updatedUsers.find(updatedUser => updatedUser.user_id === user.user_id) || user
        )
      );
      console.log('Users saved:', updatedUsers);
    } catch (error) {
      console.error('There was an error saving the users!', error);
      console.error('Error response:', error.response.data);  // Log the error response details
    }
  };
  
  return (
    <div>
      <h2>Manage Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Is Active</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>User Type</th>
            <th>Primary Email</th>
            <th>Secondary Email</th>
            <th>Password</th>
            <th>Permissions</th>
            <th>Professional Suffix</th>
            <th>NPI</th>
            <th>Mobile Phone</th>
            <th>Pager</th>
            <th>Schedule Name</th>
            {fields.filter(field => !defaultFields.map(f => f.name).includes(field.name)).map((field, index) => (
              <th key={`header-${index}`}>{field.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.user_id}</td>
              <td>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={user.is_active}
                  onChange={(e) => handleInputChange(user.user_id, 'is_active', e.target.checked)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={user.first_name}
                  onChange={(e) => handleInputChange(user.user_id, 'first_name', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={user.last_name}
                  onChange={(e) => handleInputChange(user.user_id, 'last_name', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={user.user_type}
                  onChange={(e) => handleInputChange(user.user_id, 'user_type', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="email"
                  value={user.primary_email}
                  onChange={(e) => handleInputChange(user.user_id, 'primary_email', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="email"
                  value={user.secondary_email || ''}
                  onChange={(e) => handleInputChange(user.user_id, 'secondary_email', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="password"
                  value={user.password}
                  onChange={(e) => handleInputChange(user.user_id, 'password', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={user.permissions}
                  onChange={(e) => handleInputChange(user.user_id, 'permissions', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={user.professional_suffix || ''}
                  onChange={(e) => handleInputChange(user.user_id, 'professional_suffix', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={user.npi || ''}
                  onChange={(e) => handleInputChange(user.user_id, 'npi', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={user.mobile_phone || ''}
                  onChange={(e) => handleInputChange(user.user_id, 'mobile_phone', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={user.pager || ''}
                  onChange={(e) => handleInputChange(user.user_id, 'pager', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={user.schedule_name}
                  onChange={(e) => handleInputChange(user.user_id, 'schedule_name', e.target.value)}
                />
              </td>
              {fields.filter(field => !defaultFields.map(f => f.name).includes(field.name)).map((field, index) => (
                <td key={`user-${user.user_id}-${index}`}>
                  <input
                    type={field.type}
                    value={user.custom_fields[field.name] || ''}
                    onChange={(e) => handleInputChange(user.user_id, field.name, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addUser}>Add User</button>
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ManageUsers;
