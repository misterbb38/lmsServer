// const mongoose = require('mongoose');

// const ExerciseSchema = new mongoose.Schema({
//   titre: { type: String, required: true },
//   description: String,
//   fichierExercice: { type: String, required: true }, // URL sur Cloudinary
//   professeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
//   elevesCibles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
//   reponses: [
//     {
//       eleve: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
//       fichierReponse: String, // URL sur Cloudinary
//       dateSoumission: { type: Date, default: Date.now },
//       corrige: { type: Boolean, default: false },
//       statut: {
//         type: String,
//         enum: ['en attente', 'réussi', 'non réussi'],
//         default: 'en attente',
//       },
//       commentaire: String,
//     },
//   ],
//   dateCreation: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Exercise', ExerciseSchema);


// models/Exercise.js

const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: String,
  options: [String], // Options de réponse pour la question
  bonneReponse: String, // La bonne réponse (pour la correction)
});

const ReponseSchema = new mongoose.Schema({
  eleve: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  fichierReponse: String, // URL du fichier de réponse de l'élève sur Cloudinary
  reponsesQCM: [String], // Réponses aux questions du QCM
  dateSoumission: { type: Date, default: Date.now },
  corrige: { type: Boolean, default: false },
  statut: { type: String, enum: ['en attente', 'réussi', 'non réussi'], default: 'en attente' },
  commentaire: String,
});

const ExerciseSchema = new mongoose.Schema({
  titre: String,
  description: String,
  typeExercice: { type: String, enum: ['fichier', 'qcm'], required: true },
  fichierExercice: String, // URL du fichier de l'exercice sur Cloudinary
  questions: [QuestionSchema], // Questions du QCM
  professeur: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  elevesCibles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  reponses: [ReponseSchema],
  dateCreation: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
