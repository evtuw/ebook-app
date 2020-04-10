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
class LazyLoadingNews extends PureComponent {
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

  renderItem = ({item}) => (
    <View style={styles.itemVertical}>
      <Placeholder
        Animation={Fade}
        Left={() => <PlaceholderMedia style={styles.image} isRound />}>
        <View style={{marginTop: 8}}>
          <PlaceholderLine width={30} />
          <PlaceholderMedia style={{width: setWidth('76%'), height: 80}} />
        </View>
      </Placeholder>

      <Placeholder
        Animation={Fade}
        style={{marginTop: 16}}
        Left={() => <PlaceholderMedia style={styles.image} isRound />}>
        <View style={{marginTop: 8}}>
          <PlaceholderLine width={30} />
          <PlaceholderMedia style={{width: setWidth('76%'), height: 100}} />
        </View>
      </Placeholder>

      <Placeholder
        Animation={Fade}
        style={{marginTop: 16}}
        Left={() => <PlaceholderMedia style={styles.image} isRound />}>
        <View style={{marginTop: 8}}>
          <PlaceholderLine width={30} />
          <PlaceholderMedia style={{width: setWidth('76%'), height: 120}} />
        </View>
      </Placeholder>
    </View>
  );

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
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,.1)',
    borderRadius: 20,
    marginRight: 10,
  },
  itemVertical: {flex: 1, marginVertical: 8},
});

export default LazyLoadingNews;
