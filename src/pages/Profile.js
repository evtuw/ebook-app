import React, {useEffect, Component} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import HeaderComponent from '../components/headerComponents';
import {connect} from 'react-redux';
import {Icon, Toast} from 'native-base';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../config/server';
import {Images} from '../assets/image';
import {getFromServer, postToServer} from '../config';
import storage from '../../core/config/storage';
import Modal from 'react-native-modal';
import AsyncStorage from 'react-native/Libraries/Storage/AsyncStorage';
import {formatNumber} from '../../components/until';
import {setWidth} from '../cores/baseFuntion';
import color from '../assets/static-data/color';
import appJson from '../../app.json';
import ProgressDialog from '../../components/ProgressDialog';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      visible: false,
      visibleDialog: false,
    };
  }

  componentDidMount() {
    this.getDetailApp();
  }

  getDetailApp = async () => {
    const {accountInfo} = this.props;
    try {
      const res = await getFromServer(getApiUrl(API.APP_DETAIL), {
        token: accountInfo.access_token.token,
      });
      this.setState({data: res.data});
    } catch (e) {
      console.log(e);
    }
  };

  logout = async () => {
    const {navigation, accountInfo} = this.props;
    this.setState({visibleDialog: true});
    try {
      await postToServer(getApiUrl(API.LOGOUT), {
        token: accountInfo.access_token.token,
      });
      await AsyncStorage.removeItem(storage.accountInfo);
      navigation.navigate('LoginStack');
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({visibleDialog: false});
    }
  };

  closePopup = () => {
    this.setState({visible: false});
  };

  render() {
    const {navigation, accountInfo} = this.props;
    const {data, visible, visibleDialog} = this.state;
    return (
      <View style={styles.saf}>
        <ProgressDialog visible={visibleDialog} message="Vui lòng chờ..." />
        <View
          style={{
            flexDirection: 'row',
            marginTop: 24,
            marginLeft: 24,
            marginBottom: 16,
            marginRight: 16,
            alignItems: 'center',
          }}>
          <Image source={Images.iconLogin2} style={{width: 26, height: 26}} />
          <Text
            style={{
              fontSize: 26,
              color: color.primaryColor,
              fontWeight: 'bold',
              marginLeft: 8,
              fontStyle: 'italic',
              flex: 1,
            }}>
            Tài khoản
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
            <Icon
              name={'ios-notifications-outline'}
              type={'Ionicons'}
              style={{fontSize: 24, color: color.primaryColor}}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.viewInfo}>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfileScreen')}>
              <Image
                source={
                  accountInfo?.avatar
                    ? {
                        uri:
                          HOST_IMAGE_UPLOAD + JSON.parse(accountInfo.avatar)[0],
                      }
                    : Images.avatarDefault
                }
                style={{width: 80, height: 80, borderRadius: 40}}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 5,
                  backgroundColor: 'rgba(0,0,0,.5)',
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  name="account-edit"
                  type="MaterialCommunityIcons"
                  style={{fontSize: 16, color: '#FFF'}}
                />
              </View>
            </TouchableOpacity>
            <View style={{marginLeft: 16}}>
              <Text style={{color: '#3F3356', fontSize: 22}} numberOfLines={1}>
                {accountInfo?.name}
              </Text>
              <Text style={{color: '#3F3356', fontSize: 16}}>
                Điểm: {formatNumber(accountInfo?.coin)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewMenu}
            onPress={() => navigation.navigate('MyProfileScreen')}>
            <Icon
              name="user"
              type="EvilIcons"
              style={{marginLeft: 16, color: '#00c068', fontSize: 20}}
            />
            <View style={{padding: 16, flex: 1}}>
              <Text>Trang cá nhân</Text>
            </View>
            <Icon
              name="chevron-right"
              type="MaterialCommunityIcons"
              style={{marginRight: 16, fontWeight: 'normal', fontSize: 18}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewMenu}
            onPress={() => navigation.navigate('ListCardScreen')}>
            <Icon
              name="attach-money"
              type="MaterialIcons"
              style={{marginLeft: 16, color: '#c02064', fontSize: 18}}
            />
            <View style={{padding: 16, flex: 1}}>
              <Text>Đổi thẻ cào</Text>
            </View>
            <Icon
              name="chevron-right"
              type="MaterialCommunityIcons"
              style={{marginRight: 16, fontWeight: 'normal', fontSize: 18}}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.viewMenu}
            onPress={() => navigation.navigate('TutorialCardScreen')}>
            <Icon
              name="ios-help-circle-outline"
              type="Ionicons"
              style={{marginLeft: 16, color: '#00c068', fontSize: 20}}
            />
            <View style={{padding: 16, flex: 1}}>
              <Text>Hướng dẫn đổi thẻ</Text>
            </View>
            <Icon
              name="chevron-right"
              type="MaterialCommunityIcons"
              style={{marginRight: 16, fontWeight: 'normal', fontSize: 18}}
            />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={styles.viewMenu}
            onPress={() => navigation.navigate('ListStoreScreen')}>
            <Icon
              name="book"
              type="AntDesign"
              style={{marginLeft: 16, color: '#c09139', fontSize: 16}}
            />
            <View style={{padding: 16, flex: 1}}>
              <Text>Cửa hàng sách</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name="chevron-right"
                type="MaterialCommunityIcons"
                style={{marginRight: 16, fontWeight: 'normal', fontSize: 18}}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewMenu}
            onPress={() => this.setState({visible: true})}>
            <Icon
              name="ios-information-circle-outline"
              type="Ionicons"
              style={{marginLeft: 16, color: '#1462c0', fontSize: 20}}
            />
            <View style={{padding: 16, flex: 1}}>
              <Text>Thông tin ứng dụng</Text>
            </View>
            <Icon
              name="chevron-right"
              type="MaterialCommunityIcons"
              style={{marginRight: 16, fontWeight: 'normal', fontSize: 18}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewMenu, {marginBottom: 8}]}
            onPress={() => navigation.navigate('ChangePasswordScreen')}>
            <Icon
              name="textbox-password"
              type="MaterialCommunityIcons"
              style={{marginLeft: 16, color: '#aac05c', fontSize: 18}}
            />
            <View style={{padding: 16, flex: 1}}>
              <Text>Đổi mật khẩu</Text>
            </View>
            <Icon
              name="chevron-right"
              type="MaterialCommunityIcons"
              style={{marginRight: 16, fontWeight: 'normal', fontSize: 18}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewMenu, {marginBottom: 8}]}
            onPress={this.logout}>
            <Icon
              name="logout"
              type="AntDesign"
              style={{marginLeft: 16, color: '#c00e40', fontSize: 16}}
            />
            <View style={{padding: 16, flex: 1}}>
              <Text>Đăng xuất</Text>
            </View>
            <Icon
              name="chevron-right"
              type="MaterialCommunityIcons"
              style={{marginRight: 16, fontWeight: 'normal', fontSize: 18}}
            />
          </TouchableOpacity>
        </ScrollView>
        <Modal
          isVisible={visible}
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
          onBackdropPress={this.closePopup}
          onBackButtonPress={this.closePopup}
          style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              width: setWidth('80%'),
              backgroundColor: '#FFF',
              borderRadius: 4,
              padding: 16,
            }}>
            {data?.logo && (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={{uri: HOST_IMAGE_UPLOAD + data?.logo}}
                  style={{width: 100, height: 100}}
                  resizeMode="contain"
                />
              </View>
            )}
            <View style={{padding: 16, marginTop: 32}}>
              <View style={{flexDirection: 'row', paddingVertical: 8}}>
                <Text style={{flex: 1}}>Tên ứng dụng: </Text>
                <Text>{data?.name} </Text>
              </View>

              <View style={{flexDirection: 'row', paddingVertical: 8}}>
                <Text style={{flex: 1}}>Phát triển bởi: </Text>
                <Text>{data?.author} </Text>
              </View>

              <View style={{flexDirection: 'row', paddingVertical: 8}}>
                <Text style={{flex: 1}}>Email: </Text>
                <Text>{data?.email} </Text>
              </View>

              <View style={{flexDirection: 'row', paddingVertical: 8}}>
                <Text style={{flex: 1}}>Số điện thoại: </Text>
                <Text>{data?.phone} </Text>
              </View>

              <View style={{flexDirection: 'row', paddingVertical: 8}}>
                <Text style={{flex: 1}}>Website: </Text>
                <Text>{data?.website} </Text>
              </View>

              <View style={{paddingVertical: 8}}>
                <Text>Mô tả: </Text>
                <Text
                  style={{marginTop: 8, color: '#AAA', textAlign: 'justify'}}>
                  {data?.description}
                </Text>
              </View>
            </View>
          </View>
        </Modal>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ccc1',
          }}>
          <View style={{flexDirection: 'row', marginTop: 4}}>
            <Image
              source={{uri: HOST_IMAGE_UPLOAD + data?.logo}}
              style={{width: 20, height: 20, borderRadius: 10}}
              resizeMode="cover"
            />
            <Text style={{marginLeft: 8, color: '#AAA'}}>{data?.name}</Text>
          </View>
          <View style={{flexDirection: 'row', padding: 4}}>
            <Text style={{color: '#AAA'}}>Version: {data?.version}</Text>
            <Text style={{marginLeft: 16, color: '#AAA'}}>
              Build: {appJson.build}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  saf: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  viewInfo: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  viewMenu: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 2,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(Profile);
