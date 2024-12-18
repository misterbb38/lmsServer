const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Ajouter une leçon à un chapitre (professeur)
router.post('/', auth,  lessonController.addLesson);
// Récupérer toutes les leçons (disponible par exemple aux enseignants et administrateurs)
router.get('/', auth,  lessonController.getAllLessons);
// Mise à jour d'une leçon (Professeur)
router.put('/:lessonId', auth,  lessonController.updateLesson);

// Suppression d'une leçon (Professeur ou admin)
router.delete('/:lessonId', auth,  lessonController.deleteLesson);


module.exports = router;
