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
import {Toast} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {postToServer} from '../../config';
import {API, getApiUrl} from '../../config/server';
import {ValidateEmail} from '../../../components/until';

export default class Register extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      name: '',
      c_password: '',
      loading: false,
      error: false,
      msg: null,
      msgError: null,
    };
  }

  componentDidMount = () => {};

  submit = async () => {
    const {email, name, password, c_password} = this.state;
    const {navigation} = this.props;
    const {getPassword} = navigation.state.params;
    if (!name || !email) return;
    try {
      this.setState({loading: true});
      const data = {
        email,
        name,
        password,
        c_password,
      };
      const response = await postToServer(getApiUrl(API.REGISTER), data);
      if (response.status === -1) {
        this.setState({msg: response.msg});
        return;
      }
      Toast.show({
        text: 'Đăng ký thành công!',
        duration: 2000,
        position: 'top',
        type: 'success',
      });
      await AsyncStorage.setItem('username', email);
      if (getPassword) getPassword(password);
      this.goBack();
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({loading: false});
    }
  };

  validate = () => {
    const {email, name, password, c_password} = this.state;
    if (!name) {
      this.setState({error1: true, msgError: 'Họ tên không được để trống'});
      return;
    }
    if (name && name.length < 6) {
      this.setState({error1: true, msgError: 'Họ tên phải từ 6 ký tự trở lên'});
      return;
    }
    if (!email) {
      this.setState({error2: true, msgError: 'Email không được để trống'});
      return;
    }
    if (email && !ValidateEmail(email)) {
      this.setState({error2: true, msgError: 'Email không đúng định dạng'});
      return;
    }
    if (!password) {
      this.setState({
        error3: true,
        msgError: 'Vui lòng nhập mật khẩu',
      });
      return;
    }
    if (!c_password) {
      this.setState({
        error4: true,
        msgError: 'Vui lòng nhập lại mật khẩu',
      });
      return;
    }
    if (password !== c_password) {
      this.setState({error4: true, msgError: 'Nhập lại mật khẩu không khớp'});
      return;
    }
    this.submit();
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  onChangeText = (type, value) => {
    this.setState({
      [type]: value,
      msgError: null,
      error1: false,
      error2: false,
      error3: false,
      error4: false,
      error: false,
      msg: null,
    });
  };

  render() {
    const {
      email,
      password,
      c_password,
      name,
      msg,
      error,
      loading,
      msgError,
      error1,
      error2,
      error3,
      error4,
    } = this.state;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{padding: 16, alignItems: 'center', flexDirection: 'row'}}
          onPress={() => this.goBack()}>
          <Icon
            name={'chevron-left'}
            type={'EvilIcons'}
            style={{fontSize: 20, color: '#00c068'}}
          />
          <Text style={{fontSize: 18, color: '#00c068'}}>Quay lại</Text>
        </TouchableOpacity>
        <ScrollView style={{flex: 1}}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              marginTop: 32,
            }}>
            <Text style={styles.appName}>Đăng ký tài khoản</Text>
            <Text style={{color: '#FF2D55', marginBottom: 8}}>{msg}</Text>
            <Text style={{color: '#FF2D55', marginBottom: 8}}>{msgError}</Text>
            <View
              style={[
                styles.viewInput,
                {
                  marginVertical: 8,
                  borderColor: error1 ? '#FF2D55' : '#FFF',
                },
              ]}>
              <Icon name="account-outline" size={18} style={{marginLeft: 8}} />
              <TextInput
                value={name}
                onChangeText={text => this.onChangeText('name', text)}
                style={{marginLeft: 8, flex: 1}}
                placeholder="Họ tên(*)"
                placeholderTextColor="#CCC"
              />
            </View>
            <View
              style={[
                styles.viewInput,
                {
                  marginVertical: 8,
                  borderColor: error2 ? '#FF2D55' : '#FFF',
                },
              ]}>
              <Icon name="email-outline" size={18} style={{marginLeft: 8}} />
              <TextInput
                value={email}
                keyboardType="email-address"
                onChangeText={text => this.onChangeText('email', text)}
                style={{marginLeft: 8, flex: 1}}
                placeholder="Email(*)"
                placeholderTextColor="#CCC"
              />
            </View>
            <View
              style={[
                styles.viewInput,
                {
                  marginVertical: 8,
                  borderColor: error3 ? '#FF2D55' : '#FFF',
                },
              ]}>
              <Icon name="textbox-password" size={18} style={{marginLeft: 8}} />
              <TextInput
                value={password}
                secureTextEntry
                onChangeText={text => this.onChangeText('password', text)}
                style={{marginLeft: 8, flex: 1}}
                placeholder="Mật khẩu(*)"
                placeholderTextColor="#CCC"
              />
            </View>
            <View
              style={[
                styles.viewInput,
                {
                  marginVertical: 8,
                  borderColor: error4 ? '#FF2D55' : '#FFF',
                },
              ]}>
              <Icon name="textbox-password" size={18} style={{marginLeft: 8}} />
              <TextInput
                value={c_password}
                secureTextEntry
                onChangeText={text => this.onChangeText('c_password', text)}
                style={{marginLeft: 8, flex: 1}}
                placeholder="Nhập lại mật khẩu(*)"
                placeholderTextColor="#CCC"
              />
            </View>
            <TouchableOpacity style={styles.btnLogin} onPress={this.validate}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.labelLogin}>Đăng ký</Text>
              )}
            </TouchableOpacity>
            <Text style={{marginTop: 32}}>- - - - - - - - - - - - - -</Text>
            <TouchableOpacity onPress={this.goBack} style={{marginTop: 16}}>
              <Text>
                Đã có tài khoản?{' '}
                <Text style={styles.labelRegister}> Đăng nhập</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    marginTop: 16,
  },
  label: {
    color: '#ccc',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 16,
  },
  appName: {fontSize: 30, fontWeight: 'bold', marginVertical: 16},
  labelLogin: {fontSize: 16, color: '#FFF', textTransform: 'uppercase'},
  labelRegister: {color: '#00c068', marginVertical: 8, fontSize: 16},
});
