const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  alter: {
    type: Number,
    default: 0,
    validate(value) {
      if(value < 0) throw new Error('Alter muss eine positive Nummer sein');
    }
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
    validate(value) {
      if(!validator.isEmail(value)) throw new Error('E-mail ist üngultig');
    }
  },
  passwort: {
    type: String,
    minlength: 7,
    required: true,
    trim: true,
    validate(value) {
      if(value.toLowerCase().includes('password')) throw new Error('das Passwort darft "Password" nicht enthalten');
    }
  }
});

userSchema.pre('save', async function (next) {
  const user = this;
  console.log('Kurz vor dem Speichern');

  if(user.isModified('passwort')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.pre('updateOne', async function (next) {
  const user = this;

  if(user.isModified('passwort')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
