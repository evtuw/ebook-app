import React, {PureComponent} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Icon, Toast} from 'native-base';
import color from '../../assets/static-data/color';
import {postToServer} from '../../config';
import {API, getApiUrl} from '../../config/server';

class ForgotPassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      showPassNew: true,
      email: '',
      passNew: '',
      loading: false,
      errorOld: false,
      errorNew: false,
      msg: null,
      showReset: false,
      token: '',
      password: '',
      timeCountDown: '',
    };
  }

  componentDidMount = () => {};

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  startTimer = duration => {
    let timer = duration;
    let minutes;
    let seconds;
    this.timeCountDown = setInterval(() => {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      const display = `${minutes}:${seconds}`;
      this.setState({timeCountDown: display});
      timer -= 1;
      if (timer < 0) {
        clearInterval(this.timeCountDown);
        timer = 0;
      }
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.timeCountDown);
  }

  submit = async () => {
    const {email} = this.state;
    this.setState({loading: true});
    try {
      const response = await postToServer(getApiUrl(API.FORGOT_PASSWORD), {
        email,
      });
      if (response.status === -1) {
        this.setState({msg: response.message, errorOld: true});
      } else {
        this.setState({showReset: true, token: response.token});
        this.startTimer(179);
      }
    } catch (e) {
    } finally {
      this.setState({loading: false});
    }
  };

  onChangeText = (type, value) => {
    this.setState({[type]: value, errorOld: false, errorNew: false, msg: null});
  };

  submitPassword = async () => {
    const {token, password} = this.state;
    if (password && password.length < 6) {
      this.setState({msg: 'Mật khẩu phải từ 6 ký tự trở lên', errorOld: true});
      return;
    }
    this.setState({loading: true});
    try {
      const response = await postToServer(
        getApiUrl(`${API.RESET_PASSWORD}/${token}`),
        {
          password,
        },
      );
      if (response.status === -1) {
        this.setState({msg: response.message});
      } else {
        Toast.show({
          text: 'Đổi mật khẩu thành công !',
          duration: 3000,
          type: 'success',
          position: 'center',
        });
        this.goBack();
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({loading: false});
    }
  };

  showResetPass = () => {
    const {password, msg, errorOld, loading, timeCountDown} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <View style={{padding: 16}}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={this.goBack}>
            <Icon
              name={'chevron-left'}
              type="Feather"
              style={{fontSize: 22, color: color.primaryColor}}
            />
            <Text style={{fontSize: 20, color: color.primaryColor}}>
              Quay lại
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingHorizontal: 16}}>
            <Text style={{marginTop: 32, fontSize: 22, marginLeft: 16}}>
              Nhập mật khẩu mới
            </Text>
          </View>
          <Text
            style={{
              color: color.red,
              textAlign: 'center',
              marginTop: 32,
              marginBottom: 8,
            }}>
            {msg}
          </Text>
          <View
            style={[
              styles.viewInput,
              {borderWidth: 1, borderColor: errorOld ? color.red : color.white},
            ]}>
            <TextInput
              placeholder="Nhập mật khẩu mới"
              placeholderTextColor={'#A7A9BC'}
              value={password}
              onChangeText={text => this.onChangeText('password', text)}
              style={{
                marginLeft: 8,
                flex: 1,
                color: '#000',
              }}
            />
          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor: password ? color.primaryColor : '#CEC7D3',
                },
              ]}
              disabled={!password || loading}
              onPress={this.submitPassword}>
              {loading ? (
                <ActivityIndicator color={'#FFF'} />
              ) : (
                <Text style={{color: '#FFF'}}>Cập nhật</Text>
              )}
            </TouchableOpacity>
          </View>
          <Text style={{marginLeft: 32, color: '#A7A9BC'}}>
            Thời gian còn lại:{' '}
            <Text style={{color: color.primaryColor}}>{timeCountDown}</Text>
          </Text>
        </ScrollView>
      </View>
    );
  };

  render() {
    const {loading, showReset, email, msg, errorOld} = this.state;
    if (showReset) return this.showResetPass();
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <View style={{padding: 16}}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={this.goBack}>
            <Icon
              name={'chevron-left'}
              type="Feather"
              style={{fontSize: 22, color: color.primaryColor}}
            />
            <Text style={{fontSize: 20, color: color.primaryColor}}>
              Quay lại
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{paddingHorizontal: 16}}>
            <Text style={{marginTop: 32, fontSize: 22, marginLeft: 16}}>
              Nhập email của bạn
            </Text>
          </View>
          <Text
            style={{
              color: color.red,
              textAlign: 'center',
              marginTop: 32,
              marginBottom: 8,
            }}>
            {msg}
          </Text>
          <View
            style={[
              styles.viewInput,
              {borderWidth: 1, borderColor: errorOld ? color.red : color.white},
            ]}>
            <TextInput
              placeholder="Email của bạn"
              placeholderTextColor={'#A7A9BC'}
              value={email}
              onChangeText={text => this.onChangeText('email', text)}
              style={{
                marginLeft: 8,
                flex: 1,
                color: '#000',
              }}
            />
          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor: email ? color.primaryColor : '#CEC7D3',
                },
              ]}
              disabled={!email || loading}
              onPress={this.submit}>
              {loading ? (
                <ActivityIndicator color={'#FFF'} />
              ) : (
                <Text style={{color: '#FFF'}}>Tiếp tục</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    borderRadius: 6,
    marginHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 6,
    backgroundColor: color.primaryColor,
    marginHorizontal: 32,
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
});

export default ForgotPassword;
