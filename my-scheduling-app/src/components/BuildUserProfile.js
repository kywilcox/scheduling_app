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

const BuildUserProfile = () => {
  const [fields, setFields] = useState(defaultFields);
  const [newField, setNewField] = useState({ name: '', required: false, type: 'text' });
  const [userTypes, setUserTypes] = useState([]);
  const [newUserType, setNewUserType] = useState('');
  const [isUserTypeExpanded, setIsUserTypeExpanded] = useState(false);

  useEffect(() => {
    // Fetch existing fields from the backend
    axios.get('http://localhost:8000/api/user_profile_fields/')
      .then(response => {
        const customFields = response.data.map(field => ({
          name: field.field_name,
          required: field.required,
          type: field.field_type
        }));
        setFields([...defaultFields, ...customFields]);
      })
      .catch(error => {
        console.error('There was an error fetching the fields!', error);
      });

    // Fetch existing user types from the backend
    axios.get('http://localhost:8000/api/user_types/')
      .then(response => {
        setUserTypes(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the user types!', error);
      });
  }, []);

  const toggleUserTypeSection = () => {
    setIsUserTypeExpanded(!isUserTypeExpanded);
  };

  const addUserType = () => {
    if (newUserType.trim()) {
      axios.post('http://localhost:8000/api/user_types/', { name: newUserType.trim() })
        .then(response => {
          setUserTypes([...userTypes, response.data]);
          setNewUserType(''); // Clear the input field
        })
        .catch(error => {
          console.error('There was an error saving the user type!', error);
        });
    }
  };

  const editUserType = (index, newValue) => {
    const updatedUserTypes = [...userTypes];
    updatedUserTypes[index].name = newValue;
    setUserTypes(updatedUserTypes);
    axios.put(`http://localhost:8000/api/user_types/${updatedUserTypes[index].user_type_id}/`, { name: newValue })
      .catch(error => {
        console.error('There was an error updating the user type!', error);
      });
  };

  const handleAddField = () => {
    axios.post('http://localhost:8000/api/user_profile_fields/', {
      field_name: newField.name,
      field_type: newField.type,
      required: newField.required
    })
      .then(response => {
        console.log('Field added successfully');
        setFields([...fields, newField]);
        setNewField({ name: '', required: false, type: 'text' });
      })
      .catch(error => {
        console.error('There was an error adding the field!', error);
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewField(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div>
      <h1>Build User Profile</h1>
      <ul>
        {fields.map((field, index) => (
          <li key={index}>
            <span
              onClick={field.name === 'User Type' ? toggleUserTypeSection : undefined}
              style={field.name === 'User Type' ? { cursor: 'pointer', color: 'blue' } : {}}
            >
              {field.name} {field.required && '(Required)'} - {field.type}
            </span>
            {field.name === 'User Type' && isUserTypeExpanded && (
              <div className="expandable-section">
                {userTypes.map((type, idx) => (
                  <div key={idx}>
                    <input
                      type="text"
                      value={type.name}
                      onChange={(e) => editUserType(idx, e.target.value)}
                    />
                  </div>
                ))}
                <div style={{ marginTop: '10px' }}>
                  <input
                    type="text"
                    value={newUserType}
                    onChange={(e) => setNewUserType(e.target.value)}
                    placeholder="New User Type"
                  />
                  <button onClick={addUserType}>Save</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: '20px' }}>
        <input 
          type="text" 
          name="name" 
          value={newField.name} 
          onChange={handleChange} 
          placeholder="New Field Name" 
        />
        <select name="type" value={newField.type} onChange={handleChange}>
          <option value="text">Text</option>
          <option value="email">Email</option>
          <option value="password">Password</option>
        </select>
        <label>
          <input 
            type="checkbox" 
            name="required" 
            checked={newField.required} 
            onChange={handleChange} 
          />
          Required
        </label>
        <button onClick={handleAddField}>Add Field</button>
      </div>
    </div>
  );
};

export default BuildUserProfile;
