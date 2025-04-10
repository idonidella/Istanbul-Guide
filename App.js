import React, { Component } from 'react';
import { StatusBar, View } from 'react-native';
import Navigator from './src/router/index';

class App extends Component {

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar hidden />
        <Navigator />
      </View>
    );
  }
}

export default App;
