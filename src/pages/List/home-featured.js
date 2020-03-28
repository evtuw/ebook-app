import React, {PureComponent} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {HOST_IMAGE_UPLOAD} from '../../config/server';
import {Images} from '../../assets/image';
import {setWidth} from '../../cores/baseFuntion';
import FastImage from 'react-native-fast-image';
import CardView from 'react-native-cardview';

export default class HomeFeatured extends PureComponent {
  renderItem = ({item}) => (
    <TouchableOpacity
      style={{marginRight: 16}}
      onPress={() => this.onNavigateDetail(item.id)}>
      <CardView>
        <FastImage
          source={
            item.image
              ? {uri: HOST_IMAGE_UPLOAD + item.image}
              : Images.thumbdefault
          }
          style={{
            width: setWidth('30%'),
            height: setWidth('45%'),
            borderRadius: 4,
          }}
        />
      </CardView>
      <Text
        numberOfLines={1}
        style={{
          width: setWidth('30%'),
          marginTop: 8,
          fontSize: 15,
          color: '#3F3356',
        }}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  onNavigateDetail = id => {
    const {navigation} = this.props;
    navigation.navigate('BookDetailScreen', {id});
  };

  render() {
    const {data, navigation, horizontal} = this.props;
    return (
      <FlatList
        data={data}
        horizontal={horizontal}
        style={{marginRight: 16}}
        contentContainerStyle={{marginHorizontal: 16, marginVertical: 16}}
        keyExtractor={() => String(Math.random())}
        renderItem={this.renderItem}
        showsHorizontalScrollIndicator={false}
      />
    );
  }
}
