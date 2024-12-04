// controllers/exerciseController.js

const Exercise = require('../models/Exercise');

// exports.createExercise = async (req, res) => {
//   try {
//     const { titre, description, elevesCibles } = req.body;
//     const fichierExercice = req.file.path; // URL sur Cloudinary

//     const exercice = new Exercise({
//       titre,
//       description,
//       fichierExercice,
//       professeur: req.user.id,
//       elevesCibles,
//     });

//     await exercice.save();
//     res.status(201).json({ message: 'Exercice créé avec succès', exercice });
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur lors de la création de l\'exercice', error });
//   }
// };

// controllers/exerciseController.js

// exports.createExercise = async (req, res) => {
//     try {
//       const { titre, description } = req.body;
//       const fichierExercice = req.file.path; // URL sur Cloudinary
  
//       // Gestion de elevesCibles
//       let elevesCibles = req.body.elevesCibles;
  
//       if (!elevesCibles) {
//         return res.status(400).json({ message: 'Veuillez fournir les élèves cibles.' });
//       }
  
//       // Si elevesCibles n'est pas un tableau, le convertir en tableau
//       if (!Array.isArray(elevesCibles)) {
//         elevesCibles = [elevesCibles];
//       }
  
//       // Vérifier que chaque élément est une chaîne non vide
//       elevesCibles = elevesCibles.filter(id => id && id.trim());
  
//       const exercice = new Exercise({
//         titre,
//         description,
//         fichierExercice,
//         professeur: req.user.id,
//         elevesCibles,
//       });
  
//       await exercice.save();
//       res.status(201).json({ message: 'Exercice créé avec succès', exercice });
//     } catch (error) {
//       console.error('Erreur lors de la création de l\'exercice:', error);
//       res.status(500).json({ message: "Erreur lors de la création de l'exercice", error });
//     }
//   };
  
exports.createExercise = async (req, res) => {
    try {
      const { titre, description, typeExercice } = req.body;
      const professeur = req.user.id;
  
      // Gestion de elevesCibles
      let elevesCibles = req.body.elevesCibles;
  
      if (!elevesCibles) {
        return res.status(400).json({ message: 'Veuillez fournir les élèves cibles.' });
      }
  
      // Si elevesCibles n'est pas un tableau, le convertir en tableau
      if (!Array.isArray(elevesCibles)) {
        elevesCibles = [elevesCibles];
      }
  
      // Vérifier que chaque élément est une chaîne non vide
      elevesCibles = elevesCibles.filter(id => id && id.trim());
  
      let exerciceData = {
        titre,
        description,
        typeExercice,
        professeur,
        elevesCibles,
      };
  
      if (typeExercice === 'fichier') {
        // Vérifier que le fichier est présent
        if (!req.file) {
          return res.status(400).json({ message: 'Veuillez fournir le fichier de l\'exercice.' });
        }
        exerciceData.fichierExercice = req.file.path; // URL sur Cloudinary
      } else if (typeExercice === 'qcm') {
        // Récupérer les questions du QCM
        let questions = req.body.questions;
  
        if (!questions) {
          return res.status(400).json({ message: 'Veuillez fournir les questions du QCM.' });
        }
  
        // Si questions est une chaîne (JSON), le parser
        if (typeof questions === 'string') {
          questions = JSON.parse(questions);
        }
  
        exerciceData.questions = questions;
      } else {
        return res.status(400).json({ message: 'Type d\'exercice invalide.' });
      }
  
      const exercice = new Exercise(exerciceData);
  
      await exercice.save();
      res.status(201).json({ message: 'Exercice créé avec succès', exercice });
    } catch (error) {
      console.error('Erreur lors de la création de l\'exercice:', error);
      res.status(500).json({ message: "Erreur lors de la création de l'exercice", error });
    }
  };


// exports.submitResponse = async (req, res) => {
//   try {
//     const { exerciceId } = req.params;
//     const fichierReponse = req.file.path; // URL sur Cloudinary

//     const exercice = await Exercise.findById(exerciceId);

//     if (!exercice) {
//       return res.status(404).json({ message: 'Exercice non trouvé' });
//     }

//     // Vérifier si l'élève est autorisé
//     if (!exercice.elevesCibles.includes(req.user.id)) {
//       return res.status(403).json({ message: 'Accès refusé' });
//     }

//     // Vérifier si une réponse existe déjà
//     const reponseExistante = exercice.reponses.find(
//       (rep) => rep.eleve.toString() === req.user.id
//     );

