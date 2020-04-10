import React, {PureComponent} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {HOST_IMAGE_UPLOAD} from '../../config/server';
import {Images} from '../../assets/image';
import {setWidth} from '../../cores/baseFuntion';
import FastImage from 'react-native-fast-image';

export default class AuthorHome extends PureComponent {
  renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={{
          marginTop: 16,
          flexDirection: 'row',
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
        }}
        onPress={() => this.onNavigateListBook(item)}>
        <FastImage
          source={
            item.image
              ? {uri: HOST_IMAGE_UPLOAD + item.image}
              : Images.thumbdefault
          }
          style={{
            width: setWidth('30%'),
            height: setWidth('20%'),
            borderTopLeftRadius: 6,
            borderBottomLeftRadius: 6,
          }}
        />
        <View style={{flex: 1}}>
          <Text
            style={{
              marginLeft: 8,
              fontSize: 13,
              color: '#2D9CDB',
              marginTop: 4,
            }}>
            #tacgia
          </Text>
          <Text style={{color: '#000', fontSize: 18, marginLeft: 8}}>
            {item.name}
          </Text>
          <Text
            numberOfLines={2}
            style={{flex: 1, marginHorizontal: 8, color: '#AAA'}}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  onNavigateListBook = item => {
    const {navigation} = this.props;
    navigation.navigate('ListBookByAuthor', {
      title: item.name,
      id: item.id,
    });
  };

  render() {
    const {data} = this.props;
    return (
      <FlatList
        data={data}
        contentContainerStyle={{paddingHorizontal: 16, paddingVertical: 16}}
        keyExtractor={() => String(Math.random())}
        renderItem={this.renderItem}
        showsHorizontalScrollIndicator={false}
      />
    );
  }
}

const styles = StyleSheet.create({
  opacity: {
    flex: 1,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
});
