const mongodb = require('mongodb');
const { MongoClient , ObjectID } = mongodb;

const connectionURL = 'mongodb://127.0.0.1:27017';
const datenbankName = 'aufgaben-manager';
const options = {
  useUnifiedTopology: true
};


MongoClient.connect(connectionURL, options, (error, client) => {
  if(error) console.log('Keine Verbindung zur Datenbank möglich.');

  console.log('Richtig angeschlossen!');

  const db = client.db(datenbankName);

  db.collection('users').deleteMany({
    alter: 29
  }).then(result => console.log(result))
  .catch(error => console.log(error));
});
