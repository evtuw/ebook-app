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
  StatusBar,
  FlatList,
  DeviceEventEmitter,
} from 'react-native';
import {Icon} from 'native-base';
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

class AddNewBook extends PureComponent {
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
      image: null,
      visible: false,
      dataImage: [],
      description: '',
      price: '',
      category_id: null,
      categories: [],
    };
  }

  componentDidMount = () => {
    this.getCategory();
  };

  getCategory = async () => {
    const {accountInfo} = this.props;
    try {
      const response = await getFromServer(getApiUrl(API.CATEGORY), {
        token: accountInfo.access_token.token,
        page: 1,
        page_size: 50,
      });
      this.setState({categories: response.data});
    } catch (e) {
      console.log(e);
    }
  };

  submit = async () => {
    const {accountInfo, navigation} = this.props;
    const {name, category_id, description, price, image} = this.state;
    const {store_id} = navigation.state.params;
    this.setState({loading: true});
    try {
      const data = {
        name,
        store_id,
        category_id,
        description,
        price,
        image: JSON.stringify(image),
        user_id: accountInfo.id,
        token: accountInfo.access_token.token,
      };
      const response = await postToServer(getApiUrl(API.ADD_STORE_BOOK), data);
      if (response.status === 1) {
        DeviceEventEmitter.emit('LoadData');
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
    const {dataImage, image} = this.state;
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
      const newImage = JSON.parse(response.data);
      this.setState({
        image: newImage,
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
    const {cityId, categories} = this.state;
    switch (type) {
      case 1:
        this.setState({isVisible: true, dataSelect: categories, type});
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
      category_id: item.cid,
      isVisible: false,
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
    const {categories, category_id} = this.state;
    const item = categories?.find(v => v.cid === category_id);
    if (item) return item.category_name;
    return 'Chọn thể loại';
  };

  renderDistrictName = () => {
    const {districtId} = this.state;
    const item = districts?.find(v => v.Id === districtId);
    if (item) return item.Name;
    return 'Chọn quận/huyện';
  };

  renderImage = ({item}) => (
    <View style={{marginHorizontal: 8, marginVertical: 16}}>
      <Image
        source={{uri: HOST_IMAGE_UPLOAD + item}}
        style={{width: 80, height: 80, borderRadius: 6}}
      />
      <TouchableOpacity
        style={{position: 'absolute', right: 8, top: 5}}
        onPress={() => this.removeImage(item)}>
        <Icon
          name={'ios-close-circle'}
          type={'Ionicons'}
          style={{color: '#FFF', fontSize: 24}}
        />
      </TouchableOpacity>
    </View>
  );

  removeImage = item => {
    const {image} = this.state;
    this.setState({
      image: image.filter(v => v !== item),
    });
  };

  render() {
    const {navigation} = this.props;
    const {name: nameStore} = navigation.state.params;
    const {
      name,
      isVisible,
      dataSelect,
      category_id,
      type,
      visible,
      dataImage,
      uploadImage,
      loading,
      image,
      description,
      price,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <StatusBar backgroundColor="#FFF" animated barStyle="dark-content" />
        <View style={{marginTop: StatusBar.currentHeight}} />
        <HeaderComponent
          navigation={navigation}
          left
          right
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title={'Thêm mới sách'}
          onPressLeft={this.goBack}
        />
        <ProgressDialog
          visible={uploadImage}
          message="Vui lòng chờ giây lát..."
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginTop: 8}}>
            <FlatList
              data={image}
              renderItem={this.renderImage}
              ListHeaderComponent={() => (
                <TouchableOpacity
                  style={{
                    height: 80,
                    borderRadius: 6,
                    borderColor: '#D0C9D6',
                    borderWidth: 2,
                    margin: 16,
                    width: 80,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({visible: true})}>
                  <View
                    style={{alignItems: 'center', justifyContent: 'center'}}>
                    <Icon
                      name={'add-a-photo'}
                      type={'MaterialIcons'}
                      style={{color: '#D0C9D6'}}
                    />
                    <Text style={{color: '#D0C9D6'}}>Thêm ảnh</Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={() => String(Math.random())}
              horizontal
              contentContainerStyle={{flex: 1, flexWrap: 'wrap'}}
            />
            <View>
              <Text style={{marginLeft: 16}}>
                Tên sách <Text style={{color: '#FF2D55'}}>(*)</Text>
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
              <Text style={{marginLeft: 16}}>Gian hàng</Text>
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
                  disabled>
                  <Text
                    style={{
                      color: category_id ? '#0D0E10' : '#D0C9D6',
                      flex: 1,
                    }}
                    numberOfLines={1}>
                    {nameStore}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{marginTop: 8}}>
              <Text style={{marginLeft: 16}}>
                Giá tiền <Text style={{color: '#FF2D55'}}>(*)</Text>
              </Text>
              <View
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#CCC',
                }}>
                <TextInput
                  value={price}
                  keyboardType={'numeric'}
                  onChangeText={text => this.setState({price: text})}
                  style={{marginLeft: 15, color: '#0D0E10'}}
                  placeholderTextColor="#CCC"
                />
              </View>
            </View>
            <View style={{marginTop: 8}}>
              <Text style={{marginLeft: 16}}>Thể loại</Text>
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
                    style={{
                      color: category_id ? '#0D0E10' : '#D0C9D6',
                      flex: 1,
                    }}
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
              </View>
            </View>
            <View style={{marginTop: 8}}>
              <Text style={{marginLeft: 16}}>Mô tả</Text>
              <View
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#CCC',
                }}>
                <TextInput
                  value={description}
                  multiline
                  maxLength={200}
                  onChangeText={text => this.setState({description: text})}
                  style={{marginLeft: 15, color: '#0D0E10'}}
                  placeholderTextColor="#CCC"
                />
                <Text
                  style={{
                    textAlign: 'right',
                    marginRight: 16,
                    marginBottom: 8,
                    color: '#A7A9BC',
                  }}>
                  {description.length} / 200 ký tự
                </Text>
              </View>
            </View>
          </View>
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
                  <Text style={styles.androidLabel}>{item.category_name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Modal>
        <TouchableOpacity
          style={{
            height: 48,
            borderRadius: 6,
            backgroundColor: name && price ? '#00c068' : '#D0C9D6',
            margin: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          disabled={!name || !price}
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

export default connect(mapStateToProps)(AddNewBook);
