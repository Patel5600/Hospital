const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public Routes
const { registerValidation, loginValidation, validate } = require('../middleware/validator');

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);

// Private Routes
router.get('/me', protect, getMe);

module.exports = router;
