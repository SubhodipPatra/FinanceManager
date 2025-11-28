// controllers/transactionController.js
const Transaction = require('../models/Transaction');
const User = require('../models/User'); // <--- 1. Import the User model
const { Op } = require('sequelize');

/**
 * Add Transaction
 * - Roles allowed: user, admin
 */
const addTransaction = async (req, res) => {
  try {
    if (req.user.role === 'read-only') {
      return res.status(403).json({ message: 'Read-only users cannot add transactions' });
    }

    const { type, category, amount, description } = req.body;

    const transaction = await Transaction.create({
      userId: req.user.id,
      type,
      category,
      amount,
      description
    });

    res.status(201).json(transaction);
  } catch (err) {
    console.error('Add Transaction Error:', err.message);
    res.status(500).json({ message: 'Failed to add transaction' });
  }
};

/**
 * View Transactions
 * - Admin sees all, users/read-only see their own
 * - Supports pagination, filtering by type/category
 */
const viewTransactions = async (req, res) => {
  try {
    const { type, category, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.user.role !== 'admin') where.userId = req.user.id;
    if (type) where.type = type;
    if (category) where.category = category;

    const { rows: transactions, count } = await Transaction.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
 
      include: [
        {
          model: User,
          attributes: ['name', 'email'], 
        }
      ]
    });

    res.json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      transactions
    });
  } catch (err) {
    console.error('View Transactions Error:', err.message);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
};


const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    if (req.user.role !== 'admin' && transaction.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Cannot update this transaction' });
    }

    const { type, category, amount, description } = req.body;
    await transaction.update({ type, category, amount, description });

    res.json(transaction);
  } catch (err) {
    console.error('Update Transaction Error:', err.message);
    res.status(500).json({ message: 'Failed to update transaction' });
  }
};


const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    if (req.user.role !== 'admin' && transaction.userId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Cannot delete this transaction' });
    }

    await transaction.destroy();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('Delete Transaction Error:', err.message);
    res.status(500).json({ message: 'Failed to delete transaction' });
  }
};

module.exports = {
  addTransaction,
  viewTransactions,
  updateTransaction,
  deleteTransaction
};