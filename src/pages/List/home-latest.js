import React, {PureComponent} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {HOST_IMAGE_UPLOAD} from '../../config/server';
import {Images} from '../../assets/image';

export default class HomeLatest extends PureComponent {
  renderItem = ({item}) => (
    <TouchableOpacity
      onPress={() => this.onNavigateDetail(item.id)}
      style={{marginRight: 16}}>
      <View
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          backgroundColor: '#FFF',
          borderRadius: 4,
        }}>
        <Image
          source={
            item.image
              ? {uri: HOST_IMAGE_UPLOAD + item.image}
              : Images.thumbdefault
          }
          style={{
            width: Dimensions.get('window').width / 2 - 50,
            height: 200,
            borderRadius: 4,
          }}
        />
        <View
          style={{
            position: 'absolute',
          }}>
          <View
            style={{
              backgroundColor: 'rgba(189,81,108,0.5)',
              borderRadius: 4,
              padding: 4,
              alignItems: 'center',
              justifyContent: 'center',
              margin: 8,
            }}>
            <Text style={{color: '#FFF', fontSize: 13}}>Latest</Text>
          </View>
        </View>
      </View>

      <Text
        numberOfLines={1}
        style={{
          width: Dimensions.get('window').width / 2 - 50,
          marginTop: 8,
          fontSize: 15,
          color: '#3F3356',
        }}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  onNavigateDetail = id => {
    const {navigation, getDetailBook} = this.props;
    if (getDetailBook) {
      getDetailBook(id);
      return;
    }
    navigation.navigate('BookDetailScreen', {id});
  };

  render() {
    const {data, horizontal} = this.props;
    return (
      <FlatList
        data={data}
        style={{marginRight: 16}}
        horizontal={horizontal}
        contentContainerStyle={{marginHorizontal: 16, marginVertical: 16}}
        keyExtractor={() => String(Math.random())}
        renderItem={this.renderItem}
        showsHorizontalScrollIndicator={false}
      />
    );
  }
}
