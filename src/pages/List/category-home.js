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
import LinearGradient from 'react-native-linear-gradient';

export default class CategoryHome extends PureComponent {
  renderItem = ({item, index}) => {
    const color = [
      ['#a18cd1', '#fbc2eb'],
      ['#d8e76a', '#eb9454'],
      ['#b2e874', '#48A9BE'],
      ['#78BEF0', '#6131A1'],
      ['#EA0386', '#ff9a9e'],
      ['#ff9a9e', '#fecfef'],
    ];
    return (
      <View style={{marginTop: 16}}>
        <TouchableOpacity onPress={()=> this.onNavigateListBook(item)}>
          <LinearGradient
            start={{x: 0.0, y: 0.25}}
            end={{x: 0.5, y: 1.0}}
            colors={color[index % color.length]}
            style={styles.opacity}>
            <Text style={{color: '#FFF', fontSize: 30}}>
              {item.category_name}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  onNavigateListBook = item => {
    const {navigation} = this.props;

    navigation.navigate('ListBookByCategory', {
      title: item.category_name,
      id: item.cid,
    });
  };

  render() {
    const {data} = this.props;
    return (
      <FlatList
        data={data}
        contentContainerStyle={{marginHorizontal: 16, marginVertical: 16}}
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
