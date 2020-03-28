import React, {useEffect, Component} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderComponent from '../components/headerComponents';
import {connect} from 'react-redux';
import {Icon, Toast} from 'native-base';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../config/server';
import {Images} from '../assets/image';
import {postToServer} from '../config';
import storage from '../../core/config/storage';
import AsyncStorage from 'react-native/Libraries/Storage/AsyncStorage';
import {formatNumber} from '../../components/until';
// import TrackPlayer, {usePlaybackState} from 'react-native-track-player';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  logout = async () => {
    const {navigation, accountInfo} = this.props;
    try {
      await postToServer(getApiUrl(API.LOGOUT), {
        token: accountInfo.access_token.token,
      });
      await AsyncStorage.removeItem(storage.accountInfo);
      navigation.navigate('LoginStack');
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const {navigation, accountInfo} = this.props;
    return (
      <View style={styles.saf}>
        <HeaderComponent
          navigation={navigation}
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title="Cá nhân"
          onPressLeft={this.goBack}
        />
        <View style={styles.viewInfo}>
          <TouchableOpacity>
            <Image
              source={
                accountInfo.avatar
                  ? {uri: HOST_IMAGE_UPLOAD + accountInfo.avatar}
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
              {accountInfo.name}
            </Text>
            <Text style={{color: '#3F3356', fontSize: 16}}>
              Điểm: {formatNumber(accountInfo.coin)}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.viewMenu}
          onPress={() => navigation.navigate('ListCardScreen')}>
          <Icon
            name="cash-usd"
            type="MaterialCommunityIcons"
            style={{marginLeft: 16, color: 'darkred', fontSize: 20}}
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
        <TouchableOpacity style={styles.viewMenu}>
          <Icon
            name="ios-help-circle-outline"
            type="Ionicons"
            style={{marginLeft: 16, color: 'REBECCAPURPLE', fontSize: 20}}
          />
          <View style={{padding: 16, flex: 1}}>
            <Text>Hướng dẫn đổi điểm</Text>
          </View>
          <Icon
            name="chevron-right"
            type="MaterialCommunityIcons"
            style={{marginRight: 16, fontWeight: 'normal', fontSize: 18}}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewMenu}>
          <Icon
            name="ios-information-circle-outline"
            type="Ionicons"
            style={{marginLeft: 16, color: 'darkred', fontSize: 20}}
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
        <TouchableOpacity style={styles.viewMenu} onPress={this.logout}>
          <Icon
            name="logout"
            type="AntDesign"
            style={{marginLeft: 16, color: 'red', fontSize: 18}}
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
