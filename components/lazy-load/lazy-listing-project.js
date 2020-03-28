/* eslint-disable */
import React, {PureComponent} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
  Shine,
} from 'rn-placeholder';
import PropTypes from 'prop-types';
import {setWidth} from '../../src/cores/baseFuntion';
class LazyLoadingProject extends PureComponent {
  static propTypes = {
    horizontal: PropTypes.bool,
    visible: PropTypes.bool,
    length: PropTypes.number, // number of placeholder render
  };

  static defaultProps = {
    visible: false,
    length: 3,
    horizontal: false,
  };

  renderData = () => {
    const {length} = this.props;
    let data = [];
    for (let i = 1; i <= length; i += 1) {
      data.push(i);
    }
    return data;
  };

  renderItemHorizontal = ({item}) => (
    <View style={styles.item}>
      <Placeholder Animation={Fade}>
        <View style={styles.image} />
        <PlaceholderLine width={40} />
        <PlaceholderLine width={60} />
        <PlaceholderLine width={80} />
      </Placeholder>
    </View>
  );

  renderItem = ({item}) => (
    <View style={[styles.itemVertical, {marginTop: 16}]}>
      <Placeholder Animation={Shine} style={{marginTop: 32}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <PlaceholderMedia isRound style={{width: 40, height: 40}} />
          <PlaceholderLine width={25} style={{marginLeft: 16}} />
        </View>
        <View style={{marginTop: 16}}>
          <PlaceholderLine width={60} />
          <View style={{flexDirection: 'row'}}>
            <PlaceholderLine width={20} />
            <PlaceholderLine width={20} style={{marginLeft: 20}} />
          </View>
        </View>
      </Placeholder>
      <Placeholder Animation={Shine} style={{marginTop: 32}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <PlaceholderMedia isRound style={{width: 40, height: 40}} />
          <PlaceholderLine width={25} style={{marginLeft: 16}} />
        </View>
        <View style={{marginTop: 16}}>
          <PlaceholderLine width={60} />
        </View>
        <PlaceholderMedia style={styles.itemMediaLeft} />
        <View
          style={{
            marginTop: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <PlaceholderMedia
            style={[
              styles.itemMediaLeft,
              {width: setWidth('40%'), height: setWidth('20%')},
            ]}
          />
          <PlaceholderMedia
            style={[
              styles.itemMediaLeft,
              {width: setWidth('40%'), height: setWidth('20%')},
            ]}
          />
        </View>
      </Placeholder>
    </View>
  );

  render() {
    const {visible, horizontal} = this.props;
    const data = this.renderData();
    if (visible) {
      return (
        <FlatList
          horizontal={horizontal}
          data={data}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={horizontal ? this.renderItemHorizontal : this.renderItem}
          keyExtractor={item => item.toString()}
        />
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  image: {
    width: 238,
    height: 180,
    backgroundColor: 'rgba(0,0,0,.1)',
    borderRadius: 4,
    marginBottom: 8,
  },
  item: {
    borderRadius: 8,
    width: 238,
    marginRight: 16,
    height: 260,
    backgroundColor: '#FFF',
    marginTop: 8,
  },
  itemVertical: {
    width: '100%',
    marginBottom: 8,
  },
  itemMediaLeft: {width: '100%', height: setWidth('20%')},
});

export default LazyLoadingProject;
