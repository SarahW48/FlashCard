'use strict';

var React = require('react-native');
var Carousel = require('react-native-looped-carousel');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var {PropTypes} = React;
var {
  AppRegistry,
  StyleSheet,
  Text,
  View
} = React;

var SingleFlashCard = require('./SingleFlashCard');
var FlashCard = require('./FlashCard');

var FlashCards = React.createClass({
  propTypes: {
    navigator: PropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {
      size: {width: width, height: height}
    };
  },
  render: function() {
    var realm = new Realm({schema: [FlashCard]});
    var flashCards = realm.objects('FlashCard').sorted('id', 'desc');
    if (flashCards === null || flashCards.length === 0) {
      return (
        <View
          style={[{backgroundColor:'white', marginTop: 300}, this.state.size]}>
          <Text style={[{textAlign:'center'}]}>
            You have no FlashCards.
          </Text>
        </View>
      );
    }
    flashCards = Object.keys(flashCards).map(
      function (key) {return flashCards[key]}
    );
    var renderCards = flashCards.map(
      (flashCard) =>
        <View key={flashCard.id}>
          <SingleFlashCard
            id={flashCard.id}
            title={flashCard.title}
            description={flashCard.description}
            imageUrl={flashCard.imageUrl}
            videoUrl={flashCard.videoUrl}
            navigator={this.props.navigator}
            onDelete={() => this.forceUpdate()}
            onUpdate={() => this.forceUpdate()}
          />
        </View>
    );
    return (
      <View style={{flex: 1}} onLayout={this._onLayoutDidChange}>
        <Carousel delay={1000000} style={this.state.size}>
          {renderCards}
        </Carousel>
      </View>
    );
  },
});

module.exports = FlashCards;
