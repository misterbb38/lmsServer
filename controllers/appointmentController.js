// controllers/appointmentController.js
const Appointment = require('../models/Appointment');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student')
const mongoose = require('mongoose');


// exports.createAppointment = async (req, res) => {
//   try {
//     const { date, sujet, periode, eleve } = req.body;
//     const userId = req.user.id;
//     const userRole = req.user.role;

//     if (userRole !== 'teacher' && userRole !== 'admin') {
//       return res.status(403).json({ message: 'Accès refusé' });
//     }

//     const appointment = new Appointment({
//       date,
//       sujet,
//       periode,
//       eleve: eleve.length > 0 ? eleve : null,
//       professeur: userRole === 'teacher' ? userId : null, // Assigner le professeur si l'utilisateur est un enseignant
//     });

//     await appointment.save();

//     // Peupler les champs avant de renvoyer
//     const populatedAppointment = await Appointment.findById(appointment._id)
//       .populate({path:'professeur',
//         populate:{
//           path:'user',
//           select: 'nom prenom'
//         }
//       })
//       .populate({
//         path: 'eleve',
//         populate: {
//           path: 'user',
//           select: 'nom prenom'
//         }
//       });

//     res.status(201).json({ message: 'Rendez-vous créé avec succès', appointment: populatedAppointment });
//   } catch (error) {
//     console.error('Erreur lors de la création du rendez-vous:', error);
//     res.status(500).json({ message: 'Erreur lors de la création du rendez-vous', error });
//   }
// };

// controllers/appointmentController.js

// controllers/appointmentController.js



exports.createAppointment = async (req, res) => {
  try {
    const { date, sujet, periode, eleve } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole !== 'teacher' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    let professeurId = null;

    if (userRole === 'teacher') {
      // Trouver le document Teacher associé à l'utilisateur connecté
      const teacher = await Teacher.findOne({ user: userId });
      if (!teacher) {
        return res.status(404).json({ message: 'Professeur non trouvé pour l\'utilisateur connecté.' });
      }
      professeurId = teacher._id;
    } else if (userRole === 'admin') {
      // Si l'administrateur doit assigner un professeur, vous devez fournir un mécanisme pour le faire.
      // Par exemple, inclure un champ 'professeur' dans le corps de la requête.
      if (!req.body.professeur) {
        return res.status(400).json({ message: 'Le champ professeur est requis pour les administrateurs.' });
      }
      professeurId = req.body.professeur;
      // Vous pouvez ajouter des validations supplémentaires pour vérifier que 'professeurId' est valide.
    }

    const appointment = new Appointment({
      date,
      sujet,
      periode,
      eleve: eleve && eleve.length > 0 ? eleve : null,
      professeur: professeurId, // Assigner le professeur correctement
    });

    await appointment.save();

    // Peupler les champs avant de renvoyer
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: 'professeur',
        populate: {
          path: 'user',
          select: 'nom prenom'
        }
      })
      .populate({
        path: 'eleve',
        populate: {
          path: 'user',
          select: 'nom prenom'
        }
      });

    res.status(201).json({ message: 'Rendez-vous créé avec succès', appointment: populatedAppointment });
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    res.status(500).json({ message: 'Erreur lors de la création du rendez-vous', error });
  }
};


// exports.getAllAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find()
//       // Peupler le professeur avec les champs 'nom' et 'prenom' du User associé
//       .populate({
//         path: 'professeur',
//         populate: {
//           path: 'user',
//           select: 'nom prenom'
//         }
//       })
//       // Peupler les élèves avec les champs 'nom' et 'prenom' du User associé
//       .populate({
//         path: 'eleve',
//         populate: {
//           path: 'user',
//           select: 'nom prenom'
//         }
//       })
//       .sort({ date: 1 });

//     res.status(200).json(appointments);
//   } catch (error) {
//     console.error('Erreur lors de la récupération des rendez-vous:', error);
//     res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous', error });
//   }
// };



