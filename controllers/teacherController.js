// controllers/teacherController.js

const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const User = require('../models/User');

exports.getTeacherProfile = async (req, res) => {
  try {
    const professeur = await Teacher.findOne({ user: req.user.id }).populate('user', '-motDePasse');
    if (!professeur) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }
    res.json(professeur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.acceptStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const professeur = await Teacher.findOne({ user: req.user.id });
    if (!professeur) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    const eleve = await Student.findOne({ user: studentId });
    if (!eleve) {
      return res.status(404).json({ message: 'Élève non trouvé' });
    }

    // Ajouter l'élève à la liste des élèves du professeur
    professeur.eleves.push(eleve._id);
    await professeur.save();

    // Associer le professeur à l'élève
    eleve.professeur = professeur._id;
    await eleve.save();

    res.json({ message: 'Élève accepté avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.scheduleAppointment = async (req, res) => {
  try {
    const { date, eleveId, sujet } = req.body;

    const Appointment = require('../models/Appointment');
    const Student = require('../models/Student');

    const eleve = await Student.findById(eleveId);
    if (!eleve) {
      return res.status(404).json({ message: 'Élève non trouvé' });
    }

    const rendezVous = new Appointment({
      date,
      professeur: req.user.id,
      eleve: eleve.user,
      sujet,
    });

    await rendezVous.save();
    res.status(201).json({ message: 'Rendez-vous programmé avec succès', rendezVous });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
