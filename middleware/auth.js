// middleware/auth.js
// Charger les variables d'environnement
require('dotenv').config();

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Récupérer le token du header
  const token = req.header('x-auth-token');

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({ message: 'Pas de token, autorisation refusée' });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};