exports.getAllAppointments = async (req, res) => {
  try {
    const userId = req.user.id; // ID de l'utilisateur connecté

    // Vérifier si l'utilisateur est un professeur
    const teacher = await Teacher.findOne({ user: new mongoose.Types.ObjectId(userId) });

    if (!teacher) {
      return res.status(403).json({ message: "Vous n'êtes pas autorisé à voir ces rendez-vous." });
    }

    // Rechercher les rendez-vous associés au professeur
    const appointments = await Appointment.find({ professeur: teacher._id })
      .populate({
        path: 'professeur',
        populate: {
          path: 'user',
          select: 'nom prenom'
        }
      })
      .populate({
        path: 'eleve',
        populate: {
          path: 'user',
          select: 'nom prenom'
        }
      })
      .sort({ date: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous', error });
  }
};



exports.getAppointmentsForStudent = async (req, res) => {
  try {
    const userId = req.user.id;

    // Trouver le document Student associé à l'utilisateur connecté
    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé.' });
    }

    const appointments = await Appointment.find({ eleve: student._id })
      .populate({
        path: 'professeur',
        populate: {
          path: 'user',
          select: 'nom prenom'
        }
      })
      .populate({
        path: 'eleve',
        populate: {
          path: 'user',
          select: 'nom prenom'
        }
      })
      .sort({ date: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous pour l\'étudiant:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous', error });
  }
};


// Obtenir les rendez-vous du professeur (Professeur)
// exports.getAppointmentsForTeacher = async (req, res) => {
//     try {
//       const professeurId = req.user.id;
  
//       const appointments = await Appointment.find({ professeur: professeurId })
//         .populate('eleve', 'nom prenom')
//         .sort({ date: 1 });
  
//       res.status(200).json(appointments);
//     } catch (error) {
//       console.error('Erreur lors de la récupération des rendez-vous pour le professeur:', error);
//       res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous pour le professeur', error });
//     }
//   };
  
exports.getAppointmentsForTeacher = async (req, res) => {
  try {
    const userId = req.user.id;

    // Trouver le professeur associé à l'utilisateur connecté
    const teacher = await Teacher.findOne({ user: userId });
    if (!teacher) {
      return res.status(404).json({ message: 'Professeur non trouvé.' });
    }

    // Récupérer les rendez-vous du professeur
    const appointments = await Appointment.find({ professeur: teacher._id })
      .populate({
        path: 'eleve',
        populate: { path: 'user', select: 'nom prenom' },
      })
      .sort({ date: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des rendez-vous pour le professeur :',
      error
    );
    res
      .status(500)
      .json({ message: 'Erreur lors de la récupération des rendez-vous.', error });
  }
};
  

// Modifier un rendez-vous (Professeur ou Admin)
// exports.updateAppointment = async (req, res) => {
//     try {
//       const { appointmentId } = req.params;
//       const { date, sujet, periode } = req.body;
//       const userId = req.user.id;
//       const userRole = req.user.role;
  
//       let appointment = await Appointment.findById(appointmentId);
  
//       if (!appointment) {
//         return res.status(404).json({ message: 'Rendez-vous non trouvé' });
//       }
  
//       // Vérifier si l'utilisateur est le propriétaire du rendez-vous ou un admin
//       if (userRole === 'teacher' && appointment.professeur.toString() !== userId) {
//         return res.status(403).json({ message: 'Accès refusé' });
//       }
  
//       if (userRole !== 'teacher' && userRole !== 'admin') {
//         return res.status(403).json({ message: 'Accès refusé' });
//       }
  
//       // Mise à jour des champs
//       if (date) appointment.date = date;
//       if (sujet) appointment.sujet = sujet;
//       if (periode) appointment.periode = periode;
  
//       await appointment.save();
  
//       res.status(200).json({ message: 'Rendez-vous mis à jour avec succès', appointment });
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour du rendez-vous:', error);
//       res.status(500).json({ message: 'Erreur lors de la mise à jour du rendez-vous', error });
//     }
//   };

// controllers/appointmentController.js

exports.updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { date, sujet, periode, eleve } = req.body; // Inclure 'eleve' dans la mise à jour
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
    if (eleve !== undefined) appointment.eleve = eleve.length > 0 ? eleve : null;

    await appointment.save();

    // Peupler les champs avant de renvoyer
    appointment = await Appointment.findById(appointmentId)
      .populate('professeur', 'nom prenom')
      .populate({
        path: 'eleve',
        populate: {
          path: 'user',
          select: 'nom prenom'
        }
      });

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
// controllers/appointmentController.js

exports.bookAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;

    // Trouver le document Student associé à l'utilisateur connecté
    const student = await Student.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ message: 'Étudiant non trouvé.' });
    }

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    // Si eleve est null, on le transforme en tableau vide
    if (!appointment.eleve) {
      appointment.eleve = [];
    }

    // Vérifier si l'élève a déjà réservé ce rendez-vous
    if (appointment.eleve.includes(student._id)) {
      return res.status(400).json({ message: 'Vous avez déjà réservé ce rendez-vous' });
    }

    appointment.eleve.push(student._id);
    await appointment.save();

    // Peupler les champs avant de renvoyer
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate({
        path: 'professeur',
        populate: {
          path: 'user',
          select: 'nom prenom'
        }
      })
      .populate({
        path: 'eleve',
        populate: {
          path: 'user',
          select: 'nom prenom'
        }
      });

    res.status(200).json({ message: 'Rendez-vous réservé avec succès', appointment: populatedAppointment });
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
  
