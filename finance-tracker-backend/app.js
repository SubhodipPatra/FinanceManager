// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// ------------------ MIDDLEWARE ------------------ //

// Security headers
app.use(helmet());

// Enable CORS
app.use(cors({
  origin: [
    "http://localhost:5173",                     // Keep for local testing
    "https://finance-manager-qudh.vercel.app"           // <-- PASTE YOUR VERCEL URL HERE
  ],
  credentials: true
}));

// Logger
app.use(morgan('dev'));

// JSON parser
app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
  message: 'Too many requests, please try again later.'
});
app.use('/api/', apiLimiter);

// ------------------ ROUTES ------------------ //

// Auth routes
app.use('/api/auth', authRoutes);


app.use('/api/transactions', transactionRoutes);


app.use('/api/dashboard', dashboardRoutes);
app.use('/api', dashboardRoutes);


app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => res.send('Finance Tracker API Running'));


sequelize
  .sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('DB sync error:', err));

module.exports = app;
