const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const sequelize = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const transactionRoutes = require('./routes/transactionRoutes.js');
const dashboardRoutes = require('./routes/dashboardRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests, please try again later.'
});
app.use('/api/', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send('Finance Tracker API Running'));

module.exports = app;
