'use strict';

var accessToken = '1fe2165bdc3b1ddd2407399c0cf9716a8a3bbec4';
var baseParticleUrl = 'https://api.particle.io/v1/';

var particleRequest = function particleRequest(endpoint, urlModifiers) {
  var requestUrl = baseParticleUrl + endpoint + '/' + (urlModifiers && urlModifiers.length > 0 ? urlModifiers : '') + '?access_token=' + accessToken;
  return fetch(requestUrl)
    .then((response) => response.text())
    .then((responseText) => {
        return JSON.parse(responseText);
    })
    .catch((error) => {
      console.log('API Call to %s failed: ', endpoint, error);
    });
};

var api = {
  getDevices: function(){
    return particleRequest('devices');
  },
  getVariable: function(deviceId, variable){
    return particleRequest('devices', deviceId + '/' + variable);
  },
  executeFunction: function(deviceId, variable){
    return particleRequest('devices', deviceId + '/' + variable);
  }
};

module.exports = api;
