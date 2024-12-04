// routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Obtenir le profil de l'élève
router.get('/me', auth, roleCheck('student'), studentController.getStudentProfile);

module.exports = router;
