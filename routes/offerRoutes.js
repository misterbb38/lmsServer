// routes/offerRoutes.js

const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Créer une offre (Admin ou Professeur)
router.post('/', auth, roleCheck('teacher'), offerController.createOffer);

// Obtenir les offres pour les élèves ayant réussi la formation
router.get('/', auth, roleCheck('student'), offerController.getOffersForStudents);

module.exports = router;
