const Chapter = require('../models/Chapter');
const Lesson = require('../models/Lesson');

exports.addLesson = async (req, res) => {
  try {
    const { titre, contenu, chapitreId } = req.body;

    const chapitre = await Chapter.findById(chapitreId);
    if (!chapitre) {
      return res.status(404).json({ message: 'Chapitre non trouvé' });
    }

    const lecon = new Lesson({
      titre,
      contenu,
      chapitre: chapitreId,
    });

    await lecon.save();

    // Ajouter la leçon au chapitre
    chapitre.lecons.push(lecon._id);
    await chapitre.save();

    return res.status(201).json({ message: 'Leçon ajoutée avec succès', lecon });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de la leçon:', error);
    return res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.getAllLessons = async (req, res) => {
    try {
      // De même, si vous souhaitez récupérer le chapitre associé, vous pouvez ajouter `.populate('chapitre')`
      const lessons = await Lesson.find().populate('chapitre');
  
      return res.status(200).json(lessons);
    } catch (error) {
      console.error('Erreur lors de la récupération des leçons:', error);
      return res.status(500).json({ message: 'Erreur serveur', error });
    }
  };

exports.updateLesson = async (req, res) => {
    try {
      const { lessonId } = req.params;
      const { titre, contenu } = req.body;
  
      const lecon = await Lesson.findById(lessonId);
      if (!lecon) {
        return res.status(404).json({ message: 'Leçon non trouvée' });
      }
  
      // Mettre à jour les champs fournis
      if (titre) lecon.titre = titre;
      if (contenu) lecon.contenu = contenu;
  
      await lecon.save();
  
      return res.status(200).json({ message: 'Leçon mise à jour avec succès', lecon });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la leçon:', error);
      return res.status(500).json({ message: 'Erreur serveur', error });
    }
  };
  
exports.deleteLesson = async (req, res) => {
    try {
      const { lessonId } = req.params;
  
      const lecon = await Lesson.findById(lessonId);
      if (!lecon) {
        return res.status(404).json({ message: 'Leçon non trouvée' });
      }
  
      // Supprimer la référence de la leçon dans le chapitre associé
      const chapitre = await Chapter.findById(lecon.chapitre);
      if (chapitre) {
        chapitre.lecons = chapitre.lecons.filter(lecId => lecId.toString() !== lessonId);
        await chapitre.save();
      }
  
      await Lesson.findByIdAndDelete(lessonId);
  
      return res.status(200).json({ message: 'Leçon supprimée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la leçon:', error);
      return res.status(500).json({ message: 'Erreur serveur', error });
    }
  };