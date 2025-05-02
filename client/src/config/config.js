// API base URL configuration

// Automatically detect environment based on the current hostname
const isProd = window.location.hostname !== 'localhost' && 
               window.location.hostname !== '127.0.0.1';

const prod_URL = "https://code-guardian-backend.onrender.com";
const dev_URL = "http://localhost:5000";    

// Automatically select the appropriate URL based on environment
const API_BASE_URL = isProd ? prod_URL : dev_URL;

export default API_BASE_URL;