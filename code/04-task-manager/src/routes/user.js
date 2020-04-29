const express = require('express');
const User = require('../models/user');
const multer = require('multer');
const sharp = require('sharp');
const { sendWillkommenEmail, sendAbsagenEmail } = require('../emails/account');
const auth = require('../middleware/auth');

const router = new express.Router;
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            cb(new Error('Bitte landen Sie ein gültiges Bild hoch'));
        }

        cb(undefined, true);
    }
});


router.post('/user', async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        sendWillkommenEmail(user.email, user.name);

        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });

    } catch (e) {
        res.status(400).send({ fehler: e.message });
    }

});

router.post('/user/login', async (req, res) => {
    try {
        const { email, passwort } = req.body;
        const user = await User.findByCredentials(email, passwort);
        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch (e) {
        res.status(400).send({ fehler: e.message });
    }
});

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send({ fehler: e.message });
    }
});

router.post('/user/ich/avatar', auth, upload.single('avatar'), async (req, res) => {
    const imgProps = { width: 250, height: 250 };
    const buffer = await sharp(req.file.buffer).resize(imgProps).png().toBuffer();

    req.user.avatar = buffer;

    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ fehler: error.message });
});

router.get('/users', auth, async (req, res) => {
    res.send('Der Dienst Get Users ist deaktiviert');
    // try {
    //     const users = await user.find({});
    //     res.send(users);
    // } catch (e) {
    //     res.status(500).send(e)
    // }
});

router.get('/user/ich', auth, async (req, res) => {
    res.send(req.user);
});

router.get('/user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findById(id);

        if (!user) return res.status(404).send({ error: `ID ${id} nicht gefunden` });

        res.send(user);
    } catch (e) {
        res.status(500).send({ fehler: e.message });
    }
});

router.get('/user/:id/avatar', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        if (!user || !user.avatar) {
            throw new Error(`ID ${id} nicht gefunden`);
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(400).send({ fehler: e.message });
    }
});

router.patch('/user/ich', auth, async (req, res) => {
    const allowedUpdates = ['name', 'email', 'passwort', 'alter'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) return res.status(400).send({ fehler: 'Ungültige Update-Daten' });

    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send({ fehler: e.message });
    }
});

router.delete('/user/ich', auth, async (req, res) => {
    try {
        await req.user.remove();
        sendAbsagenEmail(req.user.email, req.user.name);
        res.send(req.user);
    } catch (e) {
        res.status(500).send({ fehler: e.message });
    }
});

router.delete('/user/ich/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;

    await req.user.save();
    res.send();
});

module.exports = router;
