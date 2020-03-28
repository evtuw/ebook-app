import AsyncStorage from '@react-native-community/async-storage';
import storage from '../../core/config/storage';

export const saveAccountInfo = (account, callback) => {
  try {
    AsyncStorage.setItem(
      storage.accountInfo,
      account ? JSON.stringify(account) : '',
      callback,
    );
  } catch (e) {
    console.log(e);
  }
};

export default {
  ...storage,
  username: 'username',
  password: 'password',
  hasEmail: '0',
  accessTokenType: 'accessTokenType',
  host: 'host',
};
