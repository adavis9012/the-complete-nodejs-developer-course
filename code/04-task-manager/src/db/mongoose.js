const mongoose = require('mongoose');

const connectionURL = 'mongodb://127.0.0.1:27017/aufgabe-manager-api';
const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
};

mongoose.connect(connectionURL, options);

