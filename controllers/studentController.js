// controllers/studentController.js

const Student = require('../models/Student');

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
