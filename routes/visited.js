const express = require('express');
const router = express.Router();
const visitedController = require('../controllers/visitedController');
const authenticate = require('../middlewares/authMiddleware');

router.get('/', authenticate, visitedController.getVisitedPlaces);

module.exports = router;
