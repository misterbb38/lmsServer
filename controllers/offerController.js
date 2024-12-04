// controllers/offerController.js

const Offer = require('../models/Offer');

exports.createOffer = async (req, res) => {
  try {
    const { titre, description, type } = req.body;

    const offre = new Offer({
      titre,
      description,
      type,
      auteur: req.user.id,
    });

    await offre.save();
    res.status(201).json({ message: 'Offre créée avec succès', offre });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'offre', error });
  }
};

exports.getOffersForStudents = async (req, res) => {
  try {
    const Student = require('../models/Student');
    const eleve = await Student.findOne({ user: req.user.id });

    if (!eleve || !eleve.formationReussie) {
      return res.status(403).json({ message: 'Accès refusé aux offres' });
    }

    const offres = await Offer.find().sort({ datePublication: -1 });
    res.json(offres);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
