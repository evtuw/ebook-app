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
import {Icon} from 'native-base';
import color from '../../assets/static-data/color';
import {postToServer} from '../../config';
import {API, getApiUrl} from '../../config/server';
import {connect} from 'react-redux';
import AsyncStorage from 'react-native/Libraries/Storage/AsyncStorage';
import storage from '../../../core/config/storage';

class ChangePassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      showPassNew: true,
      passOld: '',
      passNew: '',
      loading: false,
      errorOld: false,
      errorNew: false,
      msg: null,
    };
  }

  componentDidMount = () => {};

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  submit = async () => {
    const {accountInfo} = this.props;
    const {passOld, passNew} = this.state;
    this.setState({loading: true});
    try {
      const response = await postToServer(getApiUrl(API.UPDATE_PASSWORD), {
        oldPassword: passOld,
        newPassword: passNew,
        token: accountInfo.access_token.token,
      });
      if (response.status === 1) {
        Alert.alert(
          'Thành công',
          'Vui lòng đăng nhập lại để tiếp tục sử dụng',
          [{text: 'OK', onPress: () => this.logout()}],
          {cancelable: false},
        );
      } else {
        this.setState({msg: response.token, errorOld: true});
      }
      console.log(response);
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({loading: false});
    }
  };

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

  validate = () => {
    const {passOld, passNew} = this.state;
    if (passOld.length < 6) {
      this.setState({errorOld: true, msg: 'Mật khẩu phải từ 6 ký tự trở lên'});
      return;
    }
    if (passNew.length < 6) {
      this.setState({errorNew: true, msg: 'Mật khẩu phải từ 6 ký tự trở lên'});
      return;
    }
    if (passNew === passOld) {
      this.setState({
        errorNew: true,
        msg: 'Mật khẩu mới phải khác mật khẩu cũ',
      });
      return;
    }
    this.submit();
  };

  showPassword = () => {
    this.setState({showPass: !this.state.showPass});
  };

  showPasswordNew = () => {
    this.setState({showPassNew: !this.state.showPassNew});
  };

  onChangeText = (type, value) => {
    this.setState({[type]: value, errorOld: false, errorNew: false, msg: null});
  };

  render() {
    const {
      loading,
      showPass,
      showPassNew,
      passOld,
      passNew,
      msg,
      errorOld,
      errorNew,
    } = this.state;
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
              Thay đổi mật khẩu của bạn
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
              placeholder="Mật khẩu hiện tại"
              placeholderTextColor={'#A7A9BC'}
              secureTextEntry={showPass}
              value={passOld}
              onChangeText={text => this.onChangeText('passOld', text)}
              style={{
                marginLeft: 8,
                flex: 1,
                color: '#000',
              }}
            />
            <TouchableOpacity
              style={{marginRight: 8}}
              onPress={this.showPassword}>
              <Icon
                name={showPass ? 'eye' : 'eye-off'}
                type="MaterialCommunityIcons"
                style={{fontSize: 16, color: '#A7A9BC'}}
              />
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.viewInput,
              {
                marginTop: 16,
                borderWidth: 1,
                borderColor: errorNew ? color.red : color.white,
              },
            ]}>
            <TextInput
              placeholder="Mật khẩu mới"
              placeholderTextColor={'#A7A9BC'}
              onChangeText={text => this.onChangeText('passNew', text)}
              value={passNew}
              secureTextEntry={showPassNew}
              style={{
                marginLeft: 8,
                flex: 1,
                color: '#000',
              }}
            />
            <TouchableOpacity
              style={{marginRight: 8}}
              onPress={this.showPasswordNew}>
              <Icon
                name={showPassNew ? 'eye' : 'eye-off'}
                type="MaterialCommunityIcons"
                style={{fontSize: 16, color: '#A7A9BC'}}
              />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor:
                    passOld && passNew ? color.primaryColor : '#CEC7D3',
                },
              ]}
              disabled={!passOld || !passNew || loading}
              onPress={this.validate}>
              {loading ? (
                <ActivityIndicator color={'#FFF'} />
              ) : (
                <Text style={{color: '#FFF'}}>Cập nhật</Text>
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

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(ChangePassword);
