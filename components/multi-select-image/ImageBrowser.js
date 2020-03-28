import React from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {camelCase, nth} from 'lodash';
import ImageTile from './ImageTile';
import CameraRoll from '@react-native-community/cameraroll';
const {width} = Dimensions.get('window');

class ImageBrowser extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      selected: {},
      after: null,
      has_next_page: true,
    };
  }

  componentDidMount() {
    this.getPhotos();
  }

  selectImage = index => {
    let newSelected = {...this.state.selected};
    if (newSelected[index]) {
      delete newSelected[index];
    } else {
      newSelected[index] = true;
    }
    if (
      Object.keys(newSelected).length + this.props.selectedCount >
      this.props.max
    )
      return;
    if (!newSelected) newSelected = {};
    this.setState({selected: newSelected});
  };

  getPhotos = () => {
    let params = {
      first: 50,
      assetType: 'Photos',
    };

    params = Platform.OS === 'ios' ? {...params, groupTypes: 'All'} : params;

    if (this.state.after) params.after = this.state.after;
    if (!this.state.has_next_page) return;
    CameraRoll.getPhotos(params).then(this.processPhotos);
  };

  processPhotos = r => {
    if (this.state.after === r.page_info.end_cursor) return;
    let dataImage = r.edges.map(i => i.node);

    this.setState({
      photos: [...this.state.photos, ...dataImage],
      after: r.page_info.end_cursor,
      has_next_page: r.page_info.has_next_page,
    });
  };

  getItemLayout = (data, index) => {
    let length = width / 4;
    return {length, offset: length * index, index};
  };

  prepareCallback = async () => {
    let {selected, photos} = this.state;
    let selectedPhotos = photos.filter((item, index) => {
      return selected[index];
    });
    // let files = selectedPhotos.map(value => {
    //   FileSystem.getInfoAsync(value.image.uri, { md5: true });
    // });
    let callbackResult = await Promise.all(selectedPhotos).then(imageData => {
      return imageData.map((value, index) => {
        let uri = value.image.uri;
        let type = value.type;
        let arrUri = uri.split('/');
        let arrType = type.split('/');

        let arrUriIOS = arrUri[arrUri.length - 1].split('?');
        let arrNameIOS = arrUriIOS[arrUriIOS.length - 1].split('=');
        let arrTypeIOS = arrUriIOS[0].split('.');

        let name =
          Platform.OS === 'ios'
            ? nth(arrNameIOS, 1) +
              '.' +
              camelCase(nth(arrTypeIOS, arrTypeIOS.length - 1))
            : nth(arrUri, arrUri.length - 1) +
              '.' +
              nth(arrType, arrType.length - 1);

        let typeImage =
          Platform.OS === 'ios'
            ? 'image/' + camelCase(nth(arrTypeIOS, arrTypeIOS.length - 1))
            : type;
        return {
          uri,
          name,
          type: typeImage,
          width: value.image.width,
          height: value.image.height,
          base64: Platform.OS === 'ios' ? undefined : false,
        };
      });
    });
    this.props.callback(callbackResult);
  };

  renderHeader = () => {
    let selectedCount =
      this.props.selectedCount + Object.keys(this.state.selected).length;
    let headerText =
      ' Đã chọn ' + '(' + selectedCount + '/' + this.props.max + ')';
    if (selectedCount === this.props.max) headerText = headerText + ' (Tối đa)';
    return (
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => this.props.hideSelect()}
          style={{
            height: 32,
            width: 84,
            borderRadius: 6,
            borderColor: '#ff2e54',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 6,
            borderWidth: 1,
          }}>
          <Text style={{color: '#ff2e54'}}>Đóng</Text>
        </TouchableOpacity>

        {Object.keys(this.state.selected).length > 0 ? (
          <Text>{headerText}</Text>
        ) : null}

        {Object.keys(this.state.selected).length > 0 ? (
          <TouchableOpacity
            onPress={this.prepareCallback}
            style={{
              height: 32,
              width: 84,
              borderRadius: 6,
              backgroundColor: '#ff2e54',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 6,
            }}>
            <Text style={{color: '#FFF'}}>Xong</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  renderImageTile = ({item, index}) => {
    let selected = this.state.selected[index] ? true : false;
    return (
      <ImageTile
        item={item}
        index={index}
        selected={selected}
        selectImage={this.selectImage}
      />
    );
  };

  renderImages = () => {
    return (
      <FlatList
        data={this.state.photos}
        numColumns={4}
        renderItem={this.renderImageTile}
        keyExtractor={(_, index) => index}
        onEndReached={() => {
          this.getPhotos();
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<Text>Đang tải ảnh</Text>}
        initialNumToRender={24}
        getItemLayout={this.getItemLayout}
      />
    );
  };

  render() {
    if (!this.props.visible) return null;
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.renderImages()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    width: width,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  btHuy: {
    borderColor: 'red',
    borderWidth: 0.7,
    width: 60,
    alignItems: 'center',
    borderRadius: 5,
    height: 30,
    justifyContent: 'center',
  },
  btXong: {
    justifyContent: 'center',
    width: 60,
    alignItems: 'center',
    borderRadius: 5,
    height: 30,
  },
});
export default ImageBrowser;
