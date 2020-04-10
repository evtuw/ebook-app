import React from 'react';
import {Dimensions, Image, TouchableHighlight} from 'react-native';
import {Icon, View} from 'native-base';

const {width} = Dimensions.get('window');

class ImageTile extends React.PureComponent {
  render() {
    let {item, index, selected, selectImage} = this.props;
    if (!item) return null;
    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={() => {
          selectImage(index);
        }}>
        <View style={{flex: 1, flexDirection: 'row'}}>
          <Image
            style={{
              width: width / 4,
              height: width / 4,
              borderColor: 'white',
              borderWidth: 0.5,
            }}
            source={{uri: item.image.uri}}
          />
          {selected && (
            <View
              style={{
                flex: 1,
                backgroundColor: '#00c068',
                width: 20,
                height: 20,
                borderRadius: 15,
                borderColor: 'white',
                borderWidth: 1,
                position: selected ? 'absolute' : 'relative',
                justifyContent: 'center',
                top: 5,
                left: 75,
                alignItems: 'center',
              }}>
              <Icon
                name={'ios-checkmark'}
                type={'Ionicons'}
                style={{color: 'white', fontSize: 20}}
              />
            </View>
          )}
        </View>
      </TouchableHighlight>
    );
  }
}

export default ImageTile;
