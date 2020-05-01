import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StatusBar,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import HeaderComponent from '../../components/headerComponents';
import {connect} from 'react-redux';
import {Toast} from 'native-base';
import {Images} from '../../assets/image';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../../config/server';
import {postToServerWithAccount} from '../../../components/fetch';
import ImageManipulator from '../../lib/react-native-image-manipulator';
import ImageBrowser from '../../../components/multi-select-image/ImageBrowser';
import {dispatchParams, postToServer} from '../../config';
import ProgressDialog from '../../../components/ProgressDialog';
import {accountActionTypes} from '../../actions/type';
class EditProfile extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      showSelectImage: false,
      dataImage: [],
      imgUpload: null,
      name: '',
      phone: '',
    };
  }

  componentDidMount = () => {
    const {accountInfo} = this.props;
    const {name, phone} = accountInfo;
    this.setState({name, phone});
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  selectImage = () => {
    this.setState({showSelectImage: true});
  };

  getFileFromUri = async image => {
    const type = image.type.split('/')[1];

    return await ImageManipulator.manipulateAsync(
      image.uri,
      [{resize: {width: image.width, height: image.height}}],
      {format: type},
    );
  };

  update = async () => {
    const {name, phone, imgUpload} = this.state;
    const {accountInfo, navigation} = this.props;
    if (!name) return;
    this.setState({loading: true});
    try {
      const response = await postToServer(getApiUrl(API.UPDATE_PROFILE), {
        name,
        phone,
        id: accountInfo.id,
        token: accountInfo.access_token.token,
        avatar: imgUpload || accountInfo.avatar,
      });
      if (response.status === 1) {
        this.props.dispatchParams(
          {
            ...accountInfo,
            name,
            phone,
            avatar: imgUpload || accountInfo.avatar,
          },
          accountActionTypes.APP_USER_INFO,
        );
        this.setState({
          imgUpload: null,
        });
        Toast.show({
          text: 'Thành công!',
          duration: 2500,
          position: 'center',
          type: 'success',
        });
        // if (navigation.state.params?.onRefresh)
        //   navigation.state.params?.onRefresh();
        this.goBack();
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({loading: false});
    }
  };

  imageBrowserCallback = callback => {
    this.setState({showSelectImage: false});
    if (callback) {
      callback.forEach(image => {
        const newImage = this.getFileFromUri(image);
        const imgNew = {...image, ...newImage};
        let {imgSelected} = this.state;
        imgSelected = imgSelected ? [...imgSelected, imgNew] : [imgNew];
        this.setState({imgSelected, image: imgSelected[0].uri}, () =>
          this.submitImage(imgSelected),
        );
      });
    }
  };

  submitImage = async imgSelected => {
    const {accountInfo} = this.props;
    this.setState({uploading: true});
    try {
      const response = await postToServerWithAccount(
        getApiUrl(API.UPLOAD_IMAGE),
        {
          token: accountInfo.access_token.token,
        },
        imgSelected,
      );
      console.log(response.data, 'a');
      this.setState({
        imgUpload: response.data,
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({uploading: false});
    }
  };

  hideSelect = () => {
    this.setState({showSelectImage: false});
  };

  render() {
    const {navigation, accountInfo} = this.props;
    const {
      image,
      showSelectImage,
      dataImage,
      uploading,
      phone,
      name,
      imgUpload,
      loading,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <HeaderComponent
          navigation={navigation}
          left
          right
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title={'Cập nhật thông tin'}
          onPressLeft={this.goBack}
        />
        <ProgressDialog
          visible={uploading}
          message="Vui lòng chờ giây lát..."
        />
        <ScrollView>
          <TouchableOpacity
            onPress={this.selectImage}
            style={{padding: 16, alignItems: 'center'}}>
            <Image
              source={
                imgUpload
                  ? {uri: HOST_IMAGE_UPLOAD + JSON.parse(imgUpload)[0]}
                  : accountInfo.avatar
                  ? {uri: HOST_IMAGE_UPLOAD + JSON.parse(accountInfo.avatar)[0]}
                  : Images.avatarDefault
              }
              style={{width: 100, height: 100, borderRadius: 50}}
              resizeMode="cover"
            />
            <Text style={{color: '#00c068', marginTop: 6}}>
              Cập nhật avatar
            </Text>
          </TouchableOpacity>
          <View style={{marginTop: 32}}>
            <View>
              <Text style={{marginLeft: 16}}>Họ tên</Text>
              <View
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#CCC',
                }}>
                <TextInput
                  value={name}
                  onChangeText={text => this.setState({name: text})}
                  style={{marginLeft: 15}}
                  placeholderTextColor="#CCC"
                />
              </View>
            </View>

            <View style={{marginTop: 16}}>
              <Text style={{marginLeft: 16}}>Email</Text>
              <View
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#CCC',
                }}>
                <TextInput
                  value={accountInfo.email}
                  editable={false}
                  style={{marginLeft: 15}}
                  placeholderTextColor="#CCC"
                />
              </View>
            </View>

            <View style={{marginTop: 16}}>
              <Text style={{marginLeft: 16}}>Số điện thoại</Text>
              <View
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#CCC',
                  marginBottom: 8,
                }}>
                <TextInput
                  value={phone}
                  onChangeText={text => this.setState({phone: text})}
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={{marginLeft: 15}}
                  placeholderTextColor="#CCC"
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <ScrollView
          style={{
            top: 0,
            zIndex: 999,
            position: 'absolute',
            bottom: 0,
            flex: 1,
          }}>
          {showSelectImage ? (
            <ImageBrowser
              max={1}
              visible={showSelectImage}
              hideSelect={this.hideSelect}
              callback={this.imageBrowserCallback}
              selectedCount={dataImage && dataImage.length}
            />
          ) : null}
        </ScrollView>
        {!showSelectImage && name ? (
          <TouchableOpacity
            style={{
              height: 48,
              backgroundColor: '#00c068',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={this.update}>
            {loading ? (
              <ActivityIndicator color={'#FFF'} />
            ) : (
              <Text style={{color: '#FFF', fontSize: 18}}>Cập nhật</Text>
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

const matchDispatchToProps = dispatch => {
  return {
    dispatchParams: (data, type) => {
      dispatch(dispatchParams(data, type));
    },
  };
};

export default connect(
  mapStateToProps,
  matchDispatchToProps,
)(EditProfile);
