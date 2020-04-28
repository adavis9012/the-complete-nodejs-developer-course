const express = require('express');
const Aufgabe = require('../models/aufgabe')
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/aufgabe', auth, async (req, res) => {
  const aufgabe = new Aufgabe({
    ...req.body,
    owner: req.user.id
  });

  try {
    await aufgabe.save();
    res.status(201).send(aufgabe);
  } catch (e) {
    res.status(400).send({ fehler: e.message });
  }
});

// GET /aufgaben?fertig=true
// GET /aufgaben?limit=10&seite=2
// GET /aufgaben?sortBy=createdAt:asc
router.get('/aufgaben', auth, async (req, res) => {
  let { fertig, limit, seite, sortBy } = req.query;
  let match = {};
  let sort = {};
  let options = {};

  limit = parseInt(limit);
  seite = (parseInt(seite) - 1) * limit;

  if (sortBy) {
    const parts = sortBy.split(':');
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
  }

  if (fertig) {
    match.fertig = fertig === 'true';
  }

  options = {
    limit,
    skip: seite,
    sort
  };

  try {
    await req.user.populate({
      path: 'aufgaben',
      match,
      options
    }).execPopulate();

    res.send(req.user.aufgaben);
  } catch (e) {
    res.status(500).send({ fehler: e.message });
  }
});

router.get('/aufgabe/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    const aufgabe = await Aufgabe.findOne({ _id, owner: req.user.id })

    if (!aufgabe) return res.status(404).send({ error: `ID ${_id} nicht gefunded` });

    res.send(aufgabe)
  } catch (e) {
    res.status(500).send({ fehler: e.message })
  }
});

router.patch('/aufgabe/:id', auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['bescreibung', 'fertig'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send({ error: 'Ungültige Update-Daten' });
  try {
    const aufgabe = await Aufgabe.findOne({ _id, owner: req.user._id });

    if (!aufgabe) return res.status(404).send({ fehler: `ID ${_id} nicht gefunden` });

    updates.forEach(update => aufgabe[update] = req.body[update]);

    await aufgabe.save();

    res.send(aufgabe);
  } catch (e) {
    res.status(400).send({ fehler: e.message });
  }
});

router.delete('/aufgabe/:id', auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const ausgabe = await Aufgabe.findOneAndDelete({ _id, owner: req.user._id });

    if (!ausgabe) return res.status(404).send({ error: `ID ${_id} nicht gefunden` });

    res.send(ausgabe);
  } catch (e) {
    res.status(500).send({ fehler: e.message });
  }
});

module.exports = router;
