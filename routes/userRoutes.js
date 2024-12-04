// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Obtenir le profil de l'utilisateur connecté
router.get('/me', auth, userController.getUserProfile);

// Mettre à jour le profil de l'utilisateur connecté
router.put('/me', auth, userController.updateUserProfile);

module.exports = router;
