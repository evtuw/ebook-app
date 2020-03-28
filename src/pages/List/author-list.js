import React, {PureComponent} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Icon} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import {setWidth} from '../../cores/baseFuntion';
import FastImage from 'react-native-fast-image';
import {HOST_IMAGE_UPLOAD} from '../../config/server';
import {Images} from '../../assets/image';

export default class AuthorList extends PureComponent {
  renderItem = ({item, index}) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        marginTop: index > 0 ? 16 : 0,
        backgroundColor: '#FFF',
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
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginLeft: 8}}>
          {/*<Text style={{color: '#AAA'}}>Tên tác giả: </Text>*/}
          <Text
            style={{
              color: '#3F3356',
              fontSize: 18,
              marginLeft: 8,
              fontWeight: 'bold',
            }}
            numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        <View style={{flexDirection: 'row', marginLeft: 8}}>
          {/*<Text style={{color: '#AAA'}}>Mô tả: </Text>*/}
          <Text
            style={{color: '#3F3356', fontSize: 14, marginLeft: 8}}
            numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View
          style={{flexDirection: 'row', alignItems: 'center', marginLeft: 8}}>
          <Text style={{color: '#3F3356', marginLeft: 8}}>
            Số lượng sách :{' '}
          </Text>
          <Text style={{color: '#3F3356', fontSize: 18, marginLeft: 8}}>
            {item.total_book}
          </Text>
          <Icon
            name="book"
            type="Entypo"
            style={{fontSize: 16, color: '#3F3356', marginLeft: 4}}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

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
        style={{paddingHorizontal: 16}}
        renderItem={this.renderItem}
        keyExtractor={() => String(Math.random())}
      />
    );
  }
}

const styles = StyleSheet.create({
  opacity: {
    flex: 1,
    height: 110,
    alignItems: 'center',
    borderRadius: 15,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
});
