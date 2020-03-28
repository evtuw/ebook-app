import React, {Component} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import HeaderComponent from '../components/headerComponents';

export default class Bookcase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [
        {
          title: 'Title hello 1 1',
          caption: 'Caption 1',
          url:
            'https://i.pinimg.com/564x/9e/fb/e3/9efbe345df76481b9f06e3013a9ed7db.jpg',
        },
        {
          title: 'Title 2',
          caption: 'Caption 2',
          url:
            'https://i.pinimg.com/564x/5d/4e/bd/5d4ebdd2d066bb512b827b9e56f25838.jpg',
        },
      ],
    };
  }

  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.saf}>
        <HeaderComponent
          navigation={navigation}
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title="Tủ sách"
          onPressLeft={this.goBack}
        />
        <View style={{margin: 16}}>
          <Text style={{fontSize: 18}}>
            Tính năng đang được phát triển, vui lòng quay lại sau. Xin cảm ơn!
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  saf: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  textsty: {color: '#000'},
  textsty2: {color: '#FF2D55'},
});
