import React, {PureComponent} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import {dispatchParams, postToServer} from '../../config';
import {API, getApiUrl} from '../../config/server';
import {saveAccountInfo} from '../../config/storage';
import {accountActionTypes} from '../../actions/type';
import {Images} from '../../assets/image';

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: false,
      msgError: null,
      loading: false,
      showPass: true,
    };
  }

  async componentDidMount() {
    const {navigation} = this.props;
    const email = await AsyncStorage.getItem('username');
    this.setState({email});
    this.focus = navigation.addListener('didFocus', async () => {
      const email = await AsyncStorage.getItem('username');
      await this.setState({email});
      this.submit();
    });
  }

  submit = async () => {
    const {email, password} = this.state;
    if (!email || !password) return;
    try {
      this.setState({loading: true, error: false, msg: null});
      const data = {email, password};
      const response = await postToServer(getApiUrl(API.LOGIN), data);
      let accountInfo = response.data;

      if (response.status === -1) {
        this.setState({error: true, msg: response.message});
        return;
      }
      if (accountInfo) {
        accountInfo = {...accountInfo};
        this.props.dispatchParams(
          accountInfo,
          accountActionTypes.APP_USER_INFO,
        );
        saveAccountInfo(accountInfo);
      }

      this.navigateToStack();
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({loading: false});
    }
  };

  navigateToStack = () => {
    const {navigation} = this.props;
    navigation.navigate('AppStack');
  };

  getPassword = async password => {
    await this.setState({password});
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  resetField = type => {
    this.setState({[type]: ''});
  };

  onChangeText = (type, value) => {
    this.setState({
      [type]: value,
    });
  };

  showPassword = () => {
    this.setState({showPass: !this.state.showPass});
  };

  render() {
    const {navigation} = this.props;
    const {email, password, loading, msg, error, showPass} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 64,
            }}>
            <FastImage
              source={Images.iconLogin2}
              style={{
                width: 100,
                height: 100,
              }}
            />
            <Text style={styles.appName}>
              SÁCH <Text>ĐIỆN TỬ</Text>
            </Text>
            <Text style={{color: '#FF2D55', marginBottom: 8}}>{msg}</Text>
            <View
              style={[
                styles.viewInput,
                {borderColor: error ? '#FF2D55' : '#FFF'},
              ]}>
              <Icon
                name="email-outline"
                size={18}
                style={{marginLeft: 8}}
                color={error ? '#FF2D55' : '#000'}
              />
              <TextInput
                value={email}
                style={{
                  marginLeft: 8,
                  flex: 1,
                  color: error ? '#FF2D55' : '#000',
                }}
                placeholder="Tài khoản"
                placeholderTextColor="#CCC"
                onChangeText={text => this.onChangeText('email', text)}
              />
              {email ? (
                <TouchableOpacity
                  style={{marginRight: 8}}
                  onPress={() => this.resetField('email')}>
                  <Icon name="close-circle" color="#00c068" size={14} />
                </TouchableOpacity>
              ) : null}
            </View>
            <View
              style={[
                styles.viewInput,
                {marginVertical: 16, borderColor: error ? '#FF2D55' : '#FFF'},
              ]}>
              <Icon
                name="textbox-password"
                size={18}
                style={{marginLeft: 8}}
                color={error ? '#FF2D55' : '#000'}
              />
              <TextInput
                value={password}
                style={{
                  marginLeft: 8,
                  flex: 1,
                  color: error ? '#FF2D55' : '#000',
                }}
                placeholder="Mật khẩu"
                secureTextEntry={showPass}
                placeholderTextColor="#CCC"
                onChangeText={text => this.onChangeText('password', text)}
              />
              <TouchableOpacity
                style={{marginRight: 8}}
                onPress={() => this.showPassword()}>
                <Icon
                  name={showPass ? 'eye' : 'eye-off'}
                  color="#00c068"
                  size={14}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                styles.btnLogin,
                {
                  backgroundColor: email && password ? '#00c068' : '#D0c9d6',
                },
              ]}
              disabled={loading || (!email && !password)}
              onPress={this.submit}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.labelLogin}>Đăng nhập</Text>
              )}
            </TouchableOpacity>
            <Text style={{marginTop: 32}}>- - - - - - - - - - - - - -</Text>
            <Text style={{marginVertical: 16}}>hoặc</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('RegisterScreen', {
                  getPassword: this.getPassword,
                })
              }>
              <Text style={styles.labelRegister}>Đăng ký tại đây</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingVertical: 16,
          }}>
          <Text>
            Powered by <Text style={{color: '#00c068'}}> Ebook - Team</Text>
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  viewInput: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '70%',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  btnLogin: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '70%',
    backgroundColor: '#00c068',
    height: 48,
    borderRadius: 6,
  },
  label: {
    color: '#ccc',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 16,
  },
  appName: {fontSize: 18, marginTop: 16, fontWeight: 'bold'},
  labelLogin: {fontSize: 16, color: '#FFF', textTransform: 'uppercase'},
  labelRegister: {color: '#00c068', marginVertical: 8, fontSize: 16},
});

const matchDispatchToProps = dispatch => {
  return {
    dispatchParams: (data, type) => {
      dispatch(dispatchParams(data, type));
    },
  };
};

export default connect(
  null,
  matchDispatchToProps,
)(Login);
