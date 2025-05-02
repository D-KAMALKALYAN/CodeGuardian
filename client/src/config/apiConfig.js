/**
 * API Configuration File
 * 
 * This file configures the base URL for all API calls and includes
 * environment detection to automatically switch between development
 * and production endpoints.
 */

// Detect environment based on hostname
const isLocalhost = 
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.includes('192.168.');

// Define API URLs
const PROD_URL = "https://code-guardian-backend.onrender.com";
const DEV_URL = "http://localhost:5000";

// Select appropriate URL based on environment
const API_BASE_URL = isLocalhost ? DEV_URL : PROD_URL;

// Log selected environment during development
if (process.env.NODE_ENV !== 'production') {
  console.log(`[API] Using ${isLocalhost ? 'development' : 'production'} API endpoint: ${API_BASE_URL}`);
}

// Export for use in components
export default API_BASE_URL;

/**
 * Usage:
 * 
 * 1. Import in any file that makes API calls:
 *    import API_BASE_URL from '../path/to/apiConfig';
 * 
 * 2. Use with axios:
 *    axios.get(`${API_BASE_URL}/api/endpoint`);
 * 
 * 3. Or create an axios instance:
 *    const apiClient = axios.create({ baseURL: API_BASE_URL });
 *    apiClient.get('/api/endpoint');
 */