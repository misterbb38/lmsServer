// controllers/userController.js

const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
  try {
    const utilisateur = await User.findById(req.user.id).select('-motDePasse');
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { nom, prenom, coordonnees } = req.body;

    let utilisateur = await User.findById(req.user.id);
    if (!utilisateur) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    utilisateur.nom = nom || utilisateur.nom;
    utilisateur.prenom = prenom || utilisateur.prenom;
    utilisateur.coordonnees = coordonnees || utilisateur.coordonnees;

    await utilisateur.save();
    res.json({ message: 'Profil mis à jour', utilisateur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
