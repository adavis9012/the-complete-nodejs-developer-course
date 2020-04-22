const request = require('request');

function Geolocation (address) {
  this.encodedAddress = encodeURIComponent(address);
}

Geolocation.prototype.request = function (callback) {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${this.encodedAddress}.json?access_token=pk.eyJ1IjoiYW5kcmVzdmVsYW5kaWEiLCJhIjoiY2s5M2g4MWczMDIzeTNpbjFmeW0yZjBsbyJ9.tcO8Mz-nPjT6_wej0TMixA&limit=1'`;

  request({url, json: true}, (error, response) => {
    if(error) {
      callback('Verbindung zum Geolocation nich möglich', undefined);
    } else if(response.body.features.length === 0) {
      callback('Standort konnte nicht gefunden werden. Versuchen Sie eine andere Suche.', undefined);
    } else {
      const [longitude, latitude] = response.body.features[0].center;
      callback(undefined, [longitude, latitude]);
    }
  });
}

module.exports = Geolocation;

