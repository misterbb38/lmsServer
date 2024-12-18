// controllers/studentController.js

const Student = require('../models/Student');
const Course = require('../models/Course');

exports.getStudentProfile = async (req, res) => {
  try {
    const eleve = await Student.findOne({ user: req.user.id })
      .populate('user', '-motDePasse')
      .populate('professeur');
    if (!eleve) {
      return res.status(404).json({ message: 'Élève non trouvé' });
    }
    res.json(eleve);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// controllers/studentController.js


exports.getCoursesForStudent = async (req, res) => {
  try {
    // Trouver l'élève correspondant à l'utilisateur connecté
    const student = await Student.findOne({ user: req.user.id });
    if (!student) {
      return res.status(404).json({ message: "Élève non trouvé" });
    }

    // Trouver tous les cours qui visent cet élève
    const courses = await Course.find({ elevesVises: student._id })
      .populate({
        path: 'chapitres',
        populate: {
          path: 'lecons',
          select: 'titre contenu', // Récupérer uniquement le titre et le contenu des leçons
        },
      })
      .populate('professeur', 'nom prenom email'); // Ajouter des informations sur le professeur

    return res.status(200).json(courses);
  } catch (error) {
    console.error("Erreur lors de la récupération des cours de l'élève:", error);
    return res.status(500).json({ message: 'Erreur serveur', error });
  }
};

