/* eslint-disable */
import React from 'react';
import {connect} from 'react-redux';
import {AsyncStorage} from 'react-native';

import {API, getApiUrl} from '../../config/server';
import AppSignIn from '../../../components/app-signin';
import storage, {saveAccountInfo} from '../../config/storage';
import {dispatchParams, getFromServer} from '../../config/index';
import {accountActionTypes} from '../../actions/type';

class AuthLoading extends AppSignIn {
  constructor(props) {
    super(props);
    this.state = {
      deviceId: '',
    };
  }
  componentWillMount = async () => {
    this.checkAccountStorage(this.callback);
  };

  appSignOut = async () => {
    await AsyncStorage.removeItem(storage.accountInfo);
    try {
      this.props.navigation.navigate('LoginStack', {
        msg: 'Log out',
      });
    } catch (error) {
      console.log(error, 'appSignOut');
    }
    return true;
  };

  callback = async account => {
    try {
      let accountInfo = account;
      if (account) {
        const response = await getFromServer(getApiUrl(API.INFO), {
          account_id: accountInfo.id,
          token: accountInfo.access_token.token,
        });

        accountInfo =
          {
            ...response.data,
            access_token: accountInfo.access_token,
            coinInDay: accountInfo.coinInDay,
            coin: accountInfo.coin,
          } || accountInfo;
        //response success
        if (response.status === 1) {
          //dispatch for redux
          this.props.dispatchParams(
            accountInfo,
            accountActionTypes.APP_USER_INFO,
          );
          //save account Storage
          saveAccountInfo({
            ...accountInfo,
          });
          this.props.navigation.navigate('AppStack');
        } else {
          //go to login screen
          this.props.navigation.navigate('LoginStack');
        }
      } else {
        //go to login screen
        this.props.navigation.navigate('LoginStack');
      }
    } catch (e) {
      console.log(e);
      this.props.navigation.navigate('LoginStack');
    } finally {
    }
  };

  render() {
    return this.renderView('loading');
  }
}

export default connect(
  null,
  {
    dispatchParams,
  },
)(AuthLoading);
