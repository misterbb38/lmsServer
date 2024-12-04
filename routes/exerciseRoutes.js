// // // routes/exerciseRoutes.js

// // const express = require('express');
// // const router = express.Router();
// // const exerciseController = require('../controllers/exerciseController');
// // const auth = require('../middleware/auth');
// // const roleCheck = require('../middleware/roleCheck');
// // const upload = require('../middleware/uploadMiddleware');

// // // Créer un exercice (Professeur)
// // router.post(
// //   '/',
// //   auth,
// //   roleCheck('teacher'),
// //   upload.single('fichierExercice'),
// //   exerciseController.createExercise
// // );

// // // Soumettre une réponse (Élève)
// // router.post(
// //   '/:exerciceId/submit',
// //   auth,
// //   roleCheck('student'),
// //   upload.single('fichierReponse'),
// //   exerciseController.submitResponse
// // );

// // // Corriger une réponse (Professeur)
// // router.post(
// //   '/:exerciceId/correct/:eleveId',
// //   auth,
// //   roleCheck('teacher'),
// //   exerciseController.correctExercise
// // );

// // module.exports = router;


// // routes/exerciseRoutes.js

// const express = require('express');
// const router = express.Router();
// const exerciseController = require('../controllers/exerciseController');
// const auth = require('../middleware/auth');
// const roleCheck = require('../middleware/roleCheck');
// const upload = require('../middleware/uploadMiddleware');

// // Créer un exercice (Professeur)
// router.post(
//   '/',
//   auth,
//   roleCheck('teacher'),
//   upload.single('fichierExercice'), // Le fichier est facultatif pour les QCM
//   exerciseController.createExercise
// );

// // Soumettre une réponse (Élève)
// router.post(
//   '/:exerciceId/submit',
//   auth,
//   roleCheck('student'),
//   upload.single('fichierReponse'), // Le fichier est facultatif pour les QCM
//   exerciseController.submitResponse
// );

// // Corriger une réponse (Professeur)
// router.post(
//   '/:exerciceId/correct/:eleveId',
//   auth,
//   roleCheck('teacher'),
//   exerciseController.correctExercise
// );

// module.exports = router;


// routes/exerciseRoutes.js

const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const upload = require('../middleware/uploadMiddleware');

// Créer un exercice (Professeur)
router.post(
  '/',
  auth,
  roleCheck('teacher'),
  upload.single('fichierExercice'),
  exerciseController.createExercise
);

// Obtenir tous les exercices
router.get(
  '/',
  auth,
  exerciseController.getAllExercises
);

// Mettre à jour un exercice (Professeur)
router.put(
  '/:exerciceId',
  auth,
  roleCheck('teacher'),
  upload.single('fichierExercice'),
  exerciseController.updateExercise
);

// Supprimer un exercice (Professeur ou Admin)
router.delete(
  '/:exerciceId',
  auth,
  roleCheck(['teacher', 'admin']),
  exerciseController.deleteExercise
);

// Soumettre une réponse (Élève)
router.post(
  '/:exerciceId/submit',
  auth,
  roleCheck('student'),
  upload.single('fichierReponse'),
  exerciseController.submitResponse
);

// Corriger une réponse (Professeur)
router.post(
  '/:exerciceId/correct/:eleveId',
  auth,
  roleCheck('teacher'),
  exerciseController.correctExercise
);

module.exports = router;
