import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {Icon} from 'native-base';
import FastImage from 'react-native-fast-image';
import {setWidth} from '../cores/baseFuntion';
import color from '../assets/static-data/color';

export default class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkLeft: true,
      checkRight: true,
    };
  }

  render() {
    const {
      navigation,
      title,
      left,
      iconLeft,
      iconLeftType,
      right,
      iconRight,
      iconRightType,
      onPressLeft,
      onPressRight,
      style,
      icStyle,
    } = this.props;
    const {navigate} = navigation;
    return (
      <View style={[styles.container, style]}>
        {left ? (
          <TouchableOpacity
            style={{paddingLeft: 16, marginTop: 10}}
            hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
            onPress={onPressLeft}>
            <Icon
              name={iconLeft}
              type={iconLeftType}
              style={{fontSize: 24, color: icStyle || '#00c068'}}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            color: color.primaryColor,
            flex: 1,
          }}>
          {title}
        </Text>
        {right ? (
          <TouchableOpacity
            style={{paddingRight: 16, marginTop: 10}}
            onPress={onPressRight}>
            <Icon
              name={iconRight}
              type={iconRightType}
              style={{fontSize: 24, color: color.primaryColor}}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 0.3,
    borderBottomColor: 'silver',
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
  },
  body: {
    marginHorizontal: 10,
    paddingVertical: 7,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    width: 35,
    height: 40,
    borderRadius: 35 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 25,
    color: '#00003D',
  },
  title: {
    color: '#00003D',
    width: '50%',
    fontWeight: '400',
    fontSize: 25,
    textAlign: 'center',
  },
  input: {
    width: '70%',
    height: '100%',
    paddingHorizontal: '6%',
    backgroundColor: '#E7E6E6',
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
  },
  input2: {
    width: setWidth('82%'),
    height: '100%',
    paddingHorizontal: '6%',
    backgroundColor: '#E7E6E6',
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconSearch: {
    fontSize: 20,
    marginRight: 10,
  },
});
