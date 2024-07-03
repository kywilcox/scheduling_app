// src/components/Register.js

import React, { useState } from 'react';
import axios from '../api/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const states = [
  // Add state options here...
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

const Register = () => {
  const [formData, setFormData] = useState({
    account_name: '',
    admin_first_name: '',
    admin_last_name: '',
    admin_email: '',
    admin_password: '',
    phone_number: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip_code: '',
  });

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('register_account/', formData);
      console.log('Account created:', response.data);
      setShowModal(true);
    } catch (error) {
      console.error('There was an error creating the account!', error);
    }
  };

  const handleLoginRedirect = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <div className="form-container">
      <h1>Register New Account</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="account_name" placeholder="Account Name" onChange={handleChange} />
        <input type="text" name="admin_first_name" placeholder="Admin First Name" onChange={handleChange} />
        <input type="text" name="admin_last_name" placeholder="Admin Last Name" onChange={handleChange} />
        <input type="email" name="admin_email" placeholder="Admin Email" onChange={handleChange} />
        <input type="password" name="admin_password" placeholder="Admin Password" onChange={handleChange} />
        <input type="text" name="phone_number" placeholder="Phone Number" onChange={handleChange} />
        <input type="text" name="address" placeholder="Address" onChange={handleChange} />
        <input type="text" name="address2" placeholder="Address 2" onChange={handleChange} />
        <input type="text" name="city" placeholder="City" onChange={handleChange} />
        <select name="state" value={formData.state} onChange={handleChange}>
          <option value="">Select State</option>
          {states.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        <input type="text" name="zip_code" placeholder="Zip Code" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Account registration successful! Click the "Login" button to be taken to the Home Page.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleLoginRedirect}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Register;
