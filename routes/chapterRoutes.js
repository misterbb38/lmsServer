const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Ajouter un chapitre à un cours (professeur)
router.post('/', auth,  chapterController.addChapter);
// Récupérer tous les chapitres (disponible par exemple aux enseignants et administrateurs)
router.get('/', auth, chapterController.getAllChapters);
// Mise à jour d'un chapitre (Professeur)
router.put('/:chapitreId', auth,  chapterController.updateChapter);

// Suppression d'un chapitre (Professeur ou admin)
router.delete('/:chapitreId', auth, chapterController.deleteChapter);


module.exports = router;
