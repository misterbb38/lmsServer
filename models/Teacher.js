const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eleves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  cours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

module.exports = mongoose.model('Teacher', TeacherSchema);
