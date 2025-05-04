/**
 * Validates token format
 * @param {string} token - JWT token to validate
 * @returns {boolean} True if token seems valid, false otherwise
 */
export const isValidTokenFormat = (token) => {
    // Basic validation: check if token is a string, not empty, and has proper JWT format
    if (!token || typeof token !== 'string') {
      return false;
    }
  
    // JWT tokens typically have 3 parts separated by dots (header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }
  
    // Each part should be a valid base64 string
    try {
      // Just check if each part can be decoded as base64
      // We're not checking the content, just the format
      for (const part of parts) {
        // Check if part contains valid base64 characters
        if (!/^[A-Za-z0-9_-]+$/g.test(part)) {
          return false;
        }
      }
      return true;
    } catch (error) {
      return false;
    }
  };