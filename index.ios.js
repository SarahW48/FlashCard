/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableOpacity
} from 'react-native';

const FlashCards = require('./FlashCards');
const SingleFlashCard = require('./SingleFlashCard');

class FlashCardApp extends Component {
  render() {
    return (
      <Navigator
        initialRoute={{
          scene: 'FlashCardList',
          data: {},
        }}
        renderScene={this._navigatorRenderScene}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            style={styles.navBar}
          />
        }
      />
    );
  }

  _navigatorRenderScene(route, navigator) {
    switch (route.scene) {
      case 'FlashCardList':
        return (
          <FlashCards
            navigator={navigator}
          />
        );
      case 'AddCard':
        return (
          <SingleFlashCard navigator={navigator} />
        );
    }
  }
}

var NavigationBarRouteMapper = {
  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text>Back</Text>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    if (route.scene === 'FlashCardList') {
      return (
        <TouchableOpacity
          onPress={() => navigator.push({
            scene : 'AddCard',
          })}
          style={styles.navBarRightButton}>
          <Text>New</Text>
        </TouchableOpacity>
      );
    }
  },

  Title: function(route, navigator, index, navState) {
    switch (route.scene) {
      case 'FlashCardList':
        return <Text>View Cards</Text>;
      case 'AddCard':
        return <Text>Add Card</Text>;
    }
  },
};

var styles = StyleSheet.create({
  navBar: {
    height: 40,
    marginTop: 20,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
  },
});

AppRegistry.registerComponent('FlashCardApp', () => FlashCardApp);
