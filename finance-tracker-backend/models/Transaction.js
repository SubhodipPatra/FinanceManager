const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User'); // <--- IMPORT USER

const Transaction = sequelize.define('Transaction', {
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING
    }
}, { timestamps: true });

// --- THE CRITICAL ASSOCIATION ---
// This allows the controller to use "include: [User]"
Transaction.belongsTo(User, { foreignKey: 'userId' });

module.exports = Transaction;