import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  Linking,
  FlatList,
  Platform,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {Icon} from 'native-base';
import FastImage from 'react-native-fast-image';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../../config/server';
import {Images} from '../../assets/image';
import {formatNumber} from '../../../components/until';
import ShowImageView from '../../../components/show-image-view';
import {connect} from 'react-redux';
import {getFromServer} from '../../config';

class DetailBook extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      image: [],
      showImage: false,
    };
  }

  componentDidMount = () => {
    const {navigation} = this.props;
    const {item, newImage} = navigation.state.params;
    // this.getData();
    this.setState({data: item, image: newImage});
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  sendEmail = email => {
    try {
      const supported = Linking.canOpenURL(`mailto:${email}`);
      if (supported)
        Linking.openURL(
          `mailto:${email}?subject=MUA SÁCH&body=Tôi muốn mua cuốn sách của bạn`,
        );
    } catch (e) {
      console.log(e);
    }
  };

  callCustomer = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  showModalImage = (state, index) => {
    if (Platform.OS === 'android') {
      StatusBar.setHidden(state, 'slide');
      StatusBar.setBarStyle('dark-content');
    }
    this.setState({showImage: state});
  };

  render() {
    const {navigation, accountInfo} = this.props;
    const {data, image, showImage} = this.state;
    console.log(data);
    console.log(image);
    return (
      <View style={{flex: 1}}>
        <StatusBar backgroundColor="#FFF" animated barStyle="dark-content" />
        <ScrollView style={{flex: 1}}>
          {image && image.length > 0 ? (
            <View style={{height: 250}}>
              <Swiper
                removeClippedSubviews
                showsButtons={false}
                automaticallyAdjustContentInsets
                autoplayTimeout={5}
                animated
                showsPagination
                activeDot={<View style={styles.activeDot} />}
                autoplay={true}>
                {image?.map(item => {
                  return (
                    <View style={styles.slide1}>
                      <FastImage
                        source={{
                          uri: HOST_IMAGE_UPLOAD + item,
                        }}
                        style={{width: '100%', height: 250}}
                      />
                    </View>
                  );
                })}
              </Swiper>
            </View>
          ) : (
            <View style={{height: 250}}>
              <Swiper
                removeClippedSubviews
                showsButtons={false}
                automaticallyAdjustContentInsets
                autoplayTimeout={5}
                animated
                showsPagination
                activeDot={<View style={styles.activeDot} />}
                autoplay={false}>
                <View style={styles.slide1}>
                  <FastImage
                    source={Images.thumbdefault}
                    style={{width: '100%', height: 250}}
                  />
                </View>
              </Swiper>
            </View>
          )}
          {image && image.length > 0 ? (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={image}
              keyExtractor={() => String(Math.random())}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{margin: 16}}
                  onPress={this.showModalImage.bind(this, true, 0)}>
                  <Image
                    source={{uri: HOST_IMAGE_UPLOAD + item}}
                    style={{width: 60, height: 80, borderRadius: 6}}
                  />
                </TouchableOpacity>
              )}
            />
          ) : null}
          <View style={{padding: 16}}>
            <View>
              <Text style={{fontSize: 20, color: '#0D0E10'}}>
                {data.title_book}
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: '#a7a9bc',
                  lineHeight: 18,
                  marginTop: 16,
                }}>
                {data.description}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{marginTop: 16, fontSize: 18}}>Giá: </Text>
                <Text
                  style={{
                    fontSize: 30,
                    color: '#00c068',
                    marginTop: 8,
                    flex: 1,
                  }}>
                  {formatNumber(data.price)} đ
                </Text>
                <TouchableOpacity style={{marginTop: 16}} disabled>
                  <Text
                    style={{
                      color: data.is_expired === 0 ? '#00c068' : '#FF2D55',
                      textTransform: 'uppercase',
                    }}>
                    {data.is_expired === 0 ? 'Chưa bán' : 'Đã bán'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              borderTopColor: '#CCC',
              borderBottomWidth: 1,
              borderTopWidth: 1,
              borderBottomColor: '#CCC',
              padding: 16,
            }}>
            <Text>Thông tin gian hàng: </Text>
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
                {data.store_user}
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
                {data.address}
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
                {data.phone}
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
                {data.email}
              </Text>
            </View>
            {data.user_id !== accountInfo.id ? (
              <View style={{flexDirection: 'row', marginTop: 16}}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: '#00c068',
                    height: 32,
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
                    height: 32,
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
            ) : null}
          </View>
          {/* <View style={{padding: 16}}>
            <Text style={{fontSize: 16, color: '#a7a9bc'}}>
              Sách cùng gian hàng
            </Text>
          </View> */}
        </ScrollView>

        <ShowImageView
          showGallery={showImage}
          onRequestClose={this.showModalImage.bind(this, false, 0)}
          onClosePress={this.showModalImage.bind(this, false, 0)}
          initPage={0}
          image={image && image.length > 0 ? image : []}
        />

        <View style={{position: 'absolute'}}>
          <TouchableOpacity style={styles.close} onPress={this.goBack}>
            <Icon
              name={'close'}
              type={'AntDesign'}
              style={{color: '#FFF', fontSize: 20}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  slide1: {
    flex: 1,
  },
  activeDot: {
    backgroundColor: '#00c068',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  close: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    left: 20,
    marginTop: 35,
  },
});

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(DetailBook);
