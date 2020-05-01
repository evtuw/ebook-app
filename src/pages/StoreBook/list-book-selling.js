import React, {PureComponent} from 'react';
import {
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  ImageBackground,
  Linking,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {Images} from '../../assets/image';
import {Icon, Text} from 'native-base';
import HeaderSearch from '../../components/header-search';
import {getFromServer, postToServer} from '../../config';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../../config/server';
import DetailLoading from '../../../components/lazy-load/detail-loading';
import ItemBookSelling from './item-list/item-book-selling';

const ITEM_WIDTH = Dimensions.get('window').width;

class ListBookSelling extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      keySearch: '',
      info: null,
      loading: false,
      list: [],
      page: 1,
      endLoadMore: false,
      page_size: 50,
      loadExpired: false,
    };
  }

  async componentDidMount() {
    const {navigation} = this.props;
    const {store_id, user_id} = navigation.state.params;
    this.getDetailStore(user_id);
    await this.getData(store_id);
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
    const {page, keySearch, refreshing, list, page_size} = this.state;
    if (!refreshing) this.setState({loading: true});
    try {
      const response = await getFromServer(getApiUrl(API.LIST_DETAIL_STORE), {
        token: accountInfo.access_token.token,
        store_id,
        page,
        page_size,
        keyword: keySearch,
      });
      if (response.status === 1) {
        this.setState({
          data: response.data[0],
          list:
            page > 1
              ? [...list, ...response.data[0].list]
              : response.data[0].list,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({refreshing: false, loading: false, loadMore: false});
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
    const {data, loadExpired} = this.state;
    return (
      <ItemBookSelling
        updateExpired={this.updateExpired}
        loadExpired={loadExpired}
        data={data}
        item={item}
        navigation={navigation}
        accountInfo={accountInfo}
      />
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
    await this.setState({page: 1, refreshing: true});
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
    const {data, keySearch, refreshing, info, loading, list} = this.state;
    console.log(list);
    const {store_id} = navigation.state.params;
    if (loading) return <DetailLoading visible={loading} />;
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
            data={list}
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
  menuAction: {
    marginLeft: '40%',
    width: 154,
    height: 88,
    borderRadius: 8,
  },
  viewEmpty: {width: 10, height: 1},
  labelEdit: {
    color: '#3F3356',
    fontWeight: 'normal',
    fontSize: 15,
    bottom: 10,
  },
  labelRemove: {
    color: '#FF647C',
    fontWeight: 'normal',
    fontSize: 15,
    bottom: 10,
  },
});

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(ListBookSelling);
