import React, {PureComponent} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  ActivityIndicator,
  DeviceEventEmitter,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {Icon, Toast} from 'native-base';
import HeaderComponent from '../../components/headerComponents';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../../config/server';
import {Images} from '../../assets/image';
import {getFromServer, postToServer} from '../../config';
import {postToServerWithAccount} from '../../../components/fetch';
import ImageBrowser from '../../../components/multi-select-image/ImageBrowser';
import ImageManipulator from '../../lib/react-native-image-manipulator';
import ProgressDialog from '../../../components/ProgressDialog';
import {setWidth} from '../../cores/baseFuntion';
import color from '../../assets/static-data/color';

class CreatePost extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      dataImage: [],
      content: '',
      category_id: null,
      imageUpload: [],
      loading: false,
      uploadImage: false,
      categories: [],
    };
  }

  componentDidMount = () => {
    const {navigation} = this.props;
    if (navigation.state.params) {
      this.setState({visible: navigation.state.params.visible});
    }
    this.getCategory();
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  getCategory = async () => {
    const {accountInfo} = this.props;

    try {
      const response = await getFromServer(getApiUrl(API.CATEGORY), {
        token: accountInfo.access_token.token,
        page: 1,
        page_size: 50,
      });
      this.setState({categories: response.data.slice(0, 10)});
    } catch (e) {
      console.log(e);
    }
  };

  launchImageLibrary = () => {
    this.setState({visible: true});
    // const options = {
    //   multiple: true,
    //   compressImageQuality: 0.25,
    // };
    // ImagePicker.openPicker(options).then(image => {
    //   this.postData(image);
    // });
  };

  submit = async () => {
    const {dataImage, imageUpload} = this.state;
    const {accountInfo} = this.props;
    this.setState({uploadImage: true});
    try {
      const response = await postToServerWithAccount(
        getApiUrl(API.UPLOAD_IMAGE),
        {
          token: accountInfo.access_token.token,
        },
        dataImage,
      );
      console.log(response.data, 'a');
      const newImage = JSON.parse(response.data);
      this.setState({
        imageUpload:
          imageUpload.length > 0 ? [...imageUpload, ...newImage] : newImage,
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({uploadImage: false});
    }
  };

  post = async () => {
    const {imageUpload, content, category_id} = this.state;
    const {accountInfo} = this.props;
    this.setState({loading: true});
    try {
      const data = {
        content,
        category_id,
        image: imageUpload.length > 0 ? JSON.stringify(imageUpload) : null,
        token: accountInfo.access_token.token,
        user_id: accountInfo.id,
      };
      const response = await postToServer(getApiUrl(API.ADD_POST), data);
      if (response.status === 1) {
        Toast.show({
          text: 'Thành công! Vui lòng chờ phê duyệt từ admin.',
          duration: 2500,
          position: 'center',
          type: 'success',
        });
        this.goBack();
        DeviceEventEmitter.emit('LoadData');
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({loading: false});
    }
  };

  removeImage = (item, index) => {
    const {dataImage, imageUpload} = this.state;
    this.setState(
      {
        dataImage: dataImage.filter(v => v.uri !== item.uri),
        imageUpload: JSON.parse(imageUpload).splice(index, 1),
      },
      () => {
        console.log('dataImage', dataImage);
        console.log('imageUpload', imageUpload);
      },
    );
  };

  renderItem = ({item, index}) => {
    return (
      <View style={{margin: 8}}>
        <Image
          source={{uri: item.uri}}
          style={{width: Dimensions.get('window').width / 3.5, height: 100}}
          resizeMode="cover"
        />
        {/*<View style={{position: 'absolute', right: 5, top: 5}}>*/}
        {/*  <TouchableOpacity onPress={() => this.removeImage(item, index)}>*/}
        {/*    <Icon*/}
        {/*      name="ios-close-circle"*/}
        {/*      type="Ionicons"*/}
        {/*      style={{color: 'rgba(255,16,27,0.77)', fontSize: 22}}*/}
        {/*    />*/}
        {/*  </TouchableOpacity>*/}
        {/*</View>*/}
      </View>
    );
  };

  selectCate = item => {
    const {category_id} = this.state;
    if (category_id === item.cid) {
      this.setState({category_id: null});
      return;
    }
    this.setState({category_id: item.cid});
  };

  renderCate = ({item}) => {
    const {category_id} = this.state;
    if (item.category_name)
      return (
        <TouchableOpacity
          style={{
            backgroundColor:
              category_id === item.cid ? '#00c068' : 'rgba(0,192,104,0.13)',
            padding: 4,
            borderRadius: 4,
            margin: 6,
          }}
          onPress={() => this.selectCate(item)}>
          <Text
            style={{color: category_id === item.cid ? '#FFF' : '#00c068'}}
            numberOfLines={1}>
            {item.category_name.substring(0, 20)}
          </Text>
        </TouchableOpacity>
      );
    return null;
  };

  getFileFromUri = async image => {
    const type = image.type.split('/')[1];

    return await ImageManipulator.manipulateAsync(
      image.uri,
      [{resize: {width: image.width, height: image.height}}],
      {format: type},
    );
  };

  imageBrowserCallback = callback => {
    this.setState({visible: false});
    if (callback) {
      callback.forEach(image => {
        const newImage = this.getFileFromUri(image);
        const imgNew = {...image, ...newImage};
        let {dataImage} = this.state;
        dataImage = dataImage ? [...dataImage, imgNew] : [imgNew];
        this.setState({dataImage}, () => this.submit());
      });
    }
  };

  hideSelect = () => {
    this.setState({visible: false});
  };

  render() {
    const {navigation, accountInfo} = this.props;
    const {
      dataImage,
      content,
      visible,
      loading,
      uploadImage,
      categories,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <HeaderComponent
          navigation={navigation}
          iconRightStyle={{fontSize: 35}}
          iconLeft="ios-arrow-back"
          left
          right
          typeIconRight="EvilIcons"
          title="Đăng bài viết"
          onPressLeft={this.goBack}
        />
        <ProgressDialog
          visible={uploadImage}
          message="Vui lòng chờ giây lát..."
        />
        <ScrollView scrollEnabled>
          <View style={{margin: 16, flexDirection: 'row'}}>
            <Image
              source={
                accountInfo.avatar
                  ? {uri: HOST_IMAGE_UPLOAD + JSON.parse(accountInfo.avatar)[0]}
                  : Images.avatarDefault
              }
              style={{width: 40, height: 40, borderRadius: 20}}
            />
            <Text style={{marginLeft: 8, marginTop: 8, fontSize: 16}}>
              {accountInfo.name}
            </Text>
          </View>
          <FlatList
            data={categories}
            horizontal
            style={{marginHorizontal: 8}}
            contentContainerStyle={{flex: 1, flexWrap: 'wrap'}}
            keyExtractor={() => String(Math.random())}
            renderItem={this.renderCate}
          />
          <View
            style={{
              marginHorizontal: 8,
              minHeight: 250,
              borderBottomColor: '#AAA',
              borderBottomWidth: 0.5,
            }}>
            <TextInput
              // autoFocus
              value={content}
              placeholder="Nhập nội dung"
              placeholderTextColor="#CCC"
              style={{color: '#000'}}
              onChangeText={text => this.setState({content: text})}
              multiline
            />
          </View>
          <View style={{marginTop: 16}}>
            <FlatList
              data={dataImage}
              numColumns={3}
              renderItem={this.renderItem}
              keyExtractor={() => String(Math.random())}
            />
          </View>
          {!visible && (
            <View style={{padding: 16}}>
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center', height: 32}}
                onPress={this.launchImageLibrary}>
                <Icon
                  name="file-photo-o"
                  type="FontAwesome"
                  style={{fontSize: 22}}
                />
                <Text style={{marginLeft: 16, fontSize: 18}}>Thư viện ảnh</Text>
              </TouchableOpacity>
            </View>
          )}
          {visible ? (
            <ImageBrowser
              max={10}
              hideSelect={this.hideSelect}
              visible={visible}
              callback={this.imageBrowserCallback}
              selectedCount={dataImage && dataImage.length}
            />
          ) : null}
        </ScrollView>
        {dataImage.length > 0 || content ? (
          <TouchableOpacity
            style={{
              backgroundColor: color.primaryColor,
              alignItems: 'center',
              justifyContent: 'center',
              height: 48,
            }}
            onPress={this.post}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={{color: '#FFF', fontSize: 18}}>ĐĂNG BÀI</Text>
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(CreatePost);
