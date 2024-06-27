// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
    // baseURL: 'http://localhost:8000/api/',
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/', // Fallback to local if env var is not set 
});

export default instance;
