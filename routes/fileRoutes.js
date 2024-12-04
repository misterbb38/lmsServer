// routes/fileRoutes.js

const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/uploadMiddleware');

// Partager un fichier (Professeur)
router.post(
  '/',
  auth,
  roleCheck('teacher'),
  upload.single('fichier'),
  fileController.uploadFile
);

// Obtenir les fichiers pour l'élève
router.get('/student', auth, roleCheck('student'), fileController.getFilesForStudent);

module.exports = router;
