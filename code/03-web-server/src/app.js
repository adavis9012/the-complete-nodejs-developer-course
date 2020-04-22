const path = require('path');
const express = require('express');
const hbs = require('hbs');
const Geocode = require('./utils/geolocation');
const WeatherStack = require('./utils/weatherstack');
const port = process.env.PORT || 3000;

const app = express();

// Define Paths for express config
const publicPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates');
const partialsPath = path.join(__dirname, '../templates/partials');


// Setup handlebars engine and views locations
app.set('view engine', 'hbs');
app.set('views', viewPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Wetter App',
    name: 'David Velandia'
  });
});

app.get('/uber', (req, res) => {
  res.render('uber', {
    title: 'Über-Seite',
    name: 'David Velandia'
  });
});

app.get('/hilfe', (req, res) => {
  res.render('index', {
    title: 'Hilfe-Seite',
    name: 'David Velandia'
  });
});

app.get('/wetter', (req, res) => {
  if(!req.query.adressbegriff) {
    return res.send({
      fehler: 'Sie müssen einen Adressbegriff angeben'
    })
  }
  const {adressbegriff} = req.query;
  const geocode = new Geocode(adressbegriff);

  geocode.request((error, response) => {
    if(error) return res.send({fehler: error});

    const {latitude, longitude, placeName} = response;
    const weatherStack = new WeatherStack(longitude, latitude);

    weatherStack.request((error, response) => {
      if(error) return res.send({fehler: error});

     const {weatherDescription, temperature, feelslike, fullDescription} = response;

      res.send({
        beschreibung: weatherDescription,
        standort: placeName,
        temperatur: temperature,
        termische_empfindung: feelslike,
        vollstandige_beschreibung: fullDescription
      })
    });
  });
});

app.get('/producte', (req, res) => {
  if (!req.query.suchbegriff) {
    return res.send({
      fehler: 'Sie müssen einen Suchbegriff eingeben'
    });
  }

  const {query} = req.query;

  res.send({
    producte: []
  });
});

app.get('/hilfe/*', (req, res) => {
  res.render('404', {
    title: 'Hilfe 404',
    name: 'David Velandia',
    errorMessage: 'Hilfe, Artikel nich gefunden'
  })
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'David Velandia',
    errorMessage: 'Seite nich gefunden'
  })
});

app.listen(port, () => {
  console.log(`Server steht auf Port ${port}`);
});
