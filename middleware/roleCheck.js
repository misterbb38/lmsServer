// middleware/roleCheck.js

module.exports = (role) => (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    next();
  };
  