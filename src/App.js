import React, {PureComponent} from 'react';
import Router from './navigation';
import allReducers from '../src/reducers/index';
import AppRoot from '../components/app-root';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-community/async-storage';

export default class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    OneSignal.init('85fd2f79-689f-47a8-8e33-2a5b982d6f34', {
      kOSSettingsKeyAutoPrompt: false,
    });
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('received', this.onReceived);
    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    // OneSignal.configure();
  }

  async componentDidMount() {
    // this.playerId = await AsyncStorage.getItem('playerId');
    // if (this.playerId === undefined || this.playerId === null || this.playerId === '') {}
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onReceived = notification => {
    console.log('Notification received: ', notification);
  };

  onOpened = openResult => {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  };

  onIds = async device => {
    console.log('vao');
    console.log('Device info: ', device);
    if (device) {
      try {
        await AsyncStorage.setItem('playerId', JSON.stringify(device.userId));
      } catch (e) {
        console.log(e);
      }
    }
  };

  render() {
    return <AppRoot router={Router} reducers={allReducers} />;
  }
}
