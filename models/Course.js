const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: String,
  chapitres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }],
  professeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  elevesVises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});

module.exports = mongoose.model('Course', CourseSchema);
