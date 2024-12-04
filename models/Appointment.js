// const mongoose = require('mongoose');

// const AppointmentSchema = new mongoose.Schema({
//   date: { type: Date, required: true },
//   professeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
//   eleve: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
//   sujet: String,
// });

// module.exports = mongoose.model('Appointment', AppointmentSchema);

// models/Appointment.js

const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  professeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  eleve: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: false }, // Peut être null si le rendez-vous n'est pas encore réservé
  sujet: String,
  periode: { type: String, required: true }, // Exemple : "Semaine 1", "Session 1", "Mois 1"
});

module.exports = mongoose.model('Appointment', AppointmentSchema);
