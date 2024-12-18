// // controllers/authController.js

// const User = require('../models/User');
// const Teacher = require('../models/Teacher');
// const Student = require('../models/Student');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.inscription = async (req, res) => {
//   try {
//     const { nom, prenom, email, motDePasse, role, coordonnees } = req.body;

//     // Vérifier si l'utilisateur existe déjà
//     let utilisateur = await User.findOne({ email });
//     if (utilisateur) {
//       return res.status(400).json({ message: 'Utilisateur déjà existant' });
//     }

//     // Créer un nouvel utilisateur
//     utilisateur = new User({
//       nom,
//       prenom,
//       email,
//       motDePasse,
//       role,
//       coordonnees,
//     });

//     // Hacher le mot de passe
//     const salt = await bcrypt.genSalt(10);
//     utilisateur.motDePasse = await bcrypt.hash(motDePasse, salt);

//     // Enregistrer l'utilisateur
//     await utilisateur.save();

//     // Si le rôle est 'teacher' ou 'student', créer le document associé
//     if (role === 'teacher') {
//       const professeur = new Teacher({ user: utilisateur._id });
//       await professeur.save();
//     } else if (role === 'student') {
//       const eleve = new Student({ user: utilisateur._id });
//       await eleve.save();
//     }

//     // Créer et renvoyer le token JWT
//     const payload = {
//       user: {
//         id: utilisateur._id,
//         role: utilisateur.role,
//       },
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' },
//       (err, token) => {
//         if (err) throw err;
//         res.status(201).json({ token });
//       }
//     );
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur serveur', error });
//   }
// };

// exports.connexion = async (req, res) => {
//   try {
//     const { email, motDePasse } = req.body;

//     // Vérifier si l'utilisateur existe
//     let utilisateur = await User.findOne({ email });
//     if (!utilisateur) {
//       return res.status(400).json({ message: 'Identifiants invalides' });
//     }

//     // Vérifier le mot de passe
//     const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Identifiants invalides' });
//     }

//     // Créer et renvoyer le token JWT
//     const payload = {
//       user: {
//         id: utilisateur._id,
//         role: utilisateur.role,
//       },
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: '7d' },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token });
//       }
//     );
//   } catch (error) {
//     res.status(500).json({ message: 'Erreur serveur', error });
//   }
// };


// controllers/authController.js

const User = require('../models/User');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.inscription = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, role, coordonnees } = req.body;

    // Vérifier si l'utilisateur existe déjà
    let utilisateur = await User.findOne({ email });
    if (utilisateur) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    // Créer un nouvel utilisateur
    utilisateur = new User({
      nom,
      prenom,
      email,
      motDePasse,
      role,
      coordonnees,
    });

    // Hacher le mot de passe
    const salt = await bcrypt.genSalt(10);
    utilisateur.motDePasse = await bcrypt.hash(motDePasse, salt);

    // Enregistrer l'utilisateur
    await utilisateur.save();

    // Si le rôle est 'teacher' ou 'student', créer le document associé
    if (role === 'teacher') {
      const professeur = new Teacher({ user: utilisateur._id });
      await professeur.save();
    } else if (role === 'student') {
      const eleve = new Student({ user: utilisateur._id });
      await eleve.save();
    }

    // Créer le token JWT
    const payload = {
      user: {
        id: utilisateur._id,
        role: utilisateur.role,
      },
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Renvoyer le token et les informations de l'utilisateur
    res.status(201).json({
      token,
      user: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
        coordonnees: utilisateur.coordonnees,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

exports.connexion = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    // Vérifier si l'utilisateur existe
    let utilisateur = await User.findOne({ email });
    if (!utilisateur) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    if (!isMatch) {
      return res.status(400).json({ message: 'Identifiants invalides' });
    }

    // Créer le token JWT
    const payload = {
      user: {
        id: utilisateur._id,
        role: utilisateur.role,
      },
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Renvoyer le token et les informations de l'utilisateur
    res.json({
      token,
      user: {
        id: utilisateur._id,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        role: utilisateur.role,
        coordonnees: utilisateur.coordonnees,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
