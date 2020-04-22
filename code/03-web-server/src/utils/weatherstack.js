const request = require('request');

function WeatherStack(longitude, latitude) {
  this.baseURL = 'http://api.weatherstack.com/current';
  this.longitude = encodeURIComponent(longitude);
  this.latitude = encodeURIComponent(latitude);
}

WeatherStack.prototype.request = function (callback) {
  const url =  `${this.baseURL}?access_key=cce8b2275c589ca9031d8dcfecbe926d&query=${this.longitude},${this.latitude}&units=m`;

  request({url, json: true}, (error, response) => {
    if(error) {
      callback('Verbindung zum Weatherstack nich möglich', undefined);
    } else if(response.body.error) {
      callback('Standort konnte nicht gefunden werden', undefined);
    } else {
      const {temperature, feelslike, weather_descriptions: weatherDescriptions} = response.body.current;
      callback(error, {
        weatherDescription: weatherDescriptions[0],
        temperature,
        feelslike,
        fullDescription: `${weatherDescriptions[0]}. Sie liegt derzeit bei ${temperature} Grad. Aber es fühlt sich an wie ${feelslike} Grad.`
      });
  }
 });
}

module.exports = WeatherStack;