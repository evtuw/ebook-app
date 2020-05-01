import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const changeStatusBar = visible => {
  if (Platform.OS === 'android') {
    if (visible) {
      StatusBar.setBackgroundColor('white', true);
    } else {
      StatusBar.setBackgroundColor('white', true);
    }
  }
};

const ProgressDialog = ({visible, message}) => {
  if (visible) {
    changeStatusBar(visible);
    return (
      <View style={styles.container}>
        <View style={styles.loading}>
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
          </View>
          <View style={styles.loadingContent}>
            <Text>{message}</Text>
          </View>
        </View>
      </View>
    );
  }
  changeStatusBar(visible);
  return null;
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,.3)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 999,
  },
  loading: {
    padding: 30,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  loader: {},
  loadingContent: {
    paddingLeft: 15,
  },
});

export default ProgressDialog;
