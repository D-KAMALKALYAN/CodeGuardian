const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const scanRoutes = require("./routes/ScanRoutes.js");
const reportRoutes = require("./routes/reportRoutes.js");
const authRoutes = require('./routes/authRoutes');
const { protect } = require('./middleware/authMiddleware');

dotenv.config();
connectDB();


const app = express();
app.use(express.json());
// app.use(cors());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000", // Frontend URL
  credentials: true
}));


app.use('/api/auth', authRoutes);

// Protected route example
app.get('/api/protected', protect, (req, res) => {
  res.send('This is a protected route.');
});

app.use('/api/scan', scanRoutes);
app.use('/api/report', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));