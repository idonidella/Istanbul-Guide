const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

router.put('/update-name', verifyToken, userController.updateName);

module.exports = router;
