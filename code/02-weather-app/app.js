const request = require('request');
const Geolocation = require('./utils/geolocation.js');
const Weatherstack = require('./utils/weatherstack.js');

const address = process.argv[2];

if (!address) {
  console.log('Bitte geben Sie eine Adresse an');
} else {
  const geolocation = new Geolocation(address);

  geolocation.request((error, response) => {
    if (error) {
      console.log(error);
    } else {
      const [latitude, longitude] = response;
      console.log(response);

      const weatherstack = new Weatherstack(longitude, latitude);

      weatherstack.request((error, response) => {
        console.log(error);
        console.log(response);
      });
  }
});
}

