/* eslint-disable */
import React, { PureComponent } from 'react';
import { Dimensions, View } from 'react-native';
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
  Shine
} from 'rn-placeholder';
const { width: deviceWidth } = Dimensions.get('window');
class DetailLoading extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderByType = () => {
    const { type } = this.props;
    if (type === 'product') {
      return (
        <View style={{ flex: 1 }}>
          <Placeholder Animation={Fade}>
            <PlaceholderMedia
              style={{ width: deviceWidth, height: (deviceWidth * 2) / 3 }}
            />
            <View
              style={{
                marginVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16
              }}
            >
              <PlaceholderLine width={15} />
              <PlaceholderLine width={30} style={{ marginLeft: 64 }} />
            </View>
            <View style={{ marginHorizontal: 16 }}>
              <PlaceholderLine />
              <PlaceholderLine width={0} />
              <PlaceholderLine />
              <PlaceholderLine width={80} />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 16
              }}
            >
              <PlaceholderLine width={15} />
              <PlaceholderLine width={15} />
              <PlaceholderLine width={15} />
            </View>
            <View style={{ marginHorizontal: 16 }}>
              <PlaceholderLine style={{ marginVertical: 8 }} width={20} />
              <PlaceholderLine />
              <PlaceholderLine />
              <PlaceholderLine />
              <PlaceholderLine />
              <PlaceholderLine />
              <PlaceholderLine />
            </View>
          </Placeholder>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <Placeholder Animation={Fade}>
          <PlaceholderMedia
            style={{ width: deviceWidth, height: (deviceWidth * 2) / 3 }}
          />
          <View
            style={{
              marginVertical: 16,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16
            }}
          >
            <PlaceholderLine width={15} />
            <PlaceholderMedia
              isRound
              size={30}
              style={{ marginHorizontal: 32 }}
            />
            <PlaceholderLine width={25} />
          </View>
          <PlaceholderLine style={{ paddingHorizontal: 16 }} />
          <PlaceholderLine width={0} />
          <PlaceholderLine style={{ paddingHorizontal: 16 }} />
          <PlaceholderLine style={{ paddingHorizontal: 16 }} width={80} />
        </Placeholder>
      </View>
    );
  };

  render() {
    const { visible } = this.props;
    if (visible) {
      return this.renderByType();
    }
    return null;
  }
}

export default DetailLoading;
