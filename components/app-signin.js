import React from 'react';
import {
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  Image,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Container, Content, View} from 'native-base';

import storage from '../core/config/storage';
import {Images} from '../src/assets/image';

export default class AppSignIn extends React.Component {
  checkAccountStorage = async callback => {
    try {
      await AsyncStorage.getItem(storage.accountInfo, (err, accountInfo) => {
        if (!err) {
          callback(JSON.parse(accountInfo));
        } else callback();
      });
    } catch (e) {
      console.log(e);
    }
  };

  submit = values => {};

  renderView(type) {
    let view;
    switch (type) {
      case 'loading':
        view = (
          <View>
            <Image
              source={Images.iconLogin2}
              style={{width: 100, height: 100}}
            />
            <View style={{flexDirection: 'row', marginTop: 8}}>
              <Text style={{fontWeight: 'bold'}}>SÁCH</Text>
              <Text style={{fontWeight: 'bold'}}> ĐIỆN TỬ</Text>
            </View>
          </View>
        );
        break;
      default:
        break;
    }
    return (
      <View style={{flex: 1}}>
        <View style={styles.loginView}>{view}</View>
        <StatusBar backgroundColor="#FFF" barStyle={'dark-content'} animated />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loginView: {alignItems: 'center', justifyContent: 'center', flex: 1},
  content: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  viewLogo: {
    marginBottom: 30,
    alignItems: 'center',
  },
});
