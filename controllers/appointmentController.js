// controllers/appointmentController.js

const Appointment = require('../models/Appointment');

// Ajouter un rendez-vous (Professeur ou Admin)
exports.createAppointment = async (req, res) => {
  try {
    const { date, sujet, periode } = req.body;
    const professeur = req.user.id;

    // Vérifier que tous les champs requis sont présents
    if (!date || !periode) {
      return res.status(400).json({ message: 'Veuillez fournir la date et la période du rendez-vous.' });
    }

    const newAppointment = new Appointment({
      date,
      professeur,
      sujet,
      periode,
      eleve: null, // Rendez-vous disponible, non encore réservé par un élève
    });

    await newAppointment.save();

    res.status(201).json({ message: 'Rendez-vous créé avec succès', appointment: newAppointment });
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    res.status(500).json({ message: 'Erreur lors de la création du rendez-vous', error });
  }
};

// Obtenir tous les rendez-vous (Accessible à tous les utilisateurs)
exports.getAllAppointments = async (req, res) => {
    try {
      const appointments = await Appointment.find()
        .populate('professeur', 'nom prenom')
        .populate('eleve', 'nom prenom')
        .sort({ date: 1 });
  
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous', error });
    }
  };

// Obtenir les rendez-vous réservés par l'élève (Élève)
exports.getAppointmentsForStudent = async (req, res) => {
    try {
      const eleveId = req.user.id;
  
      const appointments = await Appointment.find({ eleve: eleveId })
        .populate('professeur', 'nom prenom')
        .sort({ date: 1 });
  
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous pour l\'élève:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous pour l\'élève', error });
    }
  };

// Obtenir les rendez-vous du professeur (Professeur)
exports.getAppointmentsForTeacher = async (req, res) => {
    try {
      const professeurId = req.user.id;
  
      const appointments = await Appointment.find({ professeur: professeurId })
        .populate('eleve', 'nom prenom')
        .sort({ date: 1 });
  
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous pour le professeur:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous pour le professeur', error });
    }
  };
  
  

// Modifier un rendez-vous (Professeur ou Admin)
exports.updateAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const { date, sujet, periode } = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;
  
      let appointment = await Appointment.findById(appointmentId);
  
      if (!appointment) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }
  
      // Vérifier si l'utilisateur est le propriétaire du rendez-vous ou un admin
      if (userRole === 'teacher' && appointment.professeur.toString() !== userId) {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      if (userRole !== 'teacher' && userRole !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      // Mise à jour des champs
      if (date) appointment.date = date;
      if (sujet) appointment.sujet = sujet;
      if (periode) appointment.periode = periode;
  
      await appointment.save();
  
      res.status(200).json({ message: 'Rendez-vous mis à jour avec succès', appointment });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du rendez-vous', error });
    }
  };

  // Supprimer un rendez-vous (Professeur ou Admin)
exports.deleteAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
  
      const appointment = await Appointment.findById(appointmentId);
  
      if (!appointment) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }
  
      // Vérifier si l'utilisateur est le propriétaire du rendez-vous ou un admin
      if (userRole === 'teacher' && appointment.professeur.toString() !== userId) {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      if (userRole !== 'teacher' && userRole !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      await Appointment.findByIdAndDelete(appointmentId);
  
      res.status(200).json({ message: 'Rendez-vous supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du rendez-vous:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression du rendez-vous', error });
    }
  };
  
// Obtenir les rendez-vous par période (Accessible à tous les utilisateurs)
exports.getAppointmentsByPeriod = async (req, res) => {
    try {
      const { periode } = req.params;
  
      const appointments = await Appointment.find({ periode })
        .populate('professeur', 'nom prenom')
        .populate('eleve', 'nom prenom')
        .sort({ date: 1 });
  
      res.status(200).json(appointments);
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous par période:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous par période', error });
    }
  };

  // Réserver un rendez-vous (Élève)
exports.bookAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const eleveId = req.user.id;
  
      const appointment = await Appointment.findById(appointmentId);
  
      if (!appointment) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }
  
      if (appointment.eleve) {
        return res.status(400).json({ message: 'Rendez-vous déjà réservé' });
      }
  
      appointment.eleve = eleveId;
  
      await appointment.save();
  
      res.status(200).json({ message: 'Rendez-vous réservé avec succès', appointment });
    } catch (error) {
      console.error('Erreur lors de la réservation du rendez-vous:', error);
      res.status(500).json({ message: 'Erreur lors de la réservation du rendez-vous', error });
    }
  };

  // Annuler une réservation (Élève)
exports.cancelAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.params;
      const eleveId = req.user.id;
  
      const appointment = await Appointment.findById(appointmentId);
  
      if (!appointment) {
        return res.status(404).json({ message: 'Rendez-vous non trouvé' });
      }
  
      if (appointment.eleve.toString() !== eleveId) {
        return res.status(403).json({ message: 'Vous ne pouvez pas annuler ce rendez-vous' });
      }
  
      appointment.eleve = null;
  
      await appointment.save();
  
      res.status(200).json({ message: 'Réservation annulée avec succès', appointment });
    } catch (error) {
      console.error('Erreur lors de l\'annulation de la réservation:', error);
      res.status(500).json({ message: 'Erreur lors de l\'annulation de la réservation', error });
    }
  };
  
