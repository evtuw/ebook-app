import React, {useEffect, Component} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import Modal from 'react-native-modal';
import CustomHeaderBack from '../../components/CustomHeaderBack';
import {setWidth} from '../../cores/baseFuntion';
// import TrackPlayer, {usePlaybackState} from 'react-native-track-player';

const dataColor = [
  {color: 'red'},
  {color: 'blue'},
  {color: 'CHARTREUSE'},
  {color: 'green'},
  {color: 'yellow'},
  {color: 'STEELBLUE'},
  {color: 'pink'},
  {color: 'black'},
  {color: 'DARKKHAKI'},
  {color: 'purple'},
  {color: 'DARKRED'},
  {color: 'violet'},
  {color: 'silver'},
  {color: 'REBECCAPURPLE'},
  {color: 'crimson'},
  {color: 'FIREBRICK'},
  {color: 'TOMATO'},
  {color: 'OLIVEDRAB'},
];

const dataFont = [
  {
    label: 'Heading 1',
    size: 16,
  },
  {
    label: 'Heading 1',
    size: 20,
  },
  {
    label: 'Heading 1',
    size: 24,
  },
  {
    label: 'Heading 1',
    size: 28,
  },
  {
    label: 'Heading 1',
    size: 32,
  },
];

export default class Viewall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showFont: false,
      showColor: false,
      size: 18,
      color: 'black',
      theme: 'white',
    };
  }

  componentDidMount = () => {
    setTimeout(() => {
      console.warn('la');
    }, 10000);
  };

  render() {
    const {navigation} = this.props;
    const {showFont, showColor, size, color, theme} = this.state;
    const {data} = navigation.state.params;
    return (
      <View style={styles.saf}>
        <CustomHeaderBack
          iconRightStyle={{fontSize: 35}}
          iconLeft="ios-arrow-back"
          typeIconRight="EvilIcons"
          title={data.title}
          onPressLeft={() => navigation.goBack()}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 32,
            paddingVertical: 16,
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}
            onPress={() => this.setState({showFont: true})}>
            <Text style={{fontSize: 16}}>Cỡ chữ: </Text>
            <Text>{size}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({showColor: true})}
            style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <Text style={{fontSize: 16}}>Màu chữ: </Text>
            <Text>{color.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({showColor: true})}
            style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <Text style={{fontSize: 16}}>Giao diện: </Text>
            <Text>{theme.toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView>
          <Text
            selectable
            style={{padding: 16, fontSize: size, textAlign: 'justify', color}}>
            {data.content}
          </Text>
        </ScrollView>
        <Modal
          isVisible={showColor}
          backdropOpacity={0.5}
          backdropColor="#000"
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={300}
          animationOutTiming={300}
          backdropTransitionInTiming={300}
          backdropTransitionOutTiming={300}
          useNativeDriver
          hideModalContentWhileAnimating
          onBackdropPress={() => this.setState({showColor: false})}
          onBackButtonPress={() => this.setState({showColor: false})}
          style={styles.modal}>
          <View
            style={{
              width: Dimensions.get('window').width - 30,
              height: 300,
              backgroundColor: 'whitesmoke',
              borderRadius: 4,
            }}>
            <View style={{flex: 1, flexWrap: 'wrap'}}>
              {dataColor.map(item => (
                <TouchableOpacity
                  style={{
                    height: 32,
                    borderRadius: 6,
                    backgroundColor: item.color.toLowerCase(),
                    alignItems: 'center',
                    borderColor: '#2D9CDB',
                    borderWidth: 1,
                    justifyContent: 'center',
                    margin: 8,
                    padding: 8,
                  }}
                  key={Math.random()}
                  onPress={() =>
                    this.setState({color: item.color, showColor: false})
                  }>
                  <Text style={{color: '#fff'}}>
                    {item.color.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
        <Modal
          isVisible={showFont}
          backdropOpacity={0.5}
          backdropColor="#000"
          animationIn="fadeIn"
          animationOut="fadeOut"
          animationInTiming={300}
          animationOutTiming={300}
          backdropTransitionInTiming={300}
          backdropTransitionOutTiming={300}
          useNativeDriver
          hideModalContentWhileAnimating
          onBackdropPress={() => this.setState({showFont: false})}
          onBackButtonPress={() => this.setState({showFont: false})}
          style={styles.modal}>
          <View
            style={{
              width: Dimensions.get('window').width - 30,
              height: 300,
              backgroundColor: 'whitesmoke',
              borderRadius: 4,
              alignItems: 'center',
            }}>
            <View style={{flex: 1, flexWrap: 'wrap'}}>
              {dataFont.map(item => (
                <TouchableOpacity
                  style={{
                    height: 32,
                    borderRadius: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 8,
                    padding: 8,
                  }}
                  key={Math.random()}
                  onPress={() =>
                    this.setState({size: item.size, showFont: false})
                  }>
                  <Text style={{color: '#000', fontSize: item.size}}>
                    {item.label.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  saf: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
