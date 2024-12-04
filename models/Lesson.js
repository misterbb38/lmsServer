const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  contenu: String,
  chapitre: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter', required: true },
});

module.exports = mongoose.model('Lesson', LessonSchema);
