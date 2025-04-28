// config/db.js - Enhanced MongoDB connection module
const mongoose = require('mongoose');
const colors = require('colors');

/**
 * Establishes connection to MongoDB with retry mechanism and proper error handling
 * @param {number} retryAttempts - Number of connection retry attempts
 * @returns {Promise<mongoose.Connection>} - MongoDB connection object
 */
const connectDB = async (retryAttempts = 5) => {
  let attempts = 0;
  
  while (attempts < retryAttempts) {
    try {
      // Performance optimization: setting poolSize for connection pooling
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4 // Use IPv4, skip trying IPv6
      });

      console.log(colors.cyan.bold(`[DATABASE] Connected to MongoDB successfully`));
      console.log(colors.green(`[DATABASE] Host: ${conn.connection.host}`));
      console.log(colors.green(`[DATABASE] Database: ${conn.connection.name}`));
      
      // Set up connection error handlers for persistent connection
      mongoose.connection.on('error', err => {
        console.error(colors.red(`[DATABASE] MongoDB connection error: ${err}`));
      });
      
      mongoose.connection.on('disconnected', () => {
        console.warn(colors.yellow(`[DATABASE] MongoDB disconnected. Attempting to reconnect...`));
      });
      
      // Graceful shutdown handling
      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        console.log(colors.yellow(`[DATABASE] MongoDB connection closed due to app termination`));
        process.exit(0);
      });
      
      return conn.connection;
    } catch (error) {
      attempts++;
      console.error(colors.red(`[DATABASE] Connection attempt ${attempts} failed: ${error.message}`));
      
      if (attempts >= retryAttempts) {
        console.error(colors.red.bold(`[DATABASE] Failed to connect to MongoDB after ${retryAttempts} attempts. Exiting...`));
        process.exit(1);
      }
      
      // Exponential backoff for retry
      const retryDelay = Math.min(1000 * 2 ** attempts, 10000);
      console.log(colors.yellow(`[DATABASE] Retrying in ${retryDelay/1000} seconds...`));
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
};

module.exports = connectDB;