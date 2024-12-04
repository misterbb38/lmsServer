const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['emploi', 'bourse', 'financement', 'autre'],
    required: true,
  },
  datePublication: { type: Date, default: Date.now },
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin ou Prof
});

module.exports = mongoose.model('Offer', OfferSchema);
