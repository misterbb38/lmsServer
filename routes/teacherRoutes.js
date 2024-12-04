// routes/teacherRoutes.js

const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Obtenir le profil du professeur
router.get('/me', auth, roleCheck('teacher'), teacherController.getTeacherProfile);

// Accepter un élève
router.post('/accept-student/:studentId', auth, roleCheck('teacher'), teacherController.acceptStudent);

// Programmer un rendez-vous
router.post('/appointments', auth, roleCheck('teacher'), teacherController.scheduleAppointment);

module.exports = router;
