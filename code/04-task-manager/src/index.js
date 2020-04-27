const express = require('express');
require('./db/mongoose');
const userRouter = require('./routes/user');
const aufgabeRouter = require('./routes/aufgabe');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(aufgabeRouter);

app.listen(port, () => {
  console.log(`Server steht auf Port ${port}`);
});
