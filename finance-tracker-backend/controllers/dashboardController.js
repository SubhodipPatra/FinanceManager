const { fn, col } = require('sequelize');
const Transaction = require('../models/Transaction');

exports.getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
 
    const monthlySpending = await Transaction.findAll({
      where: { userId, type: 'expense' },
      attributes: [
        [fn('DATE_TRUNC', 'month', col('createdAt')), 'month'],
        [fn('SUM', col('amount')), 'total']
      ],
      group: [fn('DATE_TRUNC', 'month', col('createdAt'))], // Grouping by the expression is safer in Postgres
      order: [[fn('DATE_TRUNC', 'month', col('createdAt')), 'ASC']]
    });

    // 2. Category Breakdown
    const categoryBreakdown = await Transaction.findAll({
      where: { userId, type: 'expense' },
      attributes: ['category', [fn('SUM', col('amount')), 'total']],
      group: ['category']
    });

    // 3. Income vs Expense
    const incomeExpense = await Transaction.findAll({
      where: { userId },
      attributes: ['type', [fn('SUM', col('amount')), 'total']],
      group: ['type']
    });

    const result = {
      monthlySpending: monthlySpending.map(i => ({
        month: i.dataValues.month,
        total: parseFloat(i.dataValues.total) || 0
      })),
      categoryBreakdown: categoryBreakdown.map(i => ({
        category: i.dataValues.category || 'Uncategorized',
        total: parseFloat(i.dataValues.total) || 0
      })),
      incomeExpense: incomeExpense.map(i => ({
        type: i.dataValues.type,
        total: parseFloat(i.dataValues.total) || 0
      }))
    };

    res.json(result);

  } catch (err) {
    console.error('Dashboard Analytics Error:', err.message);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};