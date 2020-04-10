import React, {PureComponent} from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Icon, Text} from 'native-base';
import TrackPlayer from 'react-native-track-player';
import {HOST_IMAGE_UPLOAD} from '../../config/server';
import {Images} from '../../assets/image';

class ItemAudio extends PureComponent {
  render() {
    const {item, index, playAudio} = this.props;
    return (
      <TouchableOpacity style={styles.item} onPress={() => playAudio(item)}>
        <Text
          style={{
            fontSize: 20,
            marginRight: 16,
            width: 25,
            textAlign: 'center',
          }}>
          {index + 1}
        </Text>
        <Image
          source={
            item.image
              ? {uri: HOST_IMAGE_UPLOAD + item.image}
              : Images.thumbdefault
          }
          style={{width: 40, height: 40, borderRadius: 8}}
        />
        <View style={{marginHorizontal: 16, flex: 1}}>
          <Text style={{fontSize: 18}} numberOfLines={2}>
            {item.title}
          </Text>
          <Text note numberOfLines={1}>
            {item.author}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
    padding: 16,
    borderRadius: 6,
  },
});

export default ItemAudio;
