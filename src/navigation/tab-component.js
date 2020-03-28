import React from 'react';
import {StyleSheet} from 'react-native';
import {Icon} from 'native-base';
import TabNavigator from 'react-native-tab-navigator';
import Home from '../pages/Home';
import Bookcase from '../pages/Bookcase';
import News from '../pages/News';
import Profile from '../pages/Profile';

export default class TabComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedTab: 'Home'};
  }

  render() {
    return (
      <TabNavigator>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'Home'}
          title="Trang chủ"
          selectedTitleStyle={{color: '#FF2D55'}}
          renderIcon={() => (
            <Icon style={styles.inputIcon1} name="home" type="AntDesign" />
          )}
          renderSelectedIcon={() => (
            <Icon style={styles.inputIcon} type="AntDesign" name="home" />
          )}
          onPress={() => this.setState({selectedTab: 'Home'})}>
          <Home navigation={this.props.navigation} />
        </TabNavigator.Item>

        <TabNavigator.Item
          selected={this.state.selectedTab === 'New'}
          title="Cộng đồng"
          selectedTitleStyle={{color: '#FF2D55'}}
          renderIcon={() => (
            <Icon style={styles.inputIcon1} name="newsletter" type="Entypo" />
          )}
          renderSelectedIcon={() => (
            <Icon style={styles.inputIcon} type="Entypo" name="newsletter" />
          )}
          // renderBadge={() => <CustomBadgeView />}
          onPress={() => this.setState({selectedTab: 'New'})}>
          <News navigation={this.props.navigation} />
        </TabNavigator.Item>

        <TabNavigator.Item
          selected={this.state.selectedTab === 'Bookcase'}
          title="Tủ sách"
          selectedTitleStyle={{color: '#FF2D55'}}
          renderIcon={() => (
            <Icon
              style={styles.inputIcon1}
              name="file-cabinet"
              type="MaterialCommunityIcons"
            />
          )}
          renderSelectedIcon={() => (
            <Icon
              style={styles.inputIcon}
              type="MaterialCommunityIcons"
              name="file-cabinet"
            />
          )}
          // renderBadge={() => <CustomBadgeView />}
          onPress={() => this.setState({selectedTab: 'Bookcase'})}>
          <Bookcase navigation={this.props.navigation} />
        </TabNavigator.Item>

        <TabNavigator.Item
          selected={this.state.selectedTab === 'Profile'}
          title="Cá nhân"
          selectedTitleStyle={{color: '#FF2D55'}}
          renderIcon={() => (
            <Icon
              style={styles.inputIcon1}
              name="portrait"
              type="FontAwesome5"
            />
          )}
          renderSelectedIcon={() => (
            <Icon
              style={styles.inputIcon}
              type="FontAwesome5"
              name="portrait"
            />
          )}
          // renderBadge={() => <CustomBadgeView />}
          onPress={() => this.setState({selectedTab: 'Profile'})}>
          <Profile navigation={this.props.navigation} />
        </TabNavigator.Item>
      </TabNavigator>
    );
  }
}
const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '90%',
    marginBottom: 100,
  },
  buttonCircle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonlogin: {
    backgroundColor: '#FF2D55',
    height: 44,
    width: 315,
    marginBottom: 15,
  },
  inputIcon: {
    fontSize: 20,
    color: '#FF2D55',
  },
  inputIcon1: {
    fontSize: 20,
    color: '#ACACAC',
  },
});
