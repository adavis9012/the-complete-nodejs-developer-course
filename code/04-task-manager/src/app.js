const express = require('express');
require('./db/mongoose');
const userRouter = require('./routes/user');
const aufgabeRouter = require('./routes/aufgabe');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(aufgabeRouter);

module.exports = app;
