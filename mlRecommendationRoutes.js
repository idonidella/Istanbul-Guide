const express = require('express');
const router = express.Router();
const mlRecommendationController = require('../controllers/mlRecommendationController');
const verifyToken = require('../middlewares/authMiddleware');

router.get('/', verifyToken, mlRecommendationController.getMLRecommendations);

module.exports = router;