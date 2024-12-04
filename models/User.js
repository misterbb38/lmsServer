const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  motDePasse: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    default: 'student',
  },
  coordonnees: {
    adresse: String,
    telephone: String,
  },
  dateInscription: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
