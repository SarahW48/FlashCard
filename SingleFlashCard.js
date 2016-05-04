'use strict';

var React = require('react-native');
var Dimensions = require('Dimensions');
var {width, height} = Dimensions.get('window');
var {PropTypes} = React;
var ImagePickerManager = require('NativeModules').ImagePickerManager;
var VideoPlayer = require('react-native-videoplayer');
var Mailer = require('NativeModules').RNMail;
var Button = require('react-native-button');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  AlertIOS,
  TextInput,
} = React;

var FlashCard = require('./FlashCard');

var SingleFlashCard = React.createClass({
  propTypes: {
    navigator: PropTypes.object.isRequired,
    imageUrl: PropTypes.string,
    videoUrl: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    id: PropTypes.number,
    onDelete: PropTypes.func,
    onUpdate: PropTypes.func,
  },

  getInitialState: function() {
    return {
      id: this.props.id,
      imageUrl: this.props.imageUrl,
      videoUrl: this.props.videoUrl,
      title: this.props.title,
      description: this.props.description,
      editText: false,
    };
  },

  render: function() {
    return (
      this._renderCard()
    );
  },

  _renderCard: function(): ReactElement {
    if (this.state.id === null || this.state.id === undefined) {
      return (
        <View>
          <Image
            source={require('./background.jpg')}
            style={{width: width, height: height}}>
            {this._renderTitleAndDescription()}
            {this._renderButtons()}
          </Image>
        </View>
      );
    } else {
      if (this.state.imageUrl !== null && this.state.imageUrl !== undefined) {
        return (
          <View>
            <Image
              source={{uri: this.state.imageUrl}}
              style={{width: width, height: height}}>
              {this._renderTitleAndDescription()}
              {this._renderButtons()}
              {this._renderSendandDeleteButton()}
            </Image>
          </View>
        );
      } if (this.state.videoUrl !== null && this.state.videoUrl !== undefined) {
        return (
          <View style={styles.container}>
            <VideoPlayer style={styles.video} url={this.state.videoUrl}/>
            <View style={{marginTop: 30}}>
              {this._renderTitleAndDescription()}
              {this._renderButtons()}
              {this._renderSendandDeleteButton()}
            </View>
          </View>
        );
      } else {
        return (
          <View>
            <Image
              source={require('./background.jpg')}
              style={{width: width, height: height}}>
              {this._renderTitleAndDescription()}
              {this._renderButtons()}
              {this._renderSendandDeleteButton()}
            </Image>
          </View>
        );
      }
    }
  },

  _renderButtons: function() {
    return (
      <View
        style={[
          {marginTop: 130, marginLeft: 10, marginRight: 10, flexDirection: 'row'}
        ]}>
        <Button
           containerStyle={styles.buttonContainer}
                 style={styles.buttonText}
           onPress={this._onTextChangePress}
         >
          {this.state.editText ? 'Save' : 'Text'}
        </Button>
        <Text style={[{width: 30, }]} />
        <Button
           containerStyle={styles.buttonContainer}
                 style={styles.buttonText}
           onPress={this._onImageChangePress}
         >
          Image
        </Button>
        <Text style={[{width: 30, }]} />
        <Button
           containerStyle={styles.buttonContainer}
                 style={styles.buttonText}
           onPress={this._onVideoChangePress}
         >
          Video
        </Button>
      </View>
    );
  },

  _renderSendandDeleteButton: function() {
    return (
      <View
        style={
          [{marginTop: 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}]
        }>
        <Button
           containerStyle={styles.sendDeleteCardButtonContainer}
                 style={styles.sendDeleteCardButtonText}
           onPress={this._onSendCardPress}
         >
          Send Card
        </Button>
        <Text style={[{width: 30, }]} />
        <Button
           containerStyle={styles.sendDeleteCardButtonContainer}
                 style={styles.sendDeleteCardButtonText}
           onPress={this._onDeletePress}
         >
          Delete Card
        </Button>
      </View>
    );
  },

  _renderTitleAndDescription: function() {
    if (this.state.editText) {
      return (
        <View style={[{marginTop: 300}]}>
          <TextInput
            style={styles.textInput}
            placeholder={'Card title'}
            placeholderTextColor = 'grey'
            onChangeText={
              (title) => this.setState({title: title})
            }
            value={this.state.title}
          />
          <Text style={[{height: 10, }]} />
          <TextInput
            style={styles.textInput}
            placeholder={'Card description'}
            placeholderTextColor = 'grey'
            onChangeText={
              (description) => this.setState({description: description})
            }
            value={this.state.description}
          />
        </View>
      );
    } else {
      var title = this.state.title;
      if (title === null || title === undefined) {
        title = 'Card Title';
      }
      var description = this.state.description;
      if (description === null || description === undefined) {
        description = 'Card Description';
      }
      return (
        <View style={[{marginTop: 300}]}>
          <Text style={[{fontSize: 35, color: 'white', textAlign: 'center'}]}>
            {title}
          </Text>
          <Text style={[{fontSize: 35, color: 'white', textAlign: 'center'}]}>
            {description}
          </Text>
        </View>
      );
    }
  },

  _onTextChangePress: function() {
    // User edit some text and save the changes
    if (this.state.editText) {
      this._saveCard();
    }
    this.setState({editText: !this.state.editText});
  },

  _onSendCardPress: function() {
    var attachment = {};
    if (this.state.imageUrl !== null && this.state.imageUrl !== undefined) {
      attachment = {
        path: this.state.imageUrl.replace('file://', ''),
        type: 'jpg',
        name: 'Card image',
      };
    }
    if (this.state.videoUrl !== null && this.state.videoUrl !== undefined) {
      attachment = {
        path: this.state.videoUrl.replace('file://', ''),
        type: 'mov',
        name: 'your_video.mov',
      };
    }
    Mailer.mail({
      subject: this.state.title === null ? '' : this.state.title,
      recipients: [],
      body: this.state.description === null ? '': this.state.description,
      attachment: attachment,
    /*  audio_attachment: {
        path: AudioUtils.DocumentDirectoryPath + `/${this.state.id}.caf`,
        type: 'caf',
        name: 'Special_voice_for_you.caf',
      }, */
    }, (error, event) => {
      if(error) {
        AlertIOS.alert(
          'Error',
          'Could not send mail'
        );
      }
    });
  },

  _onDeletePress: function() {
    var realm = new Realm({schema: [FlashCard]});
    var flashCards = realm
      .objects('FlashCard')
      .filtered(`id="${this.state.id}"`);
    if (flashCards !== null && flashCards.length !== 0) {
      var flashCard = flashCards[0];
      realm.write(() => {
        realm.delete(flashCard);
      });
    }
    AlertIOS.alert(
      'Card deleted',
      'You have succesfully deleted your card',
    );
    if (this.props.onDelete) {
      this.props.onDelete();
    }
  },

  _onImageChangePress: function() {
    var options = {
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'photo', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      durationLimit: 10, // video recording max time in seconds
      maxWidth: 1000, // photos only
      maxHeight: 10000, // photos only
      quality: 1, // 0 to 1, photos only
      angle: 0, // android only, photos only
      allowsEditing: false, // Built in functionality to resize/reposition the image after selection
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images' // ios only - will save image at /Documents/images rather than the root
      }
    };
    ImagePickerManager.showImagePicker(options, (response) => {
      if (response.uri) {
        this.setState({
          imageUrl: response.uri,
          videoUrl: null,
        });
        this._saveCard();
      }
    });
  },

  _onVideoChangePress: function() {
    var options = {
      title: 'Pick video',
      cancelButtonTitle: 'Cancel',
      takePhotoButtonTitle: null, // specify null or empty string to remove this button
      chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
      cameraType: 'back', // 'front' or 'back'
      mediaType: 'video', // 'photo' or 'video'
      videoQuality: 'high', // 'low', 'medium', or 'high'
      durationLimit: 10, // video recording max time in seconds
      maxWidth: 1000, // photos only
      maxHeight: 10000, // photos only
      quality: 1, // 0 to 1, photos only
      angle: 0, // android only, photos only
      allowsEditing: false, // Built in functionality to resize/reposition the image after selection
      noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
      storageOptions: { // if this key is provided, the image will get saved in the documents directory on ios, and the pictures directory on android (rather than a temporary directory)
        skipBackup: true, // ios only - image will NOT be backed up to icloud
        path: 'images' // ios only - will save image at /Documents/images rather than the root
      }
    };
    ImagePickerManager.showImagePicker(options, (response) => {
      if (response.uri) {
        this.setState({
          videoUrl: response.uri,
          imageUrl: null,
        });
        this._saveCard();
      }
    });
  },

  _saveCard: function() {
    var realm = new Realm({schema: [FlashCard]});
    var id = this.state.id;
    if (!id) {
      id = Date.now();
    }
    realm.write(() => {
      var card = realm.create(
        'FlashCard',
        {
          id: id,
          title: this.state.title,
          description: this.state.description,
          imageUrl: this.state.imageUrl,
          videoUrl: this.state.videoUrl,
        },
        true,
      );
    });
    this.setState(
      {id: id}
    );
    AlertIOS.alert(
      'Change saved',
      'You have successfully updated your card',
    );
    if (this.props.onUpdate) {
      this.props.onUpdate();
    }
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  video: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  buttonContainer: {
    padding:10,
    width:100,
    height:45,
    overflow:'hidden',
    borderRadius:4,
    backgroundColor: '#008066'
  },
  buttonText: {
    fontSize: 20,
    color: '#e6fffa'
  },
  sendDeleteCardButtonContainer: {
    padding:10,
    width:150,
    height:35,
    overflow:'hidden',
    borderRadius:4,
    backgroundColor: '#008066'
  },
  sendDeleteCardButtonText: {
    fontSize: 15,
    color: '#e6fffa'
  },
  textInput:{
    height: 40,
    marginLeft:30,
    marginRight:30,
    color:'white',
    borderColor: 'white',
    borderWidth: 1
  }
});

module.exports = SingleFlashCard;
