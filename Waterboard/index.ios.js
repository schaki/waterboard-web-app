/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var spark = require('spark');
var _ = require('lodash');
var bluebird = require('bluebird');
var accessToken = '1fe2165bdc3b1ddd2407399c0cf9716a8a3bbec4';
var particle = require('./particle-request.js');
var deviceId = '190025001047343432313031';

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var Waterboard = React.createClass({
  getInitialState: function(){
    return {
      isLoggedIn: false,
      devices: [],
      token: null,
      device: null
    };
  },
  updateDevices: function(devices){
    this.setState({devices: devices});
    if (devices && devices.length === 1){
      this.setState({device: devices[0]});
    }
  },
  getDevices: function(){
    return particle.getDevices().then(this.updateDevices);
  },
  getSoilMoisture: function(){
    return particle.getVariable(deviceId,'moisture');
  },
  getRainStatus: function(){
    return particle.getVariable(deviceId,'wet');
  },
  getWaterLevel: function(){
    return particle.getVariable(deviceId,'waterlevel');
  },
  getPumpStatus: function(){
    return particle.getVariable(deviceId,'pumpstatus');
  },
  getLight: function(){
    return particle.getVariable(deviceId,'light');
  },
  setPump: function(){
    var pumpState = this.state.pumpStatus;
    return particle.executeFunction(deviceId,'pump', pumpState ? "off" : "on");
  },
  getAllValues: function(){
    console.log('getAllValues');
    return bluebird.all([
        this.getSoilMoisture(),
        this.getRainStatus(),
        this.getWaterLevel(),
        this.getPumpStatus(),
        this.getLight()
      ]
    ).bind(this).spread(function(soilMoisture, rainStatus, waterLevel, pumpStatus, lightStatus){
      this.setState({
        soilMoisture: soilMoisture && soilMoisture.result,
        rainStatus: rainStatus && rainStatus.result,
        waterLevel: waterLevel && waterLevel.result,
        pumpStatus: pumpStatus && pumpStatus.result,
        lightStatus: lightStatus && lightStatus.result
      });
    }).catch(function(error){
      console.log('error when retrieving all values: ', error);
    });
  },
  onPressText: function(e){
    return spark.login({accessToken: accessToken})
      // .then(this.getDevices)
      .then(this.getAllValues);
  },
  render: function() {
    var state = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.actionButton} onPress={this.onPressText}>
          Retrieve Status
        </Text>
        <Text style={styles.device} key={deviceId + 'moisture'}>Moisture: {state.soilMoisture}</Text>
        <Text style={styles.device} key={deviceId + 'rain'}>Rain Status: {state.rainStatus}</Text>
        <Text style={styles.device} key={deviceId + 'waterlevel'}>Water Level: {state.waterLevel}</Text>
        <Text style={styles.device} key={deviceId + 'pumpstatus'}>Pump Status: {state.pumpStatus}</Text>
        { (!parseInt(state.rainStatus, 10) && (parseInt(state.soilMoisture, 10) < 1250) && (parseInt(state.waterLevel, 10) > 20)) ?
          <Text style={styles.actionButton} key={deviceId + 'action'} onPress={this.setPump}>Start Pump</Text> :
          <Text style={styles.welcome} key={deviceId + 'action'}>You Can Wait to Water</Text>
        }
        {
          state.pumpStatus ?
          <Text style={styles.actionButton} key={deviceId + 'stop'} onPress={this.setPump}>Stop Pump</Text> : null
        }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  device: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#0097FF'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  actionButton: {
    backgroundColor: '#0097FF',
    fontSize: 20,
    padding: 10,
    borderRadius: 5,
    textAlign: 'center'
  }
});

AppRegistry.registerComponent('Waterboard', () => Waterboard);
