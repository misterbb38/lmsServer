// controllers/fileController.js

const File = require('../models/File');

exports.uploadFile = async (req, res) => {
  try {
    const { nom, type, elevesCibles, dossier } = req.body;
    const url = req.file.path; // URL sur Cloudinary

    const fichier = new File({
      nom,
      url,
      type,
      professeur: req.user.id,
      elevesCibles,
      dossier,
    });

    await fichier.save();
    res.status(201).json({ message: 'Fichier partagé avec succès', fichier });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du partage du fichier', error });
  }
};

exports.getFilesForStudent = async (req, res) => {
  try {
    const fichiers = await File.find({ elevesCibles: req.user.id })
      .populate('professeur', 'nom prenom')
      .sort({ datePartage: -1 });

    res.json(fichiers);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
