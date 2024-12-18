const Course = require('../models/Course');
const Chapter = require('../models/Chapter');

exports.addChapter = async (req, res) => {
  try {
    const { titre, coursId } = req.body;

    const cours = await Course.findById(coursId);
    if (!cours) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    const chapitre = new Chapter({
      titre,
      cours: coursId,
    });

    await chapitre.save();

    // Ajouter le chapitre au cours
    cours.chapitres.push(chapitre._id);
    await cours.save();

    return res.status(201).json({ message: 'Chapitre ajouté avec succès', chapitre });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du chapitre:', error);
    return res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.getAllChapters = async (req, res) => {
    try {
      // Si vous souhaitez peupler avec le cours ou les leçons, vous pouvez ajouter `.populate('cours')` ou `.populate('lecons')`
      const chapters = await Chapter.find().populate('cours').populate('lecons');
  
      return res.status(200).json(chapters);
    } catch (error) {
      console.error('Erreur lors de la récupération des chapitres:', error);
      return res.status(500).json({ message: 'Erreur serveur', error });
    }
  };

exports.updateChapter = async (req, res) => {
    try {
      const { chapitreId } = req.params;
      const { titre } = req.body;
  
      const chapitre = await Chapter.findById(chapitreId);
      if (!chapitre) {
        return res.status(404).json({ message: 'Chapitre non trouvé' });
      }
  
      // Mettre à jour le titre du chapitre
      if (titre) chapitre.titre = titre;
  
      await chapitre.save();
  
      return res.status(200).json({ message: 'Chapitre mis à jour avec succès', chapitre });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du chapitre:', error);
      return res.status(500).json({ message: 'Erreur serveur', error });
    }
  };
  
exports.deleteChapter = async (req, res) => {
    try {
      const { chapitreId } = req.params;
  
      const chapitre = await Chapter.findById(chapitreId);
      if (!chapitre) {
        return res.status(404).json({ message: 'Chapitre non trouvé' });
      }
  
      // Supprimer la référence du chapitre dans le cours associé
      const cours = await Course.findById(chapitre.cours);
      if (cours) {
        cours.chapitres = cours.chapitres.filter(chId => chId.toString() !== chapitreId);
        await cours.save();
      }
  
      await Chapter.findByIdAndDelete(chapitreId);
  
      return res.status(200).json({ message: 'Chapitre supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression du chapitre:', error);
      return res.status(500).json({ message: 'Erreur serveur', error });
    }
  };
