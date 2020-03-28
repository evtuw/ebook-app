/* eslint-disable */
import React, { PureComponent } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
  Shine
} from 'rn-placeholder';
import PropTypes from 'prop-types';
import {setWidth} from "../../src/cores/baseFuntion";
class LazyLoadingProduct extends PureComponent {
  static propTypes = {
    horizontal: PropTypes.bool,
    visible: PropTypes.bool,
    length: PropTypes.number // number of placeholder render
  };

  static defaultProps = {
    visible: false,
    length: 3,
    horizontal: false
  };

  renderData = () => {
    const { length } = this.props;
    let data = [];
    for (let i = 1; i <= length; i += 1) {
      data.push(i);
    }
    return data;
  };

  renderItemHorizontal = ({ item }) => (
    <View style={styles.item}>
      <Placeholder Animation={Fade}>
        <PlaceholderMedia style={styles.image} />
        <PlaceholderLine width={80} />
      </Placeholder>
    </View>
  );

  renderItem = ({ item }) => (
    <View style={styles.itemVertical}>
      <Placeholder
        Animation={Fade}
        Left={() => <PlaceholderMedia style={styles.itemMediaLeft} />}
      >
        <View style={{ marginTop: 8 }}>
          <PlaceholderLine />
          <PlaceholderLine />
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <PlaceholderLine width={20} />
            <PlaceholderLine width={20} />
          </View>
          <PlaceholderLine width={40} />
        </View>
      </Placeholder>
    </View>
  );

  render() {
    const { visible, horizontal } = this.props;
    const data = this.renderData();
    if (visible) {
      return (
        <FlatList
          horizontal={horizontal}
          data={data}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 16
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
    width: setWidth('30%'),
    height: setWidth('45%'),
    backgroundColor: 'rgba(0,0,0,.1)',
    borderRadius: 4,
    marginBottom: 8
  },
  item: {
    borderRadius: 8,
    width: setWidth('30%'),
    marginRight: 16,
    backgroundColor: '#FFF'
  },
  itemVertical: { height: 128, flex: 1, marginBottom: 16 },
  itemMediaLeft: {
    width: 128,
    height: 128,
    marginRight: 10,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8
  }
});

export default LazyLoadingProduct;
