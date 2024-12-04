const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  cours: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  lecons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
});

module.exports = mongoose.model('Chapter', ChapterSchema);
