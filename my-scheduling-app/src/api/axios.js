import axios from 'axios';

// Create an Axios instance
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/', // Fallback to local if env var is not set
  withCredentials: true, // Ensure cookies are sent with requests
  xsrfHeaderName: 'X-CSRFToken', // Set the CSRF token header name
  xsrfCookieName: 'csrftoken', // Set the CSRF token cookie name
});

export default instance;
