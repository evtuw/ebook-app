import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Fade,
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
  Shine,
} from 'rn-placeholder';
import {setWidth} from '../../src/cores/baseFuntion';

export default class LazyDetailBook extends PureComponent {
  render() {
    return (
      <View style={styles.itemVertical}>
        <Placeholder Animation={Fade}>
          <PlaceholderMedia style={styles.image} />
          <View style={{position: 'absolute', top: '13%', left: '10%'}}>
            <PlaceholderMedia
              style={{
                width: setWidth('30%'),
                height: setWidth('45%'),
                backgroundColor: '#999',
              }}
            />
          </View>
          <View style={{height: 100}} />
          <View style={{paddingHorizontal: 16}}>
            <PlaceholderLine width={150} />
            <PlaceholderLine width={130} />
            <PlaceholderLine width={140} />
            <PlaceholderLine width={50} />
            <View style={{flexDirection: 'row'}}>
              <PlaceholderLine width={50} />
              <PlaceholderLine width={20} style={{marginLeft: 16}} />
            </View>
            <PlaceholderLine width={90} />
          </View>
        </Placeholder>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: setWidth('100%'),
    height: setWidth('45%'),
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,.1)',
    marginRight: 10,
  },
  itemVertical: {
    height: setWidth('45%'),
    flex: 1,
  },
});
