// config/db.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: console.log, // optional, remove in production
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // important for Neon on Vercel
    },
  },
});

sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
