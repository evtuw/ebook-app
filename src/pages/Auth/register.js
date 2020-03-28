import React, {PureComponent} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {postToServer} from '../../config';
import {API, getApiUrl} from '../../config/server';

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
      msgError: null,
    };
  }

  componentDidMount = () => {};

  submit = async () => {
    const {email, name, password, c_password} = this.state;
    this.setState({loading: true});
    try {
      const data = {
        email,
        name,
        password,
        c_password,
      };
      const response = await postToServer(getApiUrl(API.REGISTER), data);
      if (response.status === -1) {
        this.setState({error: true, msg: response.msg});
        return;
      }
      await AsyncStorage.setItem('username', email);
      this.goBack();
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({loading: false});
    }
  };

  validate = () => {
    const {email, name, password, c_password, error, msgError} = this.state;
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  onChangeText = (type, value) => {
    this.setState({
      [type]: value,
    });
  };

  render() {
    const {email, password, c_password, name, msg, error, loading} = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.appName}>Đăng ký tài khoản</Text>
        <Text style={{color: '#FF2D55', marginBottom: 8}}>{msg}</Text>
        <View style={[styles.viewInput, {marginBottom: 8}]}>
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
              borderColor: error ? '#FF2D55' : '#FFF',
            },
          ]}>
          <Icon name="email-outline" size={18} style={{marginLeft: 8}} />
          <TextInput
            value={email}
            onChangeText={text => this.onChangeText('email', text)}
            style={{marginLeft: 8, flex: 1}}
            placeholder="Tài khoản(*)"
            placeholderTextColor="#CCC"
          />
        </View>
        <View style={[styles.viewInput, {marginVertical: 8}]}>
          <Icon name="textbox-password" size={18} style={{marginLeft: 8}} />
          <TextInput
            value={password}
            onChangeText={text => this.onChangeText('password', text)}
            style={{marginLeft: 8, flex: 1}}
            placeholder="Mật khẩu(*)"
            placeholderTextColor="#CCC"
          />
        </View>
        <View style={[styles.viewInput, {marginVertical: 8}]}>
          <Icon name="textbox-password" size={18} style={{marginLeft: 8}} />
          <TextInput
            value={c_password}
            onChangeText={text => this.onChangeText('c_password', text)}
            style={{marginLeft: 8, flex: 1}}
            placeholder="Nhập lại mật khẩu(*)"
            placeholderTextColor="#CCC"
          />
        </View>
        <TouchableOpacity style={styles.btnLogin} onPress={this.submit}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.labelLogin}>Đăng ký</Text>
          )}
        </TouchableOpacity>
        <Text style={{marginTop: 16}}>- - - - - - - - - - - - - -</Text>
        <Text>hoặc</Text>
        <TouchableOpacity onPress={this.goBack}>
          <Text style={styles.labelRegister}>Đăng nhập tại đây</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#FF2D55',
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
  labelRegister: {color: '#2D9CDB', marginVertical: 8, fontSize: 16},
});
