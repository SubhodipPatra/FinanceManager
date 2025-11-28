const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getAllUsers, updateUserRole, deleteUser } = require('../controllers/adminController');


router.get('/users', authenticate, authorize('admin'), getAllUsers);
router.put('/users/:id', authenticate, authorize('admin'), updateUserRole);
router.delete('/users/:id', authenticate, authorize('admin'), deleteUser);

module.exports = router;
