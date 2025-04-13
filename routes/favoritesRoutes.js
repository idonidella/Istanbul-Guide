const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const verifyToken = require('../middlewares/authMiddleware');

router.post('/toggle', verifyToken, favoritesController.toggleFavorite);
router.get('/check/:placeId', verifyToken, favoritesController.checkFavorite);
router.get('/', verifyToken, favoritesController.getUserFavorites);
router.delete('/:placeId', verifyToken, favoritesController.removeFavorite);

module.exports = router;
