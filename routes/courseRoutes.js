const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Créer un cours (professeur)
router.post('/', auth,  courseController.createCourse);

// Obtenir tous les cours (admin ou professeur)
router.get('/', auth, courseController.getAllCourses);

// Obtenir un cours par ID (tous rôles, par exemple)
router.get('/:coursId', auth, courseController.getCourseById);

module.exports = router;
