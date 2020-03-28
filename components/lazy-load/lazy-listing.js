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

class LazyLoadingListing extends PureComponent {
  static propTypes = {
    horizontal: PropTypes.bool,
    visible: PropTypes.bool,
    length: PropTypes.number, // number of placeholder render
    listName: PropTypes.string,
  };

  static defaultProps = {
    visible: false,
    length: 3,
    horizontal: false,
    listName: 'book',
  };

  renderData = () => {
    const {length} = this.props;
    let data = [];
    for (let i = 1; i <= length; i += 1) {
      data.push(i);
    }
    return data;
  };

  renderItem = ({item}) => {
    const {listName} = this.props;
    switch (listName) {
      case 'book_latest':
        return (
          <View style={styles.itemVertical}>
            <Placeholder
              Animation={Fade}
              Left={() => <PlaceholderMedia style={styles.image} />}>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <PlaceholderLine width={50} />
                  <PlaceholderLine
                    width={30}
                    height={20}
                    style={{marginRight: 8}}
                  />
                </View>
                <PlaceholderLine width={60} />
                <PlaceholderLine width={30} />
              </View>
            </Placeholder>
          </View>
        );
      default:
        return (
          <View style={styles.itemVertical}>
            <Placeholder Animation={Fade}>
              <View style={{flexDirection: 'row'}}>
                <PlaceholderMedia style={styles.image} />
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <PlaceholderLine width={50} />
                    <PlaceholderLine width={50} style={{marginLeft: 8}} />
                  </View>
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
              </View>
            </Placeholder>
          </View>
        );
    }
  };

  render() {
    const {visible} = this.props;
    const data = this.renderData();
    if (visible) {
      return (
        <FlatList
          data={data}
          contentContainerStyle={{
            paddingHorizontal: 16,
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
    width: setWidth('30%'),
    height: setWidth('45%'),
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,.1)',
    marginRight: 10,
  },
  itemVertical: {
    width: setWidth('30%'),
    height: setWidth('45%'),
    flex: 1,
    marginVertical: 8,
  },
});

export default LazyLoadingListing;
