import React, {PureComponent} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
} from 'react-native';
import HeaderComponent from '../../components/headerComponents';
import {HOST_IMAGE_UPLOAD} from '../../config/server';
import ShowImageView from '../../../components/show-image-view';
import FastImage from 'react-native-fast-image';

export default class PostNew extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      showImage: false,
      index: 0,
    };
  }

  componentDidMount = () => {
    const {navigation} = this.props;
    const {data} = navigation.state.params;
    this.setState({data});
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  renderItem = ({item, index}) => {
    if (item?.empty) return null;
    return (
      <TouchableOpacity
        style={{flex: 1, marginHorizontal: 2, marginVertical: 2}}
        onPress={this.showModalImage.bind(this, true, index)}>
        <FastImage
          style={{
            width: '100%',
            height: Dimensions.get('window').width * 0.36,
          }}
          source={{uri: HOST_IMAGE_UPLOAD + item}}
        />
      </TouchableOpacity>
    );
  };

  formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({key: `blank-${numberOfElementsLastRow}`, empty: true});
      numberOfElementsLastRow++;
    }

    return data;
  };

  showModalImage = (state, index) => {
    this.setState({index});
    if (Platform.OS === 'android') {
      StatusBar.setHidden(state, 'slide');
      StatusBar.setBarStyle('dark-content');
    }
    this.setState({showImage: state});
  };

  render() {
    const {navigation} = this.props;
    const {data, showImage, index} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <HeaderComponent
          navigation={navigation}
          left
          right
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title="Album ảnh"
          onPressLeft={this.goBack}
        />
        <FlatList
          data={this.formatData(data, 3)}
          numColumns={3}
          renderItem={this.renderItem}
          keyExtractor={() => String(Math.random())}
        />
        <ShowImageView
          showGallery={showImage}
          onRequestClose={this.showModalImage.bind(this, false, 0)}
          onClosePress={this.showModalImage.bind(this, false, 0)}
          initPage={index}
          image={
            data && data.length > 0 ? data.filter(item => !item.empty) : []
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 20,
  },
  item: {
    backgroundColor: '#4D243D',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    margin: 1,
    height: Dimensions.get('window').width / 3, // approximate a square
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
  itemText: {
    color: '#fff',
  },
});
