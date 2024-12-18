
const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const { titre, description, elevesVises } = req.body;

    const cours = new Course({
      titre,
      description,
      professeur: req.user.id,
      elevesVises,
    });

    await cours.save();
    return res.status(201).json({ message: 'Cours créé avec succès', cours });
  } catch (error) {
    console.error('Erreur lors de la création du cours:', error);
    return res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('chapitres')
      .populate('professeur', '-motDePasse');

    return res.status(200).json(courses);
  } catch (error) {
    console.error('Erreur lors de la récupération des cours:', error);
    return res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const { coursId } = req.params;

    const cours = await Course.findById(coursId)
      .populate('chapitres')
      .populate('professeur', '-motDePasse');

    if (!cours) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    return res.status(200).json(cours);
  } catch (error) {
    console.error('Erreur lors de la récupération du cours par ID:', error);
    return res.status(500).json({ message: 'Erreur serveur', error });
  }
};
