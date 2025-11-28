const { Sequelize } = require('sequelize');

// Use DATABASE_URL from env (Vercel injects it automatically)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
});

sequelize.authenticate()
  .then(() => console.log('Neon DB connected'))
  .catch(err => console.error('DB connection error:', err));

module.exports = sequelize;
