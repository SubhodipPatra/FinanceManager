const { Sequelize } = require('sequelize');

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgres://postgres:password@localhost:5432/finance_db'; // local fallback

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
