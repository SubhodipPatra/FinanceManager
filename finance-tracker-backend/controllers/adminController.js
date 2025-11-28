const User = require('../models/User');
const Transaction = require('../models/Transaction');


// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role'],
    });
    res.json(users);
  } catch (err) {
    console.error('Get Users Error:', err.message);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// UPDATE user role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error('Update Role Error:', err.message);
    res.status(500).json({ message: 'Failed to update user role' });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete all transactions of the user first
    await Transaction.destroy({ where: { userId: id } });

    // Delete the user
    await user.destroy();

    res.json({ message: 'User and all their transactions deleted successfully' });
  } catch (err) {
    console.error('Delete User Error:', err.message);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};



module.exports = { getAllUsers, updateUserRole, deleteUser };
