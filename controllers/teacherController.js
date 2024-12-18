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

    // Vérifier si l'élève est déjà dans la liste des élèves du professeur
    if (professeur.eleves.includes(eleve._id)) {
      return res.status(400).json({ message: 'Élève déjà accepté' });
    }

    // Ajouter l'élève à la liste des élèves du professeur
    professeur.eleves.push(eleve._id);
    await professeur.save();

    // Associer le professeur à l'élève
    // Dans ce cas, on suppose que l'élève peut être associé à plusieurs professeurs.
    // Si vous souhaitez qu'un élève n'ait qu'un seul professeur, alors vous pouvez 
    // soit remplacer le tableau par un champ unique, soit vérifier la logique ici.
    if (!eleve.professeur.includes(professeur._id)) {
      eleve.professeur.push(professeur._id);
    }

    await eleve.save();

    res.json({ message: 'Élève accepté avec succès' });
  } catch (error) {
    console.error('Erreur lors de l\'acceptation de l\'élève:', error);
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


// Dans teacherController.js

// Dans teacherController.js
exports.getUnassignedStudents = async (req, res) => {
  try {
    const userRole = req.user.role;
    if (userRole !== 'teacher' && userRole !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    // Trouver tous les élèves qui n'ont aucun professeur assigné
    // On utilise $or pour capturer les étudiants dont le champ professeur est soit inexistant, soit vide.
    const students = await Student.find({
      $or: [
        { professeur: { $exists: false } },
        { professeur: { $size: 0 } }
      ]
    }).populate('user', 'nom prenom email');

    res.json(students);
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves non assignés:', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.getTeacherStudents = async (req, res) => {
  try {
    // On suppose que req.user.id est l'ID du user associé au professeur
    const professeur = await Teacher.findOne({ user: req.user.id })
      .populate({
        path: 'eleves',
        populate: {
          path: 'user',
          select: 'nom prenom email' // champs du User à récupérer
        }
      });

    if (!professeur) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    // On a maintenant professeur.eleves : un tableau de Student,
    // chaque Student a un champ user peuplé avec nom/prenom
    const students = professeur.eleves.map((student) => ({
      _id: student._id,           // ID du Student
      nom: student.user.nom,      // Nom de l'élève via user
      prenom: student.user.prenom // Prénom de l'élève via user
      // Vous pouvez ajouter email si besoin : email: student.user.email
    }));

    res.json({ students });
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves du professeur:', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};


