const mongoose = require('mongoose');

const Task = mongoose.model('Aufgabe', {
  bescreibung: {
    type: String,
    required: true,
    trim: true
  },
  fertig: {
    type: Boolean,
    default: false
  }
});

module.exports = Task;
