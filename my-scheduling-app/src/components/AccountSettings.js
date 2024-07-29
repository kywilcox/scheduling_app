import React, { useState, useEffect } from 'react';
import axios from '../api/axios';  // Import the axios instance

const AccountSettings = () => {
  const [account, setAccount] = useState({
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
    zip_code: ''
  });

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const account_id = sessionStorage.getItem('account_id');  // Retrieve account_id from session storage
        const response = await axios.get(`http://localhost:8000/api/accounts/${account_id}/`);
        setAccount(response.data);
      } catch (error) {
        console.error('There was an error fetching the account details!', error);
      }
    };

    fetchAccountDetails();
  }, []);

  const handleInputChange = (field, value) => {
    setAccount(prevAccount => ({
      ...prevAccount,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const account_id = sessionStorage.getItem('account_id');  // Retrieve account_id from session storage
      const response = await axios.put(`http://localhost:8000/api/accounts/${account_id}/`, account);
      console.log('Account updated:', response.data);
    } catch (error) {
      console.error('There was an error updating the account!', error);
    }
  };

  return (
    <div>
      <h2>Account Settings</h2>
      <form>
        <label>
          Account Name:
          <input
            type="text"
            value={account.account_name}
            onChange={(e) => handleInputChange('account_name', e.target.value)}
          />
        </label>
        <label>
          Admin First Name:
          <input
            type="text"
            value={account.admin_first_name}
            onChange={(e) => handleInputChange('admin_first_name', e.target.value)}
          />
        </label>
        <label>
          Admin Last Name:
          <input
            type="text"
            value={account.admin_last_name}
            onChange={(e) => handleInputChange('admin_last_name', e.target.value)}
          />
        </label>
        <label>
          Admin Email:
          <input
            type="email"
            value={account.admin_email}
            onChange={(e) => handleInputChange('admin_email', e.target.value)}
          />
        </label>
        <label>
          Admin Password:
          <input
            type="password"
            value={account.admin_password}
            onChange={(e) => handleInputChange('admin_password', e.target.value)}
          />
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            value={account.phone_number}
            onChange={(e) => handleInputChange('phone_number', e.target.value)}
          />
        </label>
        <label>
          Address:
          <input
            type="text"
            value={account.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
        </label>
        <label>
          Address 2:
          <input
            type="text"
            value={account.address2}
            onChange={(e) => handleInputChange('address2', e.target.value)}
          />
        </label>
        <label>
          City:
          <input
            type="text"
            value={account.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
          />
        </label>
        <label>
          State:
          <input
            type="text"
            value={account.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
          />
        </label>
        <label>
          Zip Code:
          <input
            type="text"
            value={account.zip_code}
            onChange={(e) => handleInputChange('zip_code', e.target.value)}
          />
        </label>
        <button type="button" onClick={handleSave}>Update</button>
      </form>
    </div>
  );
};

export default AccountSettings;
