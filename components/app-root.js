import React from 'react';
import {Platform, View, StatusBar} from 'react-native';
import {Root, StyleProvider, Text} from 'native-base';
import {Provider} from 'react-redux';
import getTheme from '../core/theme/components';
import commonColor from '../core/theme/variables/commonColor';
import {store} from '../src/reducers/index';

export default class AppRoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      router: undefined,
    };
    Platform.OS === 'android' && StatusBar.setBackgroundColor('#FFF');
    StatusBar.setBarStyle('dark-content', true);
  }

  render = () => {
    return (
      <Provider store={store}>
        <StyleProvider style={getTheme(commonColor)}>
          <Root>
            {Platform.OS === 'android' && Platform.Version <= 19 && (
              <View
                style={{
                  backgroundColor: '#FFF',
                  height: StatusBar.currentHeight,
                }}
              />
            )}
            <this.props.router
              ref={router => {
                if (!this.state.router) this.setState({router});
              }}
            />
            {/*<this.notification router={this.state.router} />*/}
          </Root>
        </StyleProvider>
      </Provider>
    );
  };
}
