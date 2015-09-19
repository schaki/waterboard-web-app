'use strict';

var accessToken = '1fe2165bdc3b1ddd2407399c0cf9716a8a3bbec4';
var baseParticleUrl = 'https://api.particle.io/v1/';

var particleRequest = function particleRequest(endpoint, handler, urlModifiers) {
  return fetch(baseParticleUrl + endpoint + (urlModifiers && urlModifiers.length > 0 ? urlModifiers : '') + '?access_token=' + accessToken)
    .then((response) => response.text())
    .then((responseText) => {
      handler(JSON.parse(responseText));
    })
    .catch((error) => {
      console.log('API Call to %s failed: ', endpoint, error);
    });
};

var api = {
  getDevices: function(responseHandler){
    return particleRequest('devices', responseHandler);
  },
  getVariable: function(deviceId, variable, responseHandler){
    return particleRequest('devices', responseHandler, deviceId + '/' + variable);
  },
  executeFunction: function(deviceId, variable, responseHandler){
    return particleRequest('devices', responseHandler, deviceId + '/' + variable);
  }
};

module.exports = api;
