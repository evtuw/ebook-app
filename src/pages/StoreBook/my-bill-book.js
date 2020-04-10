import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {Icon, Tab, Tabs, ScrollableTab} from 'native-base';
import HeaderComponent from '../../components/headerComponents';
import TabWaitConfirm from './Tabs/tab-wait-confirm';
import TabShipping from './Tabs/tab-shipping';
import TabDone from './Tabs/tab-done';

class MyBillBook extends PureComponent {
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
        <HeaderComponent
          navigation={navigation}
          left
          right
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title={'Đơn hàng'}
          onPressLeft={this.goBack}
        />
        <Tabs
          renderTabBar={() => (
            <ScrollableTab
              underlineStyle={{
                backgroundColor: '#00c068',
                borderTopLeftRadius: 4,
                borderTopRightRadius: 4,
                height: 2,
              }}
            />
          )}>
          <Tab
            heading="Chờ xác nhận"
            activeTabStyle={{backgroundColor: '#fff'}}
            tabStyle={{backgroundColor: '#fff'}}
            textStyle={{color: '#CCC'}}
            activeTextStyle={{color: '#00c068'}}>
            <TabWaitConfirm />
          </Tab>
          <Tab
            heading="Đang giao hàng"
            activeTabStyle={{backgroundColor: '#fff'}}
            tabStyle={{backgroundColor: '#fff'}}
            textStyle={{color: '#CCC'}}
            activeTextStyle={{color: '#00c068'}}>
            <TabShipping />
          </Tab>
          <Tab
            heading="Hoàn thành"
            activeTabStyle={{backgroundColor: '#fff'}}
            tabStyle={{backgroundColor: '#fff'}}
            textStyle={{color: '#CCC'}}
            activeTextStyle={{color: '#00c068'}}>
            <TabDone />
          </Tab>
          <Tab
            heading="Đơn đã hủy"
            activeTabStyle={{backgroundColor: '#fff'}}
            tabStyle={{backgroundColor: '#fff'}}
            textStyle={{color: '#CCC'}}
            activeTextStyle={{color: '#00c068'}}>
            <TabDone />
          </Tab>
        </Tabs>
        <Text>Class</Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(MyBillBook);
