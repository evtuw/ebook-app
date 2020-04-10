import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  DeviceEventEmitter,
  StatusBar,
} from 'react-native';
import {Icon, Toast} from 'native-base';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import HeaderComponent from '../../components/headerComponents';
import {cities, districts} from '../../assets/static-data';
import {getFromServer, postToServer} from '../../config';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../../config/server';
import ImageManipulator from '../../lib/react-native-image-manipulator';
import ImageBrowser from '../../../components/multi-select-image/ImageBrowser';
import {postToServerWithAccount} from '../../../components/fetch';
import ProgressDialog from '../../../components/ProgressDialog';

class AddNewStore extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      address: '',
      email: '',
      phone: '',
      dataSelect: [],
      isVisible: false,
      cityId: null,
      districtId: null,
      type: 1,
      loading: false,
      cover: null,
      visible: false,
      dataImage: [],
    };
  }

  componentDidMount = () => {
    const {navigation} = this.props;
    if (navigation.state.params?.store_id) {
      this.getDetailStore();
    }
  };

  getDetailStore = async () => {
    const {accountInfo} = this.props;
    this.setState({uploadImage: true});
    try {
      const response = await getFromServer(getApiUrl(API.GET_DETAIL_STORE), {
        token: accountInfo.access_token.token,
        user_id: accountInfo.id,
      });
      if (response.status === 1) {
        const {
          name,
          email,
          phone,
          city_name,
          district_name,
          cover,
          address,
        } = response.data;

        const cityId = cities.find(v => v.Name === city_name)?.Id;
        const districtId = districts.find(v => v.Name === district_name)?.Id;
        this.setState({
          name,
          email,
          phone,
          cityId,
          districtId,
          cover,
          address,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({uploadImage: false});
    }
  };

  submit = async () => {
    const {accountInfo, navigation} = this.props;
    const {name, address, email, phone, cover, cityId, districtId} = this.state;

    this.setState({loading: true});
    try {
      const data = {
        name,
        address,
        email,
        city_name: cities.find(v => v.Id === cityId)?.Name,
        district_name: districts.find(y => y.Id === districtId)?.Name,
        phone,
        cover,
        user_id: accountInfo.id,
        token: accountInfo.access_token.token,
        store_id: navigation.state.params?.store_id,
      };
      const response = await postToServer(getApiUrl(API.ADD_STORE), data);
      if (response.status === 1) {
        DeviceEventEmitter.emit('LoadStore');
        this.goBack();
      }
    } catch (e) {
    } finally {
      this.setState({loading: false});
    }
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
        this.setState({dataImage}, () => this.submitImage());
      });
    }
  };

  submitImage = async () => {
    const {dataImage} = this.state;
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
      this.setState({
        cover: response.data,
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({uploadImage: false});
    }
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  onPressSelect = type => {
    const {cityId} = this.state;
    switch (type) {
      case 1:
        this.setState({isVisible: true, dataSelect: cities, type});
        break;
      case 2:
        this.setState({
          isVisible: true,
          dataSelect: districts.filter(v => v.CityId === cityId),
          type,
        });
        break;
      default:
        break;
    }
  };

  hideSelect = () => {
    this.setState({visible: false});
  };

  onPressItemCity = item => {
    this.setState({
      cityId: item.Id,
      address: item.FullAddress,
      isVisible: false,
      districtId: null,
      dataSelect: cities,
    });
  };

  onPressItemDistrict = item => {
    this.setState({
      districtId: item.Id,
      address: item.FullAddress,
      isVisible: false,
    });
  };

  renderCityName = () => {
    const {cityId} = this.state;
    const item = cities?.find(v => v.Id === cityId);
    if (item) return item.Name;
    return 'Chọn tỉnh/thành phố';
  };

  renderDistrictName = () => {
    const {districtId} = this.state;
    const item = districts?.find(v => v.Id === districtId);
    if (item) return item.Name;
    return 'Chọn quận/huyện';
  };

  render() {
    const {navigation} = this.props;
    const {
      name,
      address,
      email,
      phone,
      isVisible,
      dataSelect,
      cityId,
      districtId,
      type,
      visible,
      dataImage,
      cover,
      uploadImage,
      loading,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <StatusBar backgroundColor="#FFF" animated barStyle="dark-content" />
        {navigation.state.params?.store_id ? (
          <View style={{marginTop: StatusBar.currentHeight}} />
        ) : null}
        <HeaderComponent
          navigation={navigation}
          left
          right
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title={
            navigation.state.params?.store_id
              ? 'Sửa gian hàng'
              : 'Thêm mới gian hàng'
          }
          onPressLeft={this.goBack}
        />
        <ProgressDialog
          visible={uploadImage}
          message="Vui lòng chờ giây lát..."
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginTop: 8}}>
            <TouchableOpacity
              style={{
                height: 180,
                borderRadius: 6,
                borderColor: '#D0C9D6',
                borderWidth: 2,
                margin: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => this.setState({visible: true})}>
              {cover ? (
                <Image
                  source={{uri: HOST_IMAGE_UPLOAD + JSON.parse(cover)[0]}}
                  style={{width: '100%', height: 176, borderRadius: 6}}
                />
              ) : (
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Icon
                    name={'add-a-photo'}
                    type={'MaterialIcons'}
                    style={{color: '#D0C9D6'}}
                  />
                  <Text style={{color: '#D0C9D6'}}>Thêm ảnh bìa</Text>
                </View>
              )}
            </TouchableOpacity>
            <View>
              <Text style={{marginLeft: 16}}>
                Tên gian hàng <Text style={{color: '#FF2D55'}}>(*)</Text>
              </Text>
              <View
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#CCC',
                }}>
                <TextInput
                  value={name}
                  onChangeText={text => this.setState({name: text})}
                  style={{marginLeft: 15, color: '#0D0E10'}}
                  placeholderTextColor="#CCC"
                />
              </View>
            </View>

            <View style={{marginTop: 8}}>
              <Text style={{marginLeft: 16}}>
                Địa chỉ <Text style={{color: '#FF2D55'}}>(*)</Text>
              </Text>
              <View
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#CCC',
                  padding: 16,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  style={{alignItems: 'center', flexDirection: 'row', flex: 1}}
                  onPress={() => this.onPressSelect(1)}>
                  <Text
                    style={{color: cityId ? '#0D0E10' : '#D0C9D6', flex: 1}}
                    numberOfLines={1}>
                    {this.renderCityName()}
                  </Text>
                  <Icon
                    name="chevron-down"
                    type="MaterialCommunityIcons"
                    style={{
                      marginHorizontal: 16,
                      fontWeight: 'normal',
                      fontSize: 18,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{alignItems: 'center', flexDirection: 'row', flex: 1}}
                  onPress={() => this.onPressSelect(2)}
                  disabled={!cityId}>
                  <Text
                    style={{color: districtId ? '#0D0E10' : '#D0C9D6', flex: 1}}
                    numberOfLines={1}>
                    {this.renderDistrictName()}
                  </Text>
                  <Icon
                    name="chevron-down"
                    type="MaterialCommunityIcons"
                    style={{
                      marginHorizontal: 16,
                      fontWeight: 'normal',
                      fontSize: 18,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{marginTop: 8}}>
              <Text style={{marginLeft: 16}}>Email</Text>
              <View
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#CCC',
                }}>
                <TextInput
                  value={email}
                  keyboardType={'email-address'}
                  onChangeText={text => this.setState({email: text})}
                  style={{marginLeft: 15, color: '#0D0E10'}}
                  placeholderTextColor="#CCC"
                />
              </View>
            </View>
            <View style={{marginTop: 8}}>
              <Text style={{marginLeft: 16}}>
                Số điện thoại <Text style={{color: '#FF2D55'}}>(*)</Text>
              </Text>
              <View
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#CCC',
                }}>
                <TextInput
                  value={phone}
                  keyboardType={'phone-pad'}
                  onChangeText={text => this.setState({phone: text})}
                  style={{marginLeft: 15, color: '#0D0E10'}}
                  placeholderTextColor="#CCC"
                />
              </View>
            </View>
          </View>
          {visible ? (
            <ImageBrowser
              max={1}
              hideSelect={this.hideSelect}
              visible={visible}
              callback={this.imageBrowserCallback}
              selectedCount={dataImage && dataImage.length}
            />
          ) : null}
        </ScrollView>

        <Modal
          style={styles.modal}
          isVisible={isVisible} // show the modal or not
          backdropOpacity={0.5}
          backdropColor={'rgba(0,0,0,.5)'}
          animationIn="fadeIn"
          animationOut="slideOutDown"
          animationInTiming={300}
          animationOutTiming={300}
          backdropTransitionInTiming={300}
          backdropTransitionOutTiming={0}
          useNativeDriver // defines if animations should use native driver
          onBackdropPress={() => this.setState({isVisible: false})}
          hideModalContentWhileAnimating>
          <View style={styles.androidWrapper}>
            <ScrollView>
              {dataSelect.map(item => (
                <TouchableOpacity
                  key={item.Id}
                  style={{...styles.androidActionButton}}
                  onPress={() =>
                    type === 1
                      ? this.onPressItemCity(item)
                      : this.onPressItemDistrict(item)
                  }
                  // disabled={selectedValue === item.Id}
                >
                  <Text style={styles.androidLabel}>{item.Name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>
        <TouchableOpacity
          style={{
            height: 48,
            borderRadius: 6,
            backgroundColor: name && address && phone ? '#00c068' : '#D0C9D6',
            margin: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          disabled={!name || !address || !phone}
          onPress={this.submit}>
          {loading ? (
            <ActivityIndicator color={'#FFF'} />
          ) : (
            <Text style={{color: '#FFF'}}>Lưu</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  androidActionButton: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc3',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  androidLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#062C3D',
  },
  highlight: {
    color: '#00c068',
  },
  androidWrapper: {
    maxHeight: 250,
    backgroundColor: '#FFF',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'green',
    // left: 10
  },
});

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(AddNewStore);
