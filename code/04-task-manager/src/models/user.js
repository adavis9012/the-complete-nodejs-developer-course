const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Aufgabe = require('../models/aufgabe');

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
      if (value < 0) throw new Error('Alter muss eine positive Nummer sein');
    }
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error('E-mail ist üngultig');
    }
  },
  passwort: {
    type: String,
    minlength: 7,
    required: true,
    trim: true,
    validate(value) {
      if (value.toLowerCase().includes('password')) throw new Error('das Passwort darft "Password" nicht enthalten');
    }
  },
  tokens: [
    {
      token: {
        type: String,
        require: true
      }
    }
  ],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
});

userSchema.statics.findByCredentials = async (email, passwort) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error('Einloggen nich möglich');

  const isMatch = await bcrypt.compare(passwort, user.passwort);

  if (!isMatch) throw new Error('Einloggen nich möglich');

  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

// Anwort blenden diese Informationen aus
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.passwort;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

userSchema.virtual('aufgaben', {
  ref: 'Aufgabe',
  localField: '_id',
  foreignField: 'owner'
});

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('passwort')) {
    user.passwort = await bcrypt.hash(user.passwort, 8);
  }

  next();
});

// Delete user task when user is removed
userSchema.pre('remove', async function (next) {
  const user = this;

  await Aufgabe.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
