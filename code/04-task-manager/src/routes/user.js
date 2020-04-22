const express = require('express');
const User = require('../models/user');
const router = new express.Router;

router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send(e)
    }
});

router.get('/user/:id', async (req, res) => {
    const {id} = req.params;

    try {
        const user = await User.findById(id);

        if (!user) return res.status(404).send({error: `ID ${id} nicht gefunden`});

        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.patch('/user/:id', async (req, res) => {
    const allowedUpdates = ['name', 'email', 'passwort', 'alter'];
    const {id} = req.params;
    const options = {
        new: true,
        runValidators: true,
        useFindAndModify: false
    };
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({error: 'Ungültige Update-Daten'});
    }

    try {
        const response = await User.updateOne({_id: id}, req.body, options);

        if (response.n === 0) return res.status(404).send({error: `ID ${id} nicht gefunden`});

        res.send({erflog: `${response.n} Document wurde aktualizert`});
    } catch (e) {
        res.status(400).send({error: e});
    }
});

router.delete('/user/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) return res.status(404).send({error: `ID ${id} nicht gefunden`});

        res.send(user);
    } catch (e) {
        res.status(500).send({error: e});
    }
});

module.exports = router;
