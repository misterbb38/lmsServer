// routes/appointmentRoutes.js

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Créer un rendez-vous (Exclure les étudiants)
router.post(
  '/',  
  auth,
 
  appointmentController.createAppointment
);

// Modifier un rendez-vous (Exclure les étudiants)
router.put(
  '/:appointmentId',
  auth,
  appointmentController.updateAppointment
);

// Supprimer un rendez-vous (Exclure les étudiants)
router.delete(
  '/:appointmentId',
  auth,
 
  appointmentController.deleteAppointment
);

// Obtenir tous les rendez-vous (Accessible à tous les utilisateurs)
router.get(
  '/',
  auth,
  appointmentController.getAllAppointments
);

// Obtenir les rendez-vous par période (Accessible à tous les utilisateurs)
router.get(
  '/periode/:periode',
  auth,
  appointmentController.getAppointmentsByPeriod
);

// Réserver un rendez-vous (Accessible uniquement aux étudiants)
router.post(
  '/book/:appointmentId',
  auth,
  // Exclure les professeurs
  appointmentController.bookAppointment
);

// Annuler une réservation (Accessible uniquement aux étudiants)
router.post(
  '/cancel/:appointmentId',
  auth,
  
  appointmentController.cancelAppointment
);

// Obtenir les rendez-vous de l'élève connecté
router.get(
  '/myAppointments/student',
  auth,
  
  appointmentController.getAppointmentsForStudent
);

// Obtenir les rendez-vous du professeur connecté
router.get(
  '/myAppointments/teacher',
  auth,
  
  appointmentController.getAppointmentsForTeacher
);


module.exports = router;
