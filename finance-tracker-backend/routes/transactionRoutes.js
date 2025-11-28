
const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  addTransaction,
  viewTransactions,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');


router.get('/', authenticate, viewTransactions);


router.post('/', authenticate, authorize('admin', 'user'), addTransaction);

router.put('/:id', authenticate, authorize('admin', 'user'), updateTransaction);


router.delete('/:id', authenticate, authorize('admin', 'user'), deleteTransaction);

module.exports = router;
