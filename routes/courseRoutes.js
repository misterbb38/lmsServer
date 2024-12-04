// routes/courseRoutes.js

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Créer un cours
router.post('/', auth, roleCheck('teacher'), courseController.createCourse);

// Ajouter un chapitre
router.post('/chapters', auth, roleCheck('teacher'), courseController.addChapter);

// Ajouter une leçon
router.post('/lessons', auth, roleCheck('teacher'), courseController.addLesson);

// Obtenir un cours par ID
router.get('/:coursId', auth, courseController.getCourseById);

module.exports = router;
