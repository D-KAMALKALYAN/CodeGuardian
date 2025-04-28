// server.js - Enhanced Express server with proper error handling and setup
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const colors = require('colors');
const path = require('path');
const fs = require('fs');

// Route modules
const scanRoutes = require('./routes/scanRoutes.js');
const reportRoutes = require('./routes/reportRoutes.js');
const authRoutes = require('./routes/authRoutes');
const historyRoutes = require('./routes/history');
const { protect } = require('./middleware/authMiddleware');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// App initialization function
const initializeApp = async () => {
  try {
    // Create logs directory if it doesn't exist
    const logDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
    
    console.log(colors.cyan.bold(`[SERVER] Initializing application...`));
    
    // Connect to database
    await connectDB();
    
    const app = express();
    
    // Set security HTTP headers
    app.use(helmet());
    
    // Request body parsing
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));
    
    // Compress responses
    app.use(compression());
    
    // Enable CORS with options
    const corsOptions = {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };
    app.use(cors(corsOptions));
    console.log(colors.green(`[SERVER] CORS enabled for: ${corsOptions.origin}`));
    
    // Request logging
    // Create a write stream for access log
    const accessLogStream = fs.createWriteStream(
      path.join(__dirname, 'logs', 'access.log'), 
      { flags: 'a' }
    );
    
    // Log only in development environment to console
    if (process.env.NODE_ENV === 'development') {
      app.use(morgan('dev'));
    }
    
    // Log to file in all environments
    app.use(morgan('combined', { stream: accessLogStream }));
    
    // Rate limiting
    const limiter = rateLimit({
      max: 100, // Max 100 requests from same IP
      windowMs: 15 * 60 * 1000, // 15 minutes
      message: 'Too many requests from this IP, please try again later',
      standardHeaders: true, 
      legacyHeaders: false,
    });
    
    // Apply rate limiting to all routes
    app.use('/api/', limiter);
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'success',
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      });
    });
    
    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/scan', protect, scanRoutes);
    app.use('/api/report', protect, reportRoutes);
    app.use('/api/history', historyRoutes);
    
    // Protected route example
    app.get('/api/protected', protect, (req, res) => {
      console.log(`[SERVER] Protected route accessed by user: ${req.user.id}`);
      res.status(200).json({
        status: 'success',
        message: 'This is a protected route',
        user: {
          id: req.user.id,
          email: req.user.email
        }
      });
    });
    
    // Handle undefined routes
    app.use(notFound);
    
    // Global error handler
    app.use(errorHandler);
    
    // Start server
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(colors.rainbow(`[SERVER] =======================================================`));
      console.log(colors.cyan.bold(`[SERVER] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
      console.log(colors.rainbow(`[SERVER] =======================================================`));
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(colors.red.bold(`[SERVER] UNHANDLED REJECTION: ${err.name}: ${err.message}`));
      console.error(colors.red(err.stack));
      // Close server & exit process
      server.close(() => {
        console.log(colors.red('[SERVER] Server closed due to unhandled promise rejection'));
        process.exit(1);
      });
    });
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error(colors.red.bold(`[SERVER] UNCAUGHT EXCEPTION: ${err.name}: ${err.message}`));
      console.error(colors.red(err.stack));
      process.exit(1);
    });
    
    return server;
  } catch (error) {
    console.error(colors.red.bold(`[SERVER] Failed to initialize application: ${error.message}`));
    console.error(colors.red(error.stack));
    process.exit(1);
  }
};

// Initialize the application
initializeApp();