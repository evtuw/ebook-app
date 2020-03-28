/* eslint-disable no-nested-ternary */
import {StyleSheet, Platform} from 'react-native';

export default StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 6,
    height: 40,
    backgroundColor: '#F7F5F9',

    // backgroundColor: '#fff',
    flexDirection: 'row',

    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 1
    // },
    marginVertical: 8,
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  entry: {
    marginLeft: 11,
    fontFamily: 'SF Pro Text',
    color: '#1A051D',
    fontSize: 16,
    // lineHeight: 22,
    // fontWeight: '500'
    // width: '80%',
    flex: 1,
    paddingLeft: 5,
  },
  icback: {
    marginLeft: 12,
    width: 19,
    height: 17,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 5,
    alignItems: 'center',
  },
});
