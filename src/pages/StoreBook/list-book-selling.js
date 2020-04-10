import React, {PureComponent} from 'react';
import {
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  ImageBackground,
  Linking,
  RefreshControl,
  DeviceEventEmitter,
} from 'react-native';
import {connect} from 'react-redux';
import {Images} from '../../assets/image';
import FastImage from 'react-native-fast-image';
import {Icon, Text} from 'native-base';
import {formatDateNow, formatNumber} from '../../../components/until';
import HeaderSearch from '../../components/header-search';
import moment from 'moment';
import {getFromServer, postToServer} from '../../config';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../../config/server';

const ITEM_WIDTH = Dimensions.get('window').width;

class ListBookSelling extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      keySearch: '',
      info: null,
    };
  }

  async componentDidMount() {
    const {navigation} = this.props;
    const {store_id, user_id} = navigation.state.params;
    await this.getDetailStore(user_id);
    this.getData(store_id);
    this.listener = DeviceEventEmitter.addListener('LoadData', () =>
      this.onRefresh(),
    );

    this.listenerStore = DeviceEventEmitter.addListener('LoadStore', () =>
      this.getDetailStore(user_id),
    );
  }

  componentWillUnmount() {
    this.listener.remove();
    this.listenerStore.remove();
  }

  getDetailStore = async user_id => {
    const {accountInfo} = this.props;
    this.setState({uploadImage: true});
    try {
      const response = await getFromServer(getApiUrl(API.GET_DETAIL_STORE), {
        token: accountInfo.access_token.token,
        user_id,
      });
      if (response.status === 1) {
        this.setState({
          info: response.data,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({uploadImage: false});
    }
  };

  getData = async store_id => {
    const {accountInfo} = this.props;
    const {page, keySearch} = this.state;
    try {
      const response = await getFromServer(getApiUrl(API.LIST_DETAIL_STORE), {
        token: accountInfo.access_token.token,
        store_id,
        page,
        page_size: 16,
        keyword: keySearch,
      });
      this.setState({data: response.data[0]});
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({refreshing: false});
    }
  };

  updateExpired = async item => {
    const {accountInfo} = this.props;
    try {
      const response = await postToServer(getApiUrl(API.UPDATE_EXPIRED), {
        id: item.id,
        is_expired: item.is_expired === 0 ? 1 : 0,
        token: accountInfo.access_token.token,
      });
      if (response.status === 1) {
        DeviceEventEmitter.emit('LoadData');
        this.onRefresh();
      }
    } catch (e) {
      console.log(e);
    }
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  renderItemMyStore = ({item}) => {
    const {navigation, accountInfo} = this.props;
    const {data} = this.state;
    const today = moment().format('YYYY-MM-DD');
    let isNew = 'HOT';
    if (moment(item.created_at).format('YYYY-MM-DD') === today) {
      isNew = 'NEW';
    }
    const newImage = item.image ? JSON.parse(item.image) : null;
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate('DetailBookScreen', {
            id: item.id,
            item: {...item, ...data},
            newImage,
          })
        }>
        <View style={styles.contentContainer}>
          <FastImage
            style={styles.imageBackground}
            source={
              newImage?.length > 0
                ? {
                    uri: HOST_IMAGE_UPLOAD + newImage[0],
                    priority: FastImage.priority.normal,
                  }
                : Images.thumbdefault
            }
            resizeMode="cover"
          />
          <View
            style={{
              position: 'absolute',
              backgroundColor:
                isNew === 'NEW'
                  ? 'rgba(30,234,51,0.46)'
                  : 'rgba(234,25,106,0.71)',
              paddingHorizontal: 6,
              paddingVertical: 2,
              left: 8,
              top: 8,
              borderRadius: 4,
            }}>
            <Text style={{color: '#FFF'}}>{isNew}</Text>
          </View>
          <View style={styles.content}>
            <Text style={styles.name} numberOfLines={2}>
              {item.title_book}
            </Text>
            <View style={{height: 30}}>
              <Text style={styles.address} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <View style={styles.smallContent}>
              <Text style={styles.price}>{formatNumber(item.price)} VNĐ</Text>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.postTime}>
                {formatDateNow(item.created_at)}
              </Text>
              <TouchableOpacity
                disabled={data.user_id !== accountInfo.id}
                onPress={() => this.updateExpired(item)}>
                <Text
                  style={{
                    color: item.is_expired === 0 ? '#00c068' : '#FF2D55',
                    textTransform: 'uppercase',
                  }}>
                  {item.is_expired === 0 ? 'Chưa bán' : 'Đã bán'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  onChangeText = keySearch => {
    this.setState({keySearch});
  };

  doSearch = () => {
    this.onRefresh();
  };

  sendEmail = email => {
    try {
      const supported = Linking.canOpenURL(`mailto:${email}`);
      if (supported) Linking.openURL(`mailto:${email}`);
    } catch (e) {
      console.log(e);
    }
  };

  callCustomer = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  onRefresh = async () => {
    const {navigation} = this.props;
    const {store_id} = navigation.state.params;
    await this.setState({refreshing: true, page: 1});
    this.getData(store_id);
  };

  refreshControl() {
    const {refreshing} = this.state;
    return (
      <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
    );
  }

  render() {
    const {navigation, accountInfo} = this.props;
    const {data, keySearch, refreshing, info} = this.state;
    const {store_id} = navigation.state.params;
    return (
      <View style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          animated
          barStyle="light-content"
        />

        <View
          style={{
            marginTop: StatusBar.currentHeight,
            position: 'absolute',
            width: '100%',
            zIndex: 99999,
          }}>
          <HeaderSearch
            ref={ref => {
              this.headerSearch = ref;
            }}
            placeholder="Tìm kiếm theo tiêu đề sách,..."
            onPress={this.goBack}
            autoFocus={false}
            text={keySearch}
            onSearch={this.doSearch}
            onHaveText={this.onChangeText}
          />
        </View>
        <ScrollView
          refreshing={refreshing}
          refreshControl={this.refreshControl()}>
          <ImageBackground
            source={
              info?.cover
                ? {
                    uri: HOST_IMAGE_UPLOAD + JSON.parse(info?.cover)[0],
                  }
                : Images.thumbdefault
            }
            style={{
              width: '100%',
              height: 200,
              borderBottomLeftRadius: 6,
              borderBottomRightRadius: 6,
            }}
          />
          <View style={{margin: 16}}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{marginLeft: 5, fontSize: 20, color: '#0D0E10'}}>
                {info?.name}
              </Text>
            </View>
          </View>

          <View style={{margin: 16}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{width: 4, height: 24, backgroundColor: '#00c068'}}
              />
              <Text style={{marginLeft: 5, fontSize: 18}}>
                Thông tin gian hàng
              </Text>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 16,
                }}>
                <Icon
                  name={'store'}
                  type={'MaterialIcons'}
                  style={{fontSize: 20, color: '#A7A9BC', width: 30}}
                />
                <Text style={{color: '#A7A9BC', fontSize: 16, marginLeft: 8}}>
                  {info?.store_user}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 8,
                }}>
                <Icon
                  name={'location-on'}
                  type={'MaterialIcons'}
                  style={{fontSize: 20, color: '#A7A9BC', width: 30}}
                />
                <Text style={{color: '#A7A9BC', fontSize: 16, marginLeft: 8}}>
                  {info?.address}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 8,
                }}>
                <Icon
                  name={'settings-phone'}
                  type={'MaterialIcons'}
                  style={{fontSize: 18, color: '#A7A9BC', width: 30}}
                />
                <Text style={{color: '#A7A9BC', fontSize: 16, marginLeft: 8}}>
                  {info?.phone}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 8,
                }}>
                <Icon
                  name={'email'}
                  type={'MaterialIcons'}
                  style={{fontSize: 18, color: '#A7A9BC', width: 30}}
                />
                <Text style={{color: '#A7A9BC', fontSize: 16, marginLeft: 8}}>
                  {info?.email}
                </Text>
              </View>
              {info?.user_id !== accountInfo.id ? (
                <View style={{flexDirection: 'row', marginTop: 16}}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: '#00c068',
                      height: 48,
                      borderRadius: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => this.callCustomer(data.phone)}>
                    <Text style={{color: '#FFF', fontSize: 18}}>Liên hệ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      borderColor: '#00c068',
                      height: 48,
                      borderWidth: 1,
                      borderRadius: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: 16,
                    }}
                    onPress={() => this.sendEmail(data.email)}>
                    <Text style={{color: '#00c068', fontSize: 18}}>Chat</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{flexDirection: 'row', marginTop: 16}}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: '#00c068',
                      height: 48,
                      borderRadius: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() =>
                      navigation.navigate('AddNewStoreScreen', {store_id})
                    }>
                    <Text style={{color: '#FFF', fontSize: 18}}>
                      Chỉnh sửa thông tin
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View style={{marginHorizontal: 16, marginVertical: 8}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{width: 4, height: 24, backgroundColor: '#00c068'}}
              />
              <Text style={{marginLeft: 5, fontSize: 18}}>Sách đang bán</Text>
            </View>
          </View>
          <FlatList
            contentContainerStyle={{paddingHorizontal: 16}}
            data={data.list}
            keyExtractor={item => String(item.id)}
            renderItem={this.renderItemMyStore}
            showsHorizontalScrollIndicator={false}
          />
        </ScrollView>
        {data.user_id === accountInfo.id && (
          <View style={{position: 'absolute', bottom: 50, right: 20}}>
            <TouchableOpacity
              style={{
                borderRadius: 32,
                width: 64,
                height: 64,
                backgroundColor: '#00c068',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={() =>
                navigation.navigate('AddNewBookScreen', {
                  store_id,
                  name: data.name,
                })
              }>
              <Icon name={'md-add'} type={'Ionicons'} style={{color: '#FFF'}} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF'},
  item: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    marginVertical: 8,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    height: 128,
    flexDirection: 'row',
  },
  content: {
    flex: 2,
    flexDirection: 'column',
    height: 128,
    marginLeft: 10,
    marginRight: 10,
  },
  imageBackground: {
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    width: 128,
    height: 128,
  },
  postTime: {
    fontFamily: 'SF Pro Text',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: '#9B9B9B',
  },
  name: {
    color: '#0D0E10',
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 17,
    marginBottom: 4,
    marginTop: 10,
  },
  address: {
    color: '#505D68',
    fontFamily: 'SF Pro Text',
    fontSize: 11,
    lineHeight: 16,
  },
  smallContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 24,
    marginTop: 8,
  },
  acreage: {
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    color: '#3AA2DD',
    fontWeight: 'bold',
    lineHeight: 24,
  },
  price: {
    fontFamily: 'SF Pro Text',
    fontSize: 12,
    color: '#3AA2DD',
    fontWeight: '500',
    lineHeight: 16,
  },
  priority: {
    top: 8,
    left: 8,
    position: 'absolute',
    fontFamily: 'SF Pro Text',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 14,
    color: '#FFF',
    paddingVertical: 2,
    paddingHorizontal: 3,
    borderRadius: 3,
    textAlign: 'center',
  },
});

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(ListBookSelling);
