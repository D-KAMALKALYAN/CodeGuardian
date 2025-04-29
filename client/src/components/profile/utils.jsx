import { format } from 'date-fns';

/**
 * Format a date string into a human-readable format
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'MMMM dd, yyyy');
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

/**
 * Validate website URL format
 * @param {string} website - Website to validate
 * @returns {boolean} - Whether website URL is valid
 */
export const isValidWebsite = (website) => {
  return /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\S*)$/.test(website);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether phone number is valid
 */
export const isValidPhone = (phone) => {
  return /^\+?[0-9\s-()]{7,20}$/.test(phone);
};