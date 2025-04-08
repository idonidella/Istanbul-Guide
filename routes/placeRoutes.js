// routes/placeRoutes.js
const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');

const verifyToken = require('../middlewares/authMiddleware');

router.get('/qr', verifyToken, placeController.getPlaceByQrCode);

module.exports = router;
