const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eleves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  cours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }] // Ajout du champ appointments
});

module.exports = mongoose.model('Teacher', TeacherSchema);
