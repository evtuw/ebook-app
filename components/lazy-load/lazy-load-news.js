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
class LazyLoadingNews extends PureComponent {
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

  renderItem = ({ item }) => (
    <View style={styles.itemVertical}>
      <Placeholder
        Animation={Fade}
        Left={() => <PlaceholderMedia style={styles.image} />}
      >
        <View>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <PlaceholderLine width={20} />
            <PlaceholderLine width={20} />
          </View>
          <PlaceholderLine />
          <PlaceholderLine width={60} />
        </View>
      </Placeholder>
    </View>
  );

  render() {
    const { visible } = this.props;
    const data = this.renderData();
    if (visible) {
      return (
        <FlatList
          data={data}
          contentContainerStyle={{
            paddingHorizontal: 16
          }}
          showsHorizontalScrollIndicator={false}
          renderItem={this.renderItem}
          keyExtractor={item => item.toString()}
        />
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  image: {
    width: 111,
    height: 111,
    backgroundColor: 'rgba(0,0,0,.1)',
    borderRadius: 4,
    marginRight: 10
  },
  itemVertical: { height: 111, flex: 1, marginVertical: 8 },
});

export default LazyLoadingNews;
