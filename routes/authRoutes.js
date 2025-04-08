const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Kayıt route'u
router.post('/signup', authController.register);

// Giriş route'u
router.post('/signin', authController.login);

module.exports = router;