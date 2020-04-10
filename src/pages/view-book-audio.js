import React, {PureComponent} from 'react';
import {View, TouchableOpacity, Image, Dimensions} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Icon, Text} from 'native-base';
const {width: dvWidth} = Dimensions.get('window');
import TrackPlayer from 'react-native-track-player';
import {HOST_IMAGE_UPLOAD} from '../config/server';
import {Images} from '../assets/image';
class ViewBookAudio extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      play: false,
      data: props.data || {},
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.data !== this.props.data) {
      this.setState({data: nextProps.data});
    }
  }

  playAudio = () => {
    const {play, data} = this.state;
    TrackPlayer.setupPlayer()
      .then(async () => {
        // Adds a track to the queue
        await TrackPlayer.add({
          id: 'trackId',
          url: data.link,
          title: data.title,
          artist: data.author,
          artwork: HOST_IMAGE_UPLOAD + data.image,
        });
        // Starts playing it
        if (play) {
          TrackPlayer.play();
        } else {
          TrackPlayer.pause();
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  componentWillUnmount() {
    TrackPlayer.reset();
  }

  render() {
    const {play, data} = this.state;
    return (
      <Animatable.View animation="slideInDown">
        <View
          style={{
            flex: 1,
            height: 48,
            backgroundColor: '#FFF',
            alignItems: 'center',
            paddingHorizontal: 16,
            flexDirection: 'row',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            margin: 8,
          }}>
          <Image
            source={
              data.image
                ? {
                    uri: HOST_IMAGE_UPLOAD + data.image,
                  }
                : Images.thumbdefault
            }
            style={{width: 40, height: 40, borderRadius: 20}}
          />
          <Text style={{flex: 1, marginLeft: 16}} note numberOfLines={2}>
            {data.title}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {play ? (
              <TouchableOpacity
                style={{marginHorizontal: 8}}
                onPress={() =>
                  this.setState({play: false}, () => this.playAudio())
                }>
                <Icon
                  name="controller-paus"
                  type="Entypo"
                  style={{color: '#FF2D55', fontSize: 22}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{marginHorizontal: 8}}
                onPress={() =>
                  this.setState({play: true}, () => this.playAudio())
                }>
                <Icon
                  name="controller-play"
                  type="Entypo"
                  style={{color: '#FF2D55', fontSize: 22}}
                />
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={this.props.close}>
              <Icon
                name="close"
                type="AntDesign"
                style={{color: '#FF2D55', fontSize: 20}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animatable.View>
    );
  }
}

export default ViewBookAudio;
