// server.js - Simplified for deployment on Render
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

// Route modules
const scanRoutes = require('./routes/scanRoutes.js');
const reportRoutes = require('./routes/reportRoutes.js');
const authRoutes = require('./routes/authRoutes');
const historyRoutes = require('./routes/historyRoutes.js');
const { protect } = require('./middleware/authMiddleware');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// App initialization function
const initializeApp = async () => {
  try {
    console.log(`[SERVER] Initializing application...`);
    
    // Connect to database
    await connectDB();
    
    const app = express();
    
    // Basic middleware
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Enable CORS
    app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    }));
    
    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/scan', protect, scanRoutes);
    app.use('/api/report', protect, reportRoutes);
    app.use('/api/history', protect, historyRoutes); // Added protect to history routes
    
    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({ status: 'success' });
    });
    
    // Handle undefined routes
    app.use(notFound);
    
    // Global error handler
    app.use(errorHandler);
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`[SERVER] Server running on port ${PORT}`);
    });
    
  } catch (error) {
    console.error(`[SERVER] Failed to initialize application: ${error.message}`);
    process.exit(1);
  }
};

// Initialize the application
initializeApp();