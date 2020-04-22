const express = require('express');
const Aufgabe = require('../models/aufgabe')
const router = new express.Router();

router.post('/aufgabe', async (req, res) => {
  const aufgabe = new Aufgabe(req.body);

  try {
    await aufgabe.save();
    res.status(201).send(aufgabe);
  } catch(e) {
    res.status(400).send(e);
  }
});

router.get('/aufgaben', async (req, res) => {
  try {
    const aufgaben = await Aufgabe.find({});

    res.send(aufgaben);
  } catch(e) {
    res.status(500).send(e);
  }
});

router.get('/aufgabe/:id', async (req, res) => {
  const { id } = req.params

  try {
    const aufgabe = await Aufgabe.findById(id);

    if(!aufgabe) return res.status(404).send({error: `ID ${id} nicht gefunded`});

    res.send(aufgabe)
  } catch(e) {
    res.status(500).send(e)
  }
});

router.patch('/aufgabe/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['bescreibung', 'fertig'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    const options = {new: true, runValidators: true};

    if(!isValidOperation) return res.status(400).send({error: 'Ungültige Update-Daten'});

    const aufgabe = await Aufgabe.findByIdAndUpdate(id, req.body, options);

    if (!aufgabe) return res.status(404).send({error: `ID ${id} nicht gefunden`});

    res.send(aufgabe);
  } catch(e) {
    res.status(400).send({error: e});
  }
});

router.delete('/aufgabe/:id', async (req, res) => {
  const { id } = req.params;

  try{
    const ausgabe = await Aufgabe.findByIdAndDelete(id);

    if(!ausgabe) return res.status(404).send({error: `ID ${id} nicht gefunden`});

    res.send(ausgabe);
  } catch(e) {
    res.status(500).send({error: e});
  }
});

module.exports = router;
