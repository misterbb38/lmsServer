const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  professeur: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }],
  coursSuivis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  exercicesReussis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }],
  formationReussie: { type: Boolean, default: false },
});

// S'assurer que 'professeur' est toujours un tableau, même vide.

module.exports = mongoose.model('Student', StudentSchema);
