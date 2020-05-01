import React, {PureComponent} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Dimensions,
} from 'react-native';
import HeaderComponent from '../../components/headerComponents';
import {connect} from 'react-redux';
import {Icon, Toast} from 'native-base';
import Modal from 'react-native-modal';
import {dispatchParams, getFromServer, postToServer} from '../../config';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../../config/server';
import FastImage from 'react-native-fast-image';
import {setWidth} from '../../cores/baseFuntion';
import {Images} from '../../assets/image';
import {formatNumber} from '../../../components/until';
import {accountActionTypes} from '../../actions/type';
import {LazyLoadingProduct} from '../../../components/lazy-load';
import {saveAccountInfo} from '../../config/storage';
import color from '../../assets/static-data/color';
const {width: dvWidth} = Dimensions.get('window');
class ListCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      select: null,
      loading: false,
      success: false,
      infoCard: false,
      lazy: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const {accountInfo} = this.props;
    this.setState({lazy: true, data: []});
    try {
      const response = await getFromServer(getApiUrl(API.LIST_CARD), {
        token: accountInfo.access_token.token,
        // money: '10.000',
      });
      this.setState({data: response.data});
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({lazy: false});
    }
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  selectCard = item => {
    const {data, select} = this.state;
    const {accountInfo} = this.props;
    console.log(accountInfo.coin);
    if (Number(accountInfo.coin) < Number(item.money.replace('.', ''))) {
      Toast.show({
        text: 'Số điểm hiện tại của bạn không đủ',
        position: 'center',
        duration: 2500,
        type: 'warning',
      });
      return;
    }
    if (select === item.id) {
      this.setState({select: null, infoCard: null});
    } else {
      this.setState({select: item.id, infoCard: item});
    }
  };

  skip = async () => {
    let {accountInfo} = this.props;
    const {select, infoCard} = this.state;
    this.setState({loading: true});
    try {
      const response = await postToServer(getApiUrl(API.CARD_UPDATE), {
        token: accountInfo.access_token.token,
        card_id: select,
        status: 1,
      });
      if (response.status === 1) {
        const newCoin =
          accountInfo.coin - Number(infoCard.money.replace('.', ''));
        this.updateCoin(newCoin);
        this.setState({success: true});
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({loading: false});
    }
  };

  updateCoin = async newCoin => {
    const {accountInfo} = this.props;
    try {
      const response = await postToServer(getApiUrl(API.UPDATE_COIN), {
        user_id: accountInfo.id,
        token: accountInfo.access_token.token,
        coin: newCoin,
      });
      if (response.status === 1) {
        this.props.dispatchParams(
          {
            ...accountInfo,
            coin: newCoin,
          },
          accountActionTypes.APP_USER_INFO,
        );
        saveAccountInfo({
          ...accountInfo,
          coin: newCoin,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  charge = phone => {
    Linking.openURL(`tel:*100*${phone}#`);
  };

  dismissSuccess = () => {
    Alert.alert(
      'Bạn có chắc muốn thoát?',
      'Nạp thẻ trước khi thoát khỏi màn hình này !',
      [
        {text: 'Hủy'},
        {
          text: 'Thoát',
          onPress: () =>
            this.setState({success: false, infoCard: null, select: null}, () =>
              this.getData(),
            ),
        },
      ],
    );
  };

  renderViewSuccess = () => {
    const {infoCard} = this.state;
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFF',
        }}>
        <View
          style={{
            width: dvWidth - 32,
            backgroundColor: '#fff',
            shadowColor: '#000',
            alignItems: 'center',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            borderRadius: 6,
          }}>
          <Text style={{fontWeight: 'bold', margin: 16}}>
            E BOOK - SÁCH ĐIỆN TỬ
          </Text>
          <Text
            style={{
              fontSize: 17,
              paddingHorizontal: 32,
              textAlign: 'center',
              color: '#3F3356',
            }}>
            Chúc mừng bạn đã đổi thẻ cào thành công !!!
          </Text>
          <View>
            <TouchableOpacity
              style={{
                borderRadius: 6,
                width: setWidth('90%'),
                justifyContent: 'center',
                marginTop: 16,
              }}
              disabled>
              <Text style={{fontSize: 16, marginLeft: 16, color: '#A7A9BC'}}>
                Số seri:
                <Text style={{color: color.primaryColor}}>
                  {' '}
                  {infoCard.serial}
                </Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderRadius: 6,
                width: setWidth('90%'),
                justifyContent: 'center',
                marginTop: 16,
              }}
              disabled
              onPress={() => this.charge(infoCard.code)}>
              <Text style={{fontSize: 16, marginLeft: 16, color: '#A7A9BC'}}>
                Mã thẻ:
                <Text style={{color: color.primaryColor}}>
                  {' '}
                  {infoCard.code}
                </Text>
              </Text>
            </TouchableOpacity>

            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                marginBottom: 16,
              }}>
              <TouchableOpacity
                style={{
                  height: 32,
                  borderRadius: 6,
                  width: setWidth('35%'),
                  backgroundColor: color.primaryColor,
                  justifyContent: 'center',
                  marginTop: 16,
                }}
                onPress={() => this.charge(infoCard.code)}>
                <Text
                  style={{
                    color: '#FFF',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    fontSize: 17,
                  }}>
                  Nạp ngay
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  height: 32,
                  borderRadius: 6,
                  width: setWidth('35%'),
                  backgroundColor: '#FFF',
                  borderColor: color.primaryColor,
                  borderWidth: 1,
                  justifyContent: 'center',
                  marginTop: 16,
                  marginLeft: 16,
                }}
                onPress={this.dismissSuccess}>
                <Text
                  style={{
                    color: color.primaryColor,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    fontSize: 17,
                  }}>
                  Quay lại
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const {navigation, accountInfo} = this.props;
    const {data, select, loading, success, lazy} = this.state;
    if (success) return this.renderViewSuccess();
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <HeaderComponent
          navigation={navigation}
          left
          right
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title="Danh sách thẻ cào"
          onPressLeft={this.goBack}
        />

        <View style={{paddingHorizontal: 16, paddingVertical: 8}}>
          <Text style={{fontSize: 24}}>
            Điểm hiện tại:{' '}
            <Text style={{fontSize: 24}}>{formatNumber(accountInfo.coin)}</Text>
          </Text>
          <Text style={{color: '#AAA'}}>
            Dùng số điểm tương ứng với số tiền để quy đổi thẻ cào.
          </Text>
        </View>
        <LazyLoadingProduct length={4} visible={lazy} />
        <FlatList
          data={data}
          numColumns={2}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => this.selectCard(item)}>
              <View
                style={{
                  backgroundColor: '#FFF',
                  alignItems: 'center',
                  width: setWidth('50%'),
                  borderBottomWidth: 0.5,
                  borderBottomColor: '#ccc',
                  borderRightWidth: 0.5,
                  borderRightColor: '#ccc',
                  padding: 16,
                  flex: 1,
                }}>
                <FastImage
                  source={{uri: HOST_IMAGE_UPLOAD + item.logo}}
                  style={{width: 150, height: 50}}
                  resizeMode="contain"
                />
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Text
                    style={{
                      color: '#000',
                      fontSize: 24,
                      textAlign: 'center',
                      marginTop: 8,
                    }}>
                    {item.money} VNĐ
                  </Text>
                </View>
                {select === item.id && (
                  <Icon
                    name="ios-checkmark-circle"
                    type="Ionicons"
                    style={{
                      color: color.primaryColor,
                      marginRight: 16,
                      fontSize: 18,
                      position: 'absolute',
                      right: 10,
                      top: 5,
                    }}
                  />
                )}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={() => String(Math.random())}
        />
        {select && (
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 48,
              backgroundColor: color.primaryColor,
            }}
            onPress={this.skip}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={{color: '#FFF'}}>TIẾP TỤC</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  saf: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

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
)(ListCard);
