import React, {PureComponent} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {Icon} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import {setWidth} from '../../cores/baseFuntion';

export default class CategoryList extends PureComponent {
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
      <View style={{marginTop: index > 0 ? 16 : 0}}>
        <TouchableOpacity onPress={() => this.onNavigateListBook(item)}>
          <LinearGradient
            start={{x: 0.0, y: 0.25}}
            end={{x: 0.5, y: 1.0}}
            colors={color[index % color.length]}
            style={styles.opacity}>
            <View style={{flex: 1}}>
              <Text
                style={{color: '#FFF', fontSize: 26, maxWidth: setWidth('50%')}}
                numberOfLines={2}>
                {item.category_name}
              </Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#FFF', fontSize: 30}}>
                {item.total_book}
              </Text>
              <Icon
                name="notebook"
                type="MaterialCommunityIcons"
                style={{color: '#FFF', marginLeft: 8}}
              />
            </View>
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
