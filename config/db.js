// config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecté');
  } catch (error) {
    console.error('Erreur de connexion à MongoDB', error);
    process.exit(1);
  }
};

module.exports = connectDB;
