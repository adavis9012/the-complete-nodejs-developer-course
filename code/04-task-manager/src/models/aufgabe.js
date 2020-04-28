const mongoose = require('mongoose');

const aufgabeSchema = mongoose.Schema({
  bescreibung: {
    type: String,
    required: true,
    trim: true
  },
  fertig: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Aufgabe = mongoose.model('Aufgabe', aufgabeSchema );

module.exports = Aufgabe;
