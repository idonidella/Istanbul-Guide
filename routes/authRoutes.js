const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware'); 

router.post('/signup', authController.register);
router.post('/signin', authController.login);
router.post('/signout', verifyToken, authController.signOut);
router.get('/check-session', verifyToken, authController.checkSession);

module.exports = router;
