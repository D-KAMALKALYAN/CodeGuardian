const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const colors = require('colors');
const morgan = require('morgan');
const compression = require('compression');

// Route modules
const scanRoutes = require('./routes/scanRoutes.js');
const reportRoutes = require('./routes/reportRoutes.js');
const authRoutes = require('./routes/authRoutes');
const historyRoutes = require('./routes/historyRoutes.js');
const profileRoutes = require('./routes/profileRoutes.js');
const { protect } = require('./middleware/authMiddleware');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Set up environment variables
const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5000;
// Find this section in your server.js file and replace it with the following:

// Enable CORS with proper configuration
const allowedOrigins = [
  process.env.PROD_FRONTEND_URL,
  process.env.DEV_FRONTEND_URL,
  'https://code-guardian-frontend.onrender.com',
  'http://localhost:3000'
];



// Configure logging colors
colors.setTheme({
  info: 'cyan',
  success: 'green',
  warning: 'yellow',
  error: 'red'
});

const logInfo = (message) => console.log(`[INFO] ${message}`.info);
const logSuccess = (message) => console.log(`[SUCCESS] ${message}`.success);
const logWarning = (message) => console.log(`[WARNING] ${message}`.warning);
const logError = (message) => console.error(`[ERROR] ${message}`.error);

// App initialization function
const initializeApp = async () => {
  try {
    logInfo('Initializing application...');
    
    // Connect to database
    await connectDB();
    logSuccess('Database connected successfully');
    
    const app = express();
    
    // Security middleware
    app.use(helmet());
    
    // Compress responses
    app.use(compression());
    
    // Request logging
    if (NODE_ENV === 'development') {
      app.use(morgan('dev'));
    } else {
      app.use(morgan('combined'));
    }
    
    // Body parsers
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    app.use(cors({
      origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl requests, etc)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          console.log(`Origin ${origin} not allowed by CORS`);
          callback(null, true); // Change this to true to allow all origins temporarily for debugging
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true
    }));
    
    // API Routes

    app.get('/', (req, res) => {
      res.status(200).json({ 
        message: 'CodeGuardian API is running', 
        documentation: 'Access API endpoints at /api/auth, /api/scan, etc.',
        healthCheck: '/health'
      });
    });
    

    
    app.use('/api/auth', authRoutes);
    app.use('/api/scan', protect, scanRoutes);
    app.use('/api/report', protect, reportRoutes);
    app.use('/api/history', protect, historyRoutes);
    app.use('/api/profile', protect, profileRoutes);
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'success', environment: NODE_ENV });
    });

  
    // Handle undefined routes
    app.use(notFound);
    
    // Global error handler
    app.use(errorHandler);
    
    // Start server
    const server = app.listen(PORT, () => {
      logSuccess(`Server running in ${NODE_ENV} mode on port ${PORT}`);
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logError(`Unhandled Rejection: ${err.message}`);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
    
  } catch (error) {
    logError(`Failed to initialize application: ${error.message}`);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logError(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Initialize the application
initializeApp();

module.exports = { initializeApp }; // Export for testing