//     if (reponseExistante) {
//       return res.status(400).json({ message: 'Vous avez déjà soumis une réponse' });
//     }

//     // Ajouter la réponse
//     exercice.reponses.push({
//       eleve: req.user.id,
//       fichierReponse,
//     });

//     await exercice.save();
//     res.status(200).json({ message: 'Réponse soumise avec succès' });
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur lors de la soumission de la réponse', error });
//   }
// };

exports.submitResponse = async (req, res) => {
    try {
      const { exerciceId } = req.params;
  
      const exercice = await Exercise.findById(exerciceId);
  
      if (!exercice) {
        return res.status(404).json({ message: 'Exercice non trouvé' });
      }
  
      // Vérifier si l'élève est autorisé
      if (!exercice.elevesCibles.includes(req.user.id)) {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      // Vérifier si une réponse existe déjà
      const reponseExistante = exercice.reponses.find(
        (rep) => rep.eleve.toString() === req.user.id
      );
  
      if (reponseExistante) {
        return res.status(400).json({ message: 'Vous avez déjà soumis une réponse' });
      }
  
      let nouvelleReponse = {
        eleve: req.user.id,
      };
  
      if (exercice.typeExercice === 'fichier') {
        // Vérifier que le fichier de réponse est présent
        if (!req.file) {
          return res.status(400).json({ message: 'Veuillez fournir le fichier de réponse.' });
        }
        nouvelleReponse.fichierReponse = req.file.path; // URL sur Cloudinary
      } else if (exercice.typeExercice === 'qcm') {
        // Récupérer les réponses du QCM
        let reponsesQCM = req.body.reponsesQCM;
  
        if (!reponsesQCM) {
          return res.status(400).json({ message: 'Veuillez fournir vos réponses au QCM.' });
        }
  
        // Si reponsesQCM est une chaîne (JSON), le parser
        if (typeof reponsesQCM === 'string') {
          reponsesQCM = JSON.parse(reponsesQCM);
        }
  
        nouvelleReponse.reponsesQCM = reponsesQCM;
      } else {
        return res.status(400).json({ message: 'Type d\'exercice invalide.' });
      }
  
      // Ajouter la réponse
      exercice.reponses.push(nouvelleReponse);
  
      await exercice.save();
      res.status(200).json({ message: 'Réponse soumise avec succès' });
    } catch (error) {
      console.error('Erreur lors de la soumission de la réponse:', error);
      res.status(500).json({ message: 'Erreur lors de la soumission de la réponse', error });
    }
  };
  
// exports.correctExercise = async (req, res) => {
//   try {
//     const { exerciceId, eleveId } = req.params;
//     const { statut, commentaire } = req.body;

//     const exercice = await Exercise.findById(exerciceId);

//     if (!exercice) {
//       return res.status(404).json({ message: 'Exercice non trouvé' });
//     }

//     const reponse = exercice.reponses.find(
//       (rep) => rep.eleve.toString() === eleveId
//     );

//     if (!reponse) {
//       return res.status(404).json({ message: 'Réponse non trouvée' });
//     }

//     reponse.statut = statut; // 'réussi' ou 'non réussi'
//     reponse.commentaire = commentaire;
//     reponse.corrige = true;

//     // Si l'exercice est réussi, l'ajouter à la liste des exercices réussis de l'élève
//     if (statut === 'réussi') {
//       const Student = require('../models/Student');
//       const eleve = await Student.findOne({ user: eleveId });
//       if (eleve && !eleve.exercicesReussis.includes(exerciceId)) {
//         eleve.exercicesReussis.push(exerciceId);
//         await eleve.save();
//       }
//     }

//     await exercice.save();
//     res.status(200).json({ message: 'Exercice corrigé avec succès' });
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur lors de la correction de l\'exercice', error });
//   }
// };


