import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';

class TabShipping extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {};

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  render() {
    const {navigation} = this.props;

    return (
      <View style={{flex: 1}}>
        <Text>Class</Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(TabShipping);
