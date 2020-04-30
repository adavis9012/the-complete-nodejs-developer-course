const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../src/models/user');
const Aufgabe = require('../../src/models/aufgabe');

const userOneID = new mongoose.Types.ObjectId();
const userTwoID = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneID,
    name: 'Mock Name One', email: 'mock@eine.com', passwort: 'MockOnePasswort',
    tokens: [{
        token: jwt.sign({ _id: userOneID }, process.env.JWT_SECRET)
    }]
};
const userTwo = {
    _id: userTwoID,
    name: 'Mock Name Two', email: 'mock@zwei.com', passwort: 'MockZweiPasswort',
    tokens: [{
        token: jwt.sign({ _id: userTwoID }, process.env.JWT_SECRET)
    }]
};
const aufgabeEine = {
    _id: new mongoose.Types.ObjectId(),
    bescreibung: 'Erste Aufgabe',
    fertig: false,
    owner: userOne._id
};
const aufgabeZwei = {
    _id: new mongoose.Types.ObjectId(),
    bescreibung: 'Zweite Aufgabe',
    fertig: false,
    owner: userOne._id
};
const aufgabeDrei = {
    _id: new mongoose.Types.ObjectId(),
    bescreibung: 'Dritte Aufgabe',
    fertig: false,
    owner: userTwo._id
};

const setupDatabase = async () => {
    await User.deleteMany();
    await Aufgabe.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Aufgabe(aufgabeEine).save();
    await new Aufgabe(aufgabeZwei).save();
    await new Aufgabe(aufgabeDrei).save();
}

module.exports = {
    userOne,
    userOneID,
    userTwo,
    userTwoID,
    aufgabeEine,
    aufgabeZwei,
    aufgabeDrei,
    setupDatabase
};