// src/utils.js

import axios from './api/axios';

export const getCsrfTokenFromCookies = () => {
  const csrfToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('csrftoken='));
  if (csrfToken) {
    console.log('CSRF token from cookies:', csrfToken.split('=')[1]);
    return csrfToken.split('=')[1];
  } else {
    console.error('CSRF token not found in cookies');
    return '';
  }
};

export const fetchCsrfToken = async () => {
  try {
    const response = await axios.get('/get_csrf_token/', {
      withCredentials: true,
    });
    if (response.data && response.data.csrfToken) {
      document.cookie = `csrftoken=${response.data.csrfToken}; path=/`;
      console.log('Fetched and set CSRF token:', response.data.csrfToken);
    }
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};
