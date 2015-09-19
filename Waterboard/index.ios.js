/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var spark = require('spark');
var _ = require('lodash');
var accessToken = '1fe2165bdc3b1ddd2407399c0cf9716a8a3bbec4';
var particleRequest = require('./particle-request.js');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var Waterboard = React.createClass({
  updateDevices: function(devices){
    this.setState({devices: devices});
  },
  getInitialState: function(){
    return {
      isLoggedIn: false,
      devices: [],
      token: null
    };
  },
  getDevices: function(){
    return particleRequest.getDevices(this.updateDevices);
  },
  onPressText: function(e){
    var self = this;
    return spark.login({accessToken: accessToken}).then(self.getDevices());
  },
  render: function() {
    var devices = this.state.devices;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome} onPress={this.onPressText}>
          Things!
        </Text>
        { (devices && devices.length > 0)  ?
          _.map(devices, function(device){
            console.log(device);
            return <Text key={device.id}>{device.name}</Text>;
          }) : null }
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('Waterboard', () => Waterboard);
