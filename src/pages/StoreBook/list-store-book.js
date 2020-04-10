import React, {PureComponent} from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
  DeviceEventEmitter,
} from 'react-native';
import HeaderComponent from '../../components/headerComponents';
import {connect} from 'react-redux';
import {Images} from '../../assets/image';
import {setHeight, setWidth} from '../../cores/baseFuntion';
import FastImage from 'react-native-fast-image';
import {formatNumber} from '../../../components/until';
import {Icon} from 'native-base';
import {getFromServer} from '../../config';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../../config/server';

class ListStoreBook extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      myStore: [],
      data: [],
      info: null,
      page: 1,
      refreshing: false,
    };
  }

  async componentDidMount() {
    await this.getDetailStore();
    this.getOtherStore();
    this.getData();

    this.listener = DeviceEventEmitter.addListener('LoadData', () =>
      this.onRefresh(),
    );
    this.listenerStore = DeviceEventEmitter.addListener('LoadStore', () =>
      this.getDetailStore(),
    );
  }

  componentWillUnmount() {
    this.listener.remove();
    this.listenerStore.remove();
  }

  getDetailStore = async () => {
    const {accountInfo} = this.props;
    try {
      const response = await getFromServer(getApiUrl(API.GET_DETAIL_STORE), {
        token: accountInfo.access_token.token,
        user_id: accountInfo.id,
      });
      if (response.status === 1) {
        this.setState({
          info: response.data,
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  getData = async () => {
    const {accountInfo} = this.props;

    try {
      const response = await getFromServer(getApiUrl(API.LIST_STORE), {
        token: accountInfo.access_token.token,
      });
      if (response.status === 1) {
        this.setState({
          myStore: response.data.filter(v => v.user_id === accountInfo.id),
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({refreshing: false});
    }
  };

  getOtherStore = async () => {
    const {accountInfo} = this.props;
    const {page} = this.state;
    try {
      const response = await getFromServer(getApiUrl(API.GET_OTHER_STORE), {
        token: accountInfo.access_token.token,
        page,
        page_size: 16,
      });
      if (response.status === 1) {
        this.setState({
          data: response.data.filter(t => t.user_id !== accountInfo.id),
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({refreshing: false});
    }
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  renderItemMyStore = ({item}) => {
    const {navigation} = this.props;
    const newImage = item.image ? JSON.parse(item.image) : null;
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate('DetailBookScreen', {
            id: item.id,
            item,
            newImage,
          })
        }>
        <FastImage
          style={styles.image}
          source={
            newImage
              ? {
                  uri: HOST_IMAGE_UPLOAD + newImage[0],
                  priority: FastImage.priority.normal,
                }
              : Images.thumbdefault
          }
        />
        {item.is_expired === 1 ? (
          <View style={styles.investor}>
            <View style={styles.viewInvestor}>
              <Text style={styles.txtInvestor}>ĐÃ BÁN</Text>
            </View>
          </View>
        ) : null}
        <View style={styles.smallContainer}>
          <Text style={styles.price}>{formatNumber(item.price)} VNĐ</Text>
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {item.title_book}
        </Text>
        <Text style={styles.address} numberOfLines={1}>
          {item.address}
        </Text>
      </TouchableOpacity>
    );
  };

  renderOtherStore = ({item}) => {
    const {navigation, accountInfo} = this.props;

    return (
      <View style={{paddingVertical: 16}}>
        {item.user_id !== accountInfo.id ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {item.store_cover ? (
              <Image
                source={{
                  uri: HOST_IMAGE_UPLOAD + JSON.parse(item.store_cover)[0],
                }}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 23,
                  marginRight: 10,
                }}
              />
            ) : null}
            <Text style={{fontSize: 16, color: '#D0C9D6', flex: 1}}>
              Gian hàng của {item.store_author}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ListBookSelling', {
                  user_id: item.user_id,
                  store_id: item.id,
                })
              }>
              <Text style={{color: '#00c068'}}>Chi tiết gian hàng</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <FlatList
          data={item.list}
          keyExtractor={item => String(item.id)}
          renderItem={this.renderItemMyStore}
          horizontal
          ListFooterComponent={() =>
            item.list.length >= 3 ? (
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                }}
                onPress={() =>
                  navigation.navigate('ListBookSelling', {
                    user_id: item.user_id,
                    store_id: item.id,
                  })
                }>
                <Text style={{color: '#00c068'}}>Xem thêm</Text>
              </TouchableOpacity>
            ) : null
          }
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  onRefresh = async () => {
    await this.setState({refreshing: true, page: 1});
    this.getData();
    this.getOtherStore();
  };

  refreshControl() {
    const {refreshing} = this.state;
    return (
      <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
    );
  }

  render() {
    const {navigation} = this.props;
    const {data, myStore, info, refreshing} = this.state;
    return (
      <View style={styles.container}>
        <HeaderComponent
          navigation={navigation}
          left
          right
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title={'Gian hàng'}
          onPressLeft={this.goBack}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={this.refreshControl()}
          refreshing={refreshing}>
          <View style={{padding: 16}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={{fontSize: 16, color: '#D0C9D6'}}>
                Gian hàng của tôi
              </Text>
              {info !== null ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ListBookSelling', {
                      user_id: info.user_id,
                      store_id: info.id,
                    })
                  }>
                  <Text style={{color: '#00c068'}}>Chi tiết gian hàng</Text>
                </TouchableOpacity>
              ) : null}
            </View>
            <FlatList
              data={myStore}
              keyExtractor={item => String(item.id)}
              renderItem={this.renderOtherStore}
            />
          </View>
          <View style={{paddingHorizontal: 16}}>
            <FlatList
              data={data}
              keyExtractor={item => String(item.id)}
              renderItem={this.renderOtherStore}
            />
          </View>
        </ScrollView>
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
              info !== null
                ? navigation.navigate('ListBookSelling', {
                    store_id: info.id,
                    user_id: info.user_id,
                  })
                : navigation.navigate('AddNewStoreScreen')
            }>
            <Icon
              name={info !== null ? 'ios-book' : 'md-add'}
              type={'Ionicons'}
              style={{color: '#FFF'}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF'},
  item: {
    borderRadius: 8,
    width: 238,
    marginRight: 16,
    height: 260,
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
  smallContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 8,
  },
  image: {
    width: 238,
    height: 160,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  imagePrice: {
    height: 41,
    width: 39,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  name: {
    color: '#0D0E10',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'SF Pro Text',
    lineHeight: 22,
    marginHorizontal: 16,
  },
  address: {
    fontSize: 13,
    fontFamily: 'SF Pro Text',
    color: '#A7A9BC',
    lineHeight: 18,
    marginHorizontal: 16,
  },
  acreage: {
    fontFamily: 'SF Pro Display',
    fontSize: 12,
    color: '#00c068',
    fontWeight: '500',
    lineHeight: 16,
  },
  price: {
    fontFamily: 'SF Pro Display',
    fontSize: 17,
    color: '#00c068',
    fontWeight: '800',
    lineHeight: 16,
    marginVertical: 8,
  },
  priority: {
    top: 8,
    left: 8,
    position: 'absolute',
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 15,
    color: '#FFF',
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 3,
    textAlign: 'center',
  },
  investor: {
    position: 'absolute',
    left: 8,
    height: 40,
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgInvestor: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 8,
  },
  viewImg: {
    position: 'absolute',
    left: 50,
  },
  viewInvestor: {
    position: 'absolute',
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  txtInvestor: {
    fontFamily: 'SF Pro Text',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 11,
    color: '#FFF',
  },
  love: {
    position: 'absolute',
    top: 8,
    right: 16,
  },
});

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(ListStoreBook);
