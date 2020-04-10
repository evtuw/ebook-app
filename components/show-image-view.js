import React from 'react';
import {
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Gallery from 'react-native-image-gallery';
import {Icon} from 'native-base';
import {HOST_IMAGE_UPLOAD} from '../src/config/server';

class ShowImageView extends React.PureComponent {
  static defaultProps = {
    showGallery: false,
    onRequestClose: undefined,
    onClosePress: undefined,
    initPage: 0,
    images: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {
      images: this.props.image
        ? this.props.image.map(value => ({
            source: {uri: HOST_IMAGE_UPLOAD + value},
          }))
        : [],
    };
  }

  componentWillReceiveProps = nextProps => {
    if (Platform.OS === 'android') {
      nextProps.showGallery
        ? StatusBar.setBackgroundColor('black', true)
        : StatusBar.setBackgroundColor('#FFF', true);
    }

    if (nextProps.image.length !== this.props.image.length) {
      this.setState({
        images: nextProps.image
          ? nextProps.image.map(value => ({
              source: {uri: HOST_IMAGE_UPLOAD + value},
            }))
          : [],
      });
    }
  };

  onChangeImage = index => {
    this.setState({index});
  };

  renderError = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'black',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={styles.textKhongTaiAnh}>Không tải đc ảnh</Text>
      </View>
    );
  };

  onCloseImage = () => {
    this.props.onClosePress();
  };

  render() {
    const {images, index} = this.state;

    return (
      <Modal
        transparent
        visible={this.props.showGallery || false}
        onRequestClose={this.props.onRequestClose}
        animationType="fade">
        <View style={styles.viewModal}>
          <Gallery
            style={{flex: 1}}
            pageMargin={5}
            errorComponent={this.renderError}
            onPageSelected={this.onChangeImage}
            images={images}
            initialPage={this.props.initPage}
          />

          <View style={styles.iconCloseModal}>
            <TouchableOpacity
              onPress={this.onCloseImage}
              hitSlop={{bottom: 10, left: 10, right: 10, top: 10}}>
              <Icon name={'ios-close'} style={styles.iconClose} />
            </TouchableOpacity>
          </View>

          <View style={styles.viewPagenumber}>
            <Text style={styles.textPagenumber}>
              {index + 1} / {images.length}
            </Text>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  viewModal: {
    backgroundColor: '#000',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconClose: {
    fontSize: 40,
    color: 'white',
  },
  iconCloseModal: {
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewPagenumber: {
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    justifyContent: 'center',
    bottom: 10,
    height: 30,
    width: 60,
  },
  textPagenumber: {
    textAlign: 'center',
    color: 'white',
    fontSize: 13,
  },
  textKhongTaiAnh: {
    color: 'white',
    fontSize: 15,
    fontStyle: 'italic',
  },
});

export default ShowImageView;
