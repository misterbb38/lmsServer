// controllers/courseController.js

const Course = require('../models/Course');
const Chapter = require('../models/Chapter');
const Lesson = require('../models/Lesson');

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
    res.status(201).json({ message: 'Cours créé avec succès', cours });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.addChapter = async (req, res) => {
  try {
    const { titre, coursId } = req.body;

    const chapitre = new Chapter({
      titre,
      cours: coursId,
    });

    await chapitre.save();

    // Ajouter le chapitre au cours
    const cours = await Course.findById(coursId);
    cours.chapitres.push(chapitre._id);
    await cours.save();

    res.status(201).json({ message: 'Chapitre ajouté avec succès', chapitre });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.addLesson = async (req, res) => {
  try {
    const { titre, contenu, chapitreId } = req.body;

    const lecon = new Lesson({
      titre,
      contenu,
      chapitre: chapitreId,
    });

    await lecon.save();

    // Ajouter la leçon au chapitre
    const chapitre = await Chapter.findById(chapitreId);
    chapitre.lecons.push(lecon._id);
    await chapitre.save();

    res.status(201).json({ message: 'Leçon ajoutée avec succès', lecon });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
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

    res.json(cours);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
