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
    this.setState({lazy: true});
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
    if (accountInfo.coin < Number(item.money)) {
      Toast.show({
        text: 'Số điểm hiện tại của bạn không đủ',
        position: 'center',
        duration: 2500,
        type: 'warning',
      });
      // return;
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
        const newCoin = Number(accountInfo.coin) - Number(infoCard.money);
        accountInfo = {...accountInfo, coin: newCoin};
        this.props.dispatchParams(
          accountInfo,
          accountActionTypes.APP_USER_INFO,
        );
        this.setState({success: true});
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({loading: false});
    }
  };

  charge = phone => {
    Linking.openURL(`tel:${phone}`);
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
        <FastImage
          source={Images.imgSuccess}
          style={{height: 230, width: 230}}
          resizeMode="contain"
        />
        <Text
          style={{
            fontSize: 20,
            paddingHorizontal: 32,
            textAlign: 'center',
            color: '#3F3356',
          }}>
          Chúc mừng bạn đã đổi thẻ cào thành công, Nạp ngay thôi !!!
        </Text>
        <View>
          <TouchableOpacity
            style={{
              height: 48,
              borderRadius: 6,
              width: setWidth('90%'),
              backgroundColor: '#FFF',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              justifyContent: 'center',
              marginTop: 16,
            }}
            disabled>
            <Text style={{fontSize: 20, marginLeft: 16}}>
              Số seri:
              <Text style={{color: '#2D9CDB'}}>{infoCard.serial}</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 48,
              borderRadius: 6,
              width: setWidth('90%'),
              backgroundColor: '#FFF',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              justifyContent: 'center',
              marginTop: 16,
            }}
            onPress={() => this.charge(infoCard.code)}>
            <Text style={{fontSize: 20, marginLeft: 16}}>
              Mã thẻ:
              <Text style={{color: '#2D9CDB'}}>{infoCard.code}</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: 48,
              borderRadius: 6,
              width: setWidth('90%'),
              backgroundColor: '#F2994a',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              justifyContent: 'center',
              marginTop: 32,
            }}
            onPress={this.dismissSuccess}>
            <Text
              style={{
                color: '#FFF',
                textTransform: 'uppercase',
                textAlign: 'center',
                fontSize: 17,
              }}>
              Quay lại
            </Text>
          </TouchableOpacity>
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
                      color: '#F2994A',
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
              backgroundColor: '#F2994A',
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
