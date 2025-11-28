// routes/transactionRoutes.js
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  addTransaction,
  viewTransactions,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');

// GET all transactions (with filters & pagination)
router.get('/', authenticate, viewTransactions);

// POST add new transaction (admin & user only)
router.post('/', authenticate, authorize('admin', 'user'), addTransaction);

// PUT update a transaction by ID (admin & user only)
router.put('/:id', authenticate, authorize('admin', 'user'), updateTransaction);

// DELETE a transaction by ID (admin & user only)
router.delete('/:id', authenticate, authorize('admin', 'user'), deleteTransaction);

module.exports = router;
