/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var spark = require('spark');


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
      devices: []
    };
  },
  getDevices: function(){
    var devicesPr = spark.getAttributesForAll();
    var self = this;
    
    devicesPr.then(
      function(data){
        self.setState({ devices: data});
        console.log('Device attrs retrieved successfully:', data);
      },
      function(err) {
        console.log('API call failed: ', err);
      }
    );
  },
  onPressText: function(e){
    var self = this;
    spark.login({accessToken: '1fe2165bdc3b1ddd2407399c0cf9716a8a3bbec4'}).then(
      function(token){
        console.log('API call completed on promise resolve: ', token);
        self.setState({isLoggedIn: true});
        self.getDevices();
      },
      function(err){
        console.log('API call completed on promise fail: ', err);
      }
    );
  },
  render: function() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome} onPress={this.onPressText}>
          Things!
        </Text>
        <Text>
          { this.state.isLoggedIn ? 'Logged In!' : null }
        </Text>
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