exports.correctExercise = async (req, res) => {
    try {
      const { exerciceId, eleveId } = req.params;
  
      const exercice = await Exercise.findById(exerciceId);
  
      if (!exercice) {
        return res.status(404).json({ message: 'Exercice non trouvé' });
      }
  
      const reponse = exercice.reponses.find(
        (rep) => rep.eleve.toString() === eleveId
      );
  
      if (!reponse) {
        return res.status(404).json({ message: 'Réponse non trouvée' });
      }
  
      if (exercice.typeExercice === 'qcm') {
        // Correction automatique du QCM
        const bonnesReponses = exercice.questions.map(q => q.bonneReponse);
        const reponsesEleve = reponse.reponsesQCM;
  
        // Comparer les réponses
        let score = 0;
        for (let i = 0; i < bonnesReponses.length; i++) {
          if (bonnesReponses[i] === reponsesEleve[i]) {
            score++;
          }
        }
  
        const pourcentage = (score / bonnesReponses.length) * 100;
  
        // Définir le seuil de réussite (par exemple, 70%)
        const seuilReussite = 70;
  
        if (pourcentage >= seuilReussite) {
          reponse.statut = 'réussi';
        } else {
          reponse.statut = 'non réussi';
        }
  
        reponse.commentaire = `Score: ${pourcentage}%`;
        reponse.corrige = true;
      } else {
        // Exercice de type fichier, le professeur fournit le statut et le commentaire
        const { statut, commentaire } = req.body;
  
        reponse.statut = statut; // 'réussi' ou 'non réussi'
        reponse.commentaire = commentaire;
        reponse.corrige = true;
      }
  
      // Mettre à jour les exercices réussis de l'élève si nécessaire
      if (reponse.statut === 'réussi') {
        const Student = require('../models/Student');
        const eleve = await Student.findOne({ user: eleveId });
        if (eleve && !eleve.exercicesReussis.includes(exerciceId)) {
          eleve.exercicesReussis.push(exerciceId);
          await eleve.save();
        }
      }
  
      await exercice.save();
      res.status(200).json({ message: 'Exercice corrigé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la correction de l\'exercice:', error);
      res.status(500).json({ message: 'Erreur lors de la correction de l\'exercice', error });
    }
  };


  // controllers/exerciseController.js

exports.getAllExercises = async (req, res) => {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
  
      let exercises;
  
      if (userRole === 'teacher') {
        // Obtenir tous les exercices créés par ce professeur
        exercises = await Exercise.find({ professeur: userId });
      } else if (userRole === 'student') {
        // Obtenir tous les exercices assignés à cet élève
        exercises = await Exercise.find({ elevesCibles: userId });
      } else if (userRole === 'admin') {
        // Obtenir tous les exercices
        exercises = await Exercise.find();
      } else {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      res.status(200).json(exercises);
    } catch (error) {
      console.error('Erreur lors de la récupération des exercices:', error);
      res.status(500).json({ message: 'Erreur lors de la récupération des exercices', error });
    }
  };

  exports.updateExercise = async (req, res) => {
    try {
      const { exerciceId } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
  
      let exercice = await Exercise.findById(exerciceId);
  
      if (!exercice) {
        return res.status(404).json({ message: 'Exercice non trouvé' });
      }
  
      // Vérifier si l'utilisateur est le propriétaire ou un admin
      if (userRole === 'teacher' && exercice.professeur.toString() !== userId) {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      if (userRole !== 'teacher' && userRole !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      // Mise à jour des champs
      const { titre, description, elevesCibles } = req.body;
  
      if (titre) exercice.titre = titre;
      if (description) exercice.description = description;
  
      // Gestion de elevesCibles
      if (elevesCibles) {
        let eleves = elevesCibles;
        if (!Array.isArray(eleves)) {
          eleves = [eleves];
        }
        exercice.elevesCibles = eleves;
      }
  
      // Gestion du typeExercice
      if (exercice.typeExercice === 'fichier') {
        if (req.file) {
          // Un nouveau fichier a été téléchargé
          exercice.fichierExercice = req.file.path; // URL sur Cloudinary
        }
      } else if (exercice.typeExercice === 'qcm') {
        let questions = req.body.questions;
  
        if (questions) {
          if (typeof questions === 'string') {
            questions = JSON.parse(questions);
          }
          exercice.questions = questions;
        }
      }
  
      await exercice.save();
  
      res.status(200).json({ message: 'Exercice mis à jour avec succès', exercice });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'exercice:', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'exercice', error });
    }
  };

  
  exports.deleteExercise = async (req, res) => {
    try {
      const { exerciceId } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;
  
      const exercice = await Exercise.findById(exerciceId);
  
      if (!exercice) {
        return res.status(404).json({ message: 'Exercice non trouvé' });
      }
  
      // Vérifier si l'utilisateur est le propriétaire ou un admin
      if (userRole === 'teacher' && exercice.professeur.toString() !== userId) {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      if (userRole !== 'teacher' && userRole !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      await Exercise.findByIdAndDelete(exerciceId);
  
      res.status(200).json({ message: 'Exercice supprimé avec succès' });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'exercice:', error);
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'exercice', error });
    }
  };
  
  