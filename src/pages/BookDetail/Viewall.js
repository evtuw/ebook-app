import React, {PureComponent} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';
import {Icon} from 'native-base';
import HTML from 'react-native-render-html';
import HTMLView from 'react-native-htmlview';
import Drawer from 'react-native-drawer';
import HeaderComponent from '../../components/headerComponents';
import {dispatchParams, postToServer} from '../../config';
import {API, getApiUrl} from '../../config/server';
import {accountActionTypes} from '../../actions/type';
import {Images} from '../../assets/image';
import {setHeight} from '../../cores/baseFuntion';
import {saveAccountInfo} from '../../config/storage';
import colors from '../../assets/static-data/color';
// import TrackPlayer, {usePlaybackState} from 'react-native-track-player';

class Viewall extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showFont: false,
      showColor: false,
      size: 15,
      color: 'black',
      theme: {
        backgroundColor: 'white',
        style: 'dark-content',
      },
      showTheme: false,
      modalCoin: false,
      loading: true,
    };
  }

  componentDidMount() {
    // const TIMEOUT = 1000;
    setTimeout(() => {
      this.setState({loading: false});
    }, 300);
    const TIMEOUT = 120000;
    this.timeout = setTimeout(() => {
      this.updateCoin();
    }, TIMEOUT);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  updateCoin = async () => {
    const {accountInfo} = this.props;
    try {
      const response = await postToServer(getApiUrl(API.UPDATE_COIN), {
        user_id: accountInfo.id,
        token: accountInfo.access_token.token,
        coin: Number(accountInfo.coin) + 100,
      });
      if (response.status === 1) {
        this.props.dispatchParams(
          {
            ...accountInfo,
            coin: Number(accountInfo.coin) + 100,
          },
          accountActionTypes.APP_USER_INFO,
        );
        saveAccountInfo({
          ...accountInfo,
          coin: Number(accountInfo.coin) + 100,
        });
        this.setState({modalCoin: true});
      }
    } catch (e) {
      console.log(e);
    }
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  changeTheme = type => {
    let theme = {
      backgroundColor: 'white',
      style: 'dark-content',
    };
    if (type === 'black') {
      theme = {
        backgroundColor: 'black',
        style: 'light-content',
      };
      this.setState({theme, color: 'white', showTheme: false});
      return;
    }
    this.setState({theme, color: 'black', showTheme: false});
  };

  onChangeColor = newColor => {
    this.setState({color: newColor});
    this.forceUpdate();
  };

  onChangeSize = size => {
    this.setState({size});
    this.forceUpdate();
  };

  render() {
    const {navigation} = this.props;
    const {theme, modalCoin, loading, color, size} = this.state;
    const {data} = navigation.state.params;
    console.log(data.content_html);
    return (
      <Drawer
        content={
          <View
            style={{
              flex: 1,
              backgroundColor: theme.backgroundColor,
              borderLeftWidth: 0.8,
              borderLeftColor: '#CCC5',
              paddingTop: StatusBar.currentHeight,
            }}>
            <View style={{padding: 16}}>
              <Text
                style={{
                  fontSize: 18,
                  color: theme.backgroundColor === 'black' ? 'white' : 'black',
                }}>
                Màu chữ
              </Text>
              <FlatList
                data={[
                  'red',
                  'blue',
                  'green',
                  'yellow',
                  'pink',
                  'violet',
                  'brown',
                  'purple',
                  'orange',
                  'skyblue',
                  'limegreen',
                  'aqua',
                  'darkcyan',
                  'navy',
                  'black',
                ]}
                horizontal
                contentContainerStyle={{
                  flex: 1,
                  flexWrap: 'wrap',
                  marginTop: 16,
                }}
                keyExtractor={item => item.toString()}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      style={{width: 40, height: 40}}
                      disabled={color === item}
                      onPress={() => this.onChangeColor(item)}>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          backgroundColor: item,
                        }}
                      />
                      {color === item ? (
                        <View
                          style={{
                            position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'center',
                            top: 3,
                            left: 5,
                          }}>
                          <Icon
                            name={'check'}
                            type={'Feather'}
                            style={{
                              color: '#FFF',
                              fontSize: 16,
                              fontWeight: 'bold',
                            }}
                          />
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
            <View style={{paddingHorizontal: 16}}>
              <Text
                style={{
                  fontSize: 18,
                  color: theme.backgroundColor === 'black' ? 'white' : 'black',
                }}>
                Cỡ chữ
              </Text>
              <FlatList
                data={[13, 15, 17, 19, 22, 24, 26]}
                keyExtractor={item => item.toString()}
                contentContainerStyle={{
                  marginTop: 16,
                }}
                ref={ref => {
                  this.scrollSize = ref;
                }}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      style={{
                        padding: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                          size === item ? colors.primaryColor : 'whitesmoke',
                        borderRadius: 24,
                        height: 48,
                        width: 48,
                        margin: 8,
                      }}
                      disabled={size === item}
                      onPress={() => {
                        this.onChangeSize(item);
                        this.scrollSize.scrollToIndex({animated: true, index});
                      }}>
                      <Text
                        style={{
                          color: size === item ? colors.white : 'black',
                          fontSize: item,
                        }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View style={{padding: 16}}>
              <Text
                style={{
                  fontSize: 18,
                  color: theme.backgroundColor === 'black' ? 'white' : 'black',
                }}>
                Giao diện đọc
              </Text>
              <FlatList
                data={['white', 'black']}
                keyExtractor={item => item.toString()}
                horizontal
                contentContainerStyle={{
                  flex: 1,
                  flexWrap: 'wrap',
                  marginTop: 16,
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      style={{marginRight: 16}}
                      disabled={theme.backgroundColor === item}
                      onPress={() => this.changeTheme(item)}>
                      <View
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: 4,
                          backgroundColor: item,
                          borderColor:
                            theme.backgroundColor === item
                              ? colors.primaryColor
                              : 'whitesmoke',
                          borderWidth: 1,
                        }}
                      />
                      {theme.backgroundColor === item ? (
                        <View style={{position: 'absolute', top: 5}}>
                          <Icon
                            name={'check'}
                            type={'EvilIcons'}
                            style={{color: colors.primaryColor}}
                          />
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        }
        type="static"
        openDrawerOffset={50}
        tweenHandler={Drawer.tweenPresets.parallax}
        tweenDuration={100}
        tapToClose
        side="right"
        ref={ref => {
          this.drawer = ref;
        }}>
        <View style={[styles.saf, {backgroundColor: theme.backgroundColor}]}>
          <StatusBar
            animated
            backgroundColor={theme.backgroundColor}
            barStyle={theme.style}
          />
          <HeaderComponent
            navigation={navigation}
            left
            right
            onPressRight={() => this.drawer.open()}
            style={{
              marginTop: StatusBar.currentHeight,
              backgroundColor: theme.backgroundColor,
            }}
            iconRight="setting"
            iconRightType={'AntDesign'}
            iconLeft="ios-arrow-back"
            iconLeftType="Ionicons"
            title={`${data.title.substring(0, 20)}...`}
            onPressLeft={this.goBack}
          />
          <ScrollView showsVerticalScrollIndicator={false}>
            {loading ? (
              <ActivityIndicator color={color.primaryColor} />
            ) : (
              <HTMLView
                value={data.content_html}
                stylesheet={{
                  p: {
                    color: color,
                    fontSize: size,
                    textAlign: 'justify',
                  },
                  div: {
                    color: color,
                    fontSize: size,
                    textAlign: 'justify',
                  },
                  h1: {
                    color: color,
                    fontSize: size,
                    textAlign: 'justify',
                  },
                  h2: {
                    color: color,
                    fontSize: size,
                    textAlign: 'justify',
                  },
                  h3: {
                    color: color,
                    fontSize: size,
                    textAlign: 'justify',
                  },
                  h4: {
                    color: color,
                    fontSize: size,
                    textAlign: 'justify',
                  },
                }}
                style={{padding: 16}}
              />
            )}
          </ScrollView>

          <Modal
            isVisible={modalCoin}
            backdropOpacity={0.5}
            backdropColor="#000"
            animationIn="fadeIn"
            animationOut="fadeOut"
            animationInTiming={300}
            animationOutTiming={300}
            backdropTransitionInTiming={300}
            backdropTransitionOutTiming={300}
            useNativeDriver
            hideModalContentWhileAnimating
            onBackdropPress={() => this.setState({modalCoin: false})}
            onBackButtonPress={() => this.setState({modalCoin: false})}
            style={styles.modal}>
            <View
              style={{
                width: Dimensions.get('window').width - 30,
                height: setHeight('52%'),
                backgroundColor: '#FFF',
                borderRadius: 4,
                alignItems: 'center',
              }}>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Image
                  source={Images.coinSuccess}
                  style={{width: 200, height: 200}}
                />
                <Text style={{fontSize: 22}}>Điểm đọc sách !!!</Text>
                <Text style={{fontSize: 28, textAlign: 'center'}}>
                  100 điểm
                </Text>
                <Text style={{paddingHorizontal: 8}}>
                  Đọc sách liền tay - Nhận ngay điểm thưởng
                </Text>
              </View>
              <View style={{paddingVertical: 16}}>
                <TouchableOpacity
                  style={{
                    width: 200,
                    height: 48,
                    borderRadius: 6,
                    borderColor: '#FF2D55',
                    borderWidth: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => this.setState({modalCoin: false})}>
                  <Text style={{color: '#FF2D55', fontSize: 18}}>Đọc tiếp</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 200,
                    height: 48,
                    borderRadius: 6,
                    backgroundColor: '#FF2D55',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 8,
                  }}
                  onPress={() => {
                    this.setState({modalCoin: false});
                    navigation.navigate('ListCardScreen');
                  }}>
                  <Text style={{color: '#FFF', fontSize: 18}}>
                    Đổi thẻ ngay
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </Drawer>
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
)(Viewall);
