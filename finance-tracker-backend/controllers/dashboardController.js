
const { fn, col } = require('sequelize');
const Transaction = require('../models/Transaction');



const dashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const cacheKey = `analytics_${userId}`;


    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log('Serving analytics from cache');
      return res.json(JSON.parse(cachedData));
    }


    const monthlySpending = await Transaction.findAll({
      where: { userId, type: 'expense' },
      attributes: [
        [fn('DATE_TRUNC', 'month', col('createdAt')), 'month'],
        [fn('SUM', col('amount')), 'total']
      ],
      group: ['month'],
      order: [['month', 'ASC']]
    });


    const categoryBreakdown = await Transaction.findAll({
      where: { userId, type: 'expense' },
      attributes: ['category', [fn('SUM', col('amount')), 'total']],
      group: ['category']
    });


    const incomeExpense = await Transaction.findAll({
      where: { userId },
      attributes: ['type', [fn('SUM', col('amount')), 'total']],
      group: ['type']
    });


    const result = {
      monthlySpending: monthlySpending.map(i => ({
        month: i.dataValues.month,
        total: parseFloat(i.dataValues.total)
      })),
      categoryBreakdown: categoryBreakdown.map(i => ({
        category: i.dataValues.category,
        total: parseFloat(i.dataValues.total)
      })),
      incomeExpense: incomeExpense.map(i => ({
        type: i.dataValues.type,
        total: parseFloat(i.dataValues.total)
      }))
    };


    // redisClient.setEx(cacheKey, 600, JSON.stringify(result))
    //   .catch(err => console.warn('Redis cache error:', err.message));


    res.json(result);

  } catch (err) {
    console.error('Dashboard Analytics Error:', err.message);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
};

module.exports = { dashboardAnalytics };
