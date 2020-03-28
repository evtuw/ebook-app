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

export default class PopularList extends PureComponent {
  renderItem = ({item, index}) => (
    <TouchableOpacity
      onPress={() => this.onNavigateDetail(item.id)}
      style={{
        flexDirection: 'row',
        marginTop: index > 0 ? 16 : 0,
      }}>
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
      <View style={{flex: 1, marginLeft: 16}}>
        <Text style={{color: '#2D9CDB'}}>{`#popular      #popularbook`}</Text>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 20,
            color: '#3F3356',
            fontWeight: 'bold',
          }}>
          {item.title}
        </Text>
        <Text style={{textAlign: 'center'}} numberOfLines={2}>
          {item.description} Bumblebee - The Transfomer in the world Bumblebee -
          The Transfomer in the world Bumblebee - The Transfomer in the world
        </Text>
        <Text style={{color: '#AAA', marginVertical: 8}}>
          Thể loại:{' '}
          <Text style={{color: '#3F3356'}}>
            {item.category_name ? item.category_name : 'Chưa nhập nhật'}
          </Text>
        </Text>
        <View style={{flexDirection: 'row'}}>
          <Text style={{color: '#AAA'}}>Tác giả: </Text>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={
                item.author_avatar
                  ? {uri: HOST_IMAGE_UPLOAD + item.author_avatar}
                  : Images.avatarDefault
              }
              style={{
                width: 20,
                height: 20,
                marginHorizontal: 8,
                borderRadius: 10,
              }}
            />
            <Text style={{color: '#3F3356'}} numberOfLines={1}>
              {item.author_name ? item.author_name : 'Chưa nhập nhật'}
            </Text>
          </View>
        </View>
        <Text style={{marginTop: 8, color: '#AAA'}}>
          Lượt xem: <Text style={{color: '#3F3356'}}>{item.view}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  onNavigateDetail = id => {
    const {navigation} = this.props;
    navigation.navigate('BookDetailScreen', {id});
  };

  render() {
    const {data} = this.props;
    return (
      <FlatList
        data={data}
        contentContainerStyle={{marginHorizontal: 16, paddingBottom: 16}}
        keyExtractor={() => String(Math.random())}
        renderItem={this.renderItem}
        showsHorizontalScrollIndicator={false}
      />
    );
  }
}
