const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/auth.controller');

/**
 * @route   POST /signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', signup);

/**
 * @route   POST /login
 * @desc    Login user and get JWT token
 * @access  Public
 */
router.post('/login', login);

module.exports = router;
