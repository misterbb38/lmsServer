const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  url: { type: String, required: true }, // URL sur Cloudinary
  type: String,
  professeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  elevesCibles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  dossier: String,
  datePartage: { type: Date, default: Date.now },
});

module.exports = mongoose.model('File', FileSchema);
