// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Inscription
router.post('/inscription', authController.inscription);

// Connexion
router.post('/connexion', authController.connexion);

module.exports = router;
