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
} from 'react-native';
import Modal from 'react-native-modal';
import {connect} from 'react-redux';

import HeaderComponent from '../../components/headerComponents';
import {dispatchParams, postToServer} from '../../config';
import {API, getApiUrl} from '../../config/server';
import {accountActionTypes} from '../../actions/type';
import {Images} from '../../assets/image';
import {setHeight} from '../../cores/baseFuntion';
import {saveAccountInfo} from '../../config/storage';
// import TrackPlayer, {usePlaybackState} from 'react-native-track-player';

const dataColor = [
  {color: 'red'},
  {color: 'blue'},
  {color: 'CHARTREUSE'},
  {color: 'green'},
  {color: 'yellow'},
  {color: 'STEELBLUE'},
  {color: 'pink'},
  {color: 'black'},
  {color: 'DARKKHAKI'},
  {color: 'purple'},
  {color: 'DARKRED'},
  {color: 'violet'},
  {color: 'silver'},
  {color: 'REBECCAPURPLE'},
  {color: 'crimson'},
  {color: 'FIREBRICK'},
  {color: 'TOMATO'},
  {color: 'OLIVEDRAB'},
];

const dataFont = [
  {
    label: 'Heading 1',
    size: 16,
  },
  {
    label: 'Heading 1',
    size: 20,
  },
  {
    label: 'Heading 1',
    size: 24,
  },
  {
    label: 'Heading 1',
    size: 28,
  },
  {
    label: 'Heading 1',
    size: 32,
  },
];

class Viewall extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showFont: false,
      showColor: false,
      size: 18,
      color: 'black',
      theme: {
        backgroundColor: 'white',
        style: 'dark-content',
      },
      showTheme: false,
      modalCoin: false,
    };
  }

  componentDidMount() {
    // const TIMEOUT = 1000;
    const TIMEOUT = 360000;
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
    if (type === 'dark') {
      theme = {
        backgroundColor: 'black',
        style: 'light-content',
      };
      this.setState({theme, color: 'white', showTheme: false});
      return;
    }
    this.setState({theme, color: 'black', showTheme: false});
  };

  render() {
    const {navigation} = this.props;
    const {
      showFont,
      showColor,
      size,
      color,
      theme,
      showTheme,
      modalCoin,
    } = this.state;
    const {data} = navigation.state.params;
    return (
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
          style={{
            marginTop: StatusBar.currentHeight,
            backgroundColor: theme.backgroundColor,
          }}
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title={data.title}
          onPressLeft={this.goBack}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              backgroundColor: 'rgba(255, 46, 84, 0.13)',
              borderRadius: 4,
              padding: 6,
              justifyContent: 'center',
            }}
            onPress={() => this.setState({showFont: true})}>
            <Text style={{fontSize: 14, color: '#ff2e54'}}>Cỡ chữ: </Text>
            <Text style={{color: '#ff2e54'}}>{size}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({showColor: true})}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              backgroundColor: 'rgba(255, 46, 84, 0.13)',
              borderRadius: 4,
              marginHorizontal: 8,
              padding: 6,
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 14, color: '#ff2e54'}}>Màu chữ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({showTheme: true})}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
              backgroundColor: 'rgba(255, 46, 84, 0.13)',
              borderRadius: 4,
              padding: 6,
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 14, color: '#ff2e54'}}>Giao diện</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <Text
            selectable
            style={{padding: 16, fontSize: size, textAlign: 'justify', color}}>
            {data.content}
          </Text>
        </ScrollView>
        <Modal
          isVisible={showTheme}
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
          onBackdropPress={() => this.setState({showTheme: false})}
          onBackButtonPress={() => this.setState({showTheme: false})}
          style={styles.modal}>
          <View
            style={{
              width: Dimensions.get('window').width - 30,
              height: 150,
              backgroundColor: 'whitesmoke',
              borderRadius: 4,
            }}>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  borderRadius: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => this.changeTheme('light')}>
                <View
                  style={{
                    width: 150,
                    backgroundColor: '#FFF',
                    margin: 8,
                    padding: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text numberOfLines={4}>
                    Lorem Ipsum has been the industry's standard dummy text ever
                    since the 1500s, when an unknown printer took a galley of
                    type and scrambled it to make a type specimen book.
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderRadius: 6,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => this.changeTheme('dark')}>
                <View
                  style={{
                    width: 150,
                    backgroundColor: '#000',
                    margin: 8,
                    padding: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{color: '#FFF'}} numberOfLines={4}>
                    Lorem Ipsum has been the industry's standard dummy text ever
                    since the 1500s, when an unknown printer took a galley of
                    type and scrambled it to make a type specimen book.
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={showColor}
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
          onBackdropPress={() => this.setState({showColor: false})}
          onBackButtonPress={() => this.setState({showColor: false})}
          style={styles.modal}>
          <View
            style={{
              width: Dimensions.get('window').width - 30,
              height: 300,
              backgroundColor: 'whitesmoke',
              borderRadius: 4,
            }}>
            <View
              style={{
                flex: 1,
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {dataColor.map(item => (
                <TouchableOpacity
                  style={{
                    height: 32,
                    borderRadius: 6,
                    backgroundColor: '#D5E9FA',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 8,
                    padding: 8,
                  }}
                  key={Math.random()}
                  onPress={() =>
                    this.setState({color: item.color, showColor: false})
                  }>
                  <Text style={{color: item.color.toLowerCase()}}>
                    {item.color.toLowerCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={showFont}
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
          onBackdropPress={() => this.setState({showFont: false})}
          onBackButtonPress={() => this.setState({showFont: false})}
          style={styles.modal}>
          <View
            style={{
              width: Dimensions.get('window').width - 30,
              height: 300,
              backgroundColor: 'whitesmoke',
              borderRadius: 4,
              alignItems: 'center',
            }}>
            <View style={{flex: 1, flexWrap: 'wrap'}}>
              {dataFont.map(item => (
                <TouchableOpacity
                  style={{
                    height: 32,
                    borderRadius: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 8,
                    padding: 8,
                  }}
                  key={Math.random()}
                  onPress={() =>
                    this.setState({size: item.size, showFont: false})
                  }>
                  <Text style={{color: '#000', fontSize: item.size}}>
                    {item.label.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
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
              <Text style={{fontSize: 28, textAlign: 'center'}}>100 điểm</Text>
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
                <Text style={{color: '#FFF', fontSize: 18}}>Đổi thẻ ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
)(Viewall);
