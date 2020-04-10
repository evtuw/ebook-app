import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';
import TabNavigator from 'react-native-tab-navigator';
import Home from '../pages/Home';
import Bookcase from '../pages/Bookcase';
import News from '../pages/News';
import Profile from '../pages/Profile';
import AudioBook from '../pages/audio-book';

export default class TabComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedTab: 'Home'};
  }

  render() {
    return (
      <TabNavigator
        tabBarStyle={{
          backgroundColor: '#FFF',
          borderColor: 'transparent',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
        tabBarShadowStyle={{
          borderWidth: 0,
          backgroundColor: '#FFF',
          borderColor: 'transparent',
        }}
        hidesTabTouch>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'Audio'}
          selectedTitleStyle={{color: '#00c068'}}
          renderIcon={() => (
            <Icon
              style={styles.inputIcon1}
              name="audiobook"
              type="MaterialCommunityIcons"
            />
          )}
          renderSelectedIcon={() => (
            <View style={styles.viewIcon}>
              <Icon
                style={styles.inputIcon}
                type="MaterialCommunityIcons"
                name="audiobook"
              />
            </View>
          )}
          onPress={() => this.setState({selectedTab: 'Audio'})}>
          <AudioBook navigation={this.props.navigation} />
        </TabNavigator.Item>

        <TabNavigator.Item
          selected={this.state.selectedTab === 'New'}
          selectedTitleStyle={{color: '#00c068'}}
          renderIcon={() => (
            <Icon style={styles.inputIcon1} name="newsletter" type="Entypo" />
          )}
          renderSelectedIcon={() => (
            <View style={styles.viewIcon}>
              <Icon style={styles.inputIcon} type="Entypo" name="newsletter" />
            </View>
          )}
          // renderBadge={() => <CustomBadgeView />}
          onPress={() => this.setState({selectedTab: 'New'})}>
          <News navigation={this.props.navigation} />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'Home'}
          selectedTitleStyle={{color: '#00c068'}}
          renderIcon={() => (
            <Icon name="home" type="AntDesign" style={styles.inputIcon1} />
          )}
          renderSelectedIcon={() => (
            <View style={styles.viewIcon}>
              <Icon name="home" type="AntDesign" style={{color: '#00c068'}} />
            </View>
          )}
          // renderBadge={() => <CustomBadgeView />}
          onPress={() => this.setState({selectedTab: 'Home'})}>
          <Home navigation={this.props.navigation} />
        </TabNavigator.Item>
        <TabNavigator.Item
          selected={this.state.selectedTab === 'Bookcase'}
          selectedTitleStyle={{color: '#FF2D55'}}
          renderIcon={() => (
            <Icon
              style={styles.inputIcon1}
              name="file-cabinet"
              type="MaterialCommunityIcons"
            />
          )}
          renderSelectedIcon={() => (
            <View style={styles.viewIcon}>
              <Icon
                style={styles.inputIcon}
                type="MaterialCommunityIcons"
                name="file-cabinet"
              />
            </View>
          )}
          // renderBadge={() => <CustomBadgeView />}
          onPress={() => this.setState({selectedTab: 'Bookcase'})}>
          <Bookcase navigation={this.props.navigation} />
        </TabNavigator.Item>

        <TabNavigator.Item
          selected={this.state.selectedTab === 'Profile'}
          selectedTitleStyle={{color: '#FF2D55'}}
          renderIcon={() => (
            <Icon
              style={styles.inputIcon1}
              name="portrait"
              type="FontAwesome5"
            />
          )}
          renderSelectedIcon={() => (
            <View style={styles.viewIcon}>
              <Icon
                style={styles.inputIcon}
                type="FontAwesome5"
                name="portrait"
              />
            </View>
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
    color: '#00c068',
  },
  inputIcon1: {
    fontSize: 20,
    color: '#ACACAC',
  },
  viewIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    shadowColor: '#FF2D55',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
