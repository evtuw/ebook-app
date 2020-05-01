import React, {PureComponent} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Icon, Text} from 'native-base';
import ViewBookAudio from '../pages/view-book-audio';
import TrackPlayer from 'react-native-track-player';
import ItemAudio from '../pages/List-detail/audio-item';
import {connect} from 'react-redux';
import {getFromServer} from '../config';
import {API, getApiUrl} from '../config/server';
import {Images} from '../assets/image';
import color from '../assets/static-data/color';

class AudioBook extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      play: false,
      isShow: false,
      dataSound: {},
      page: 1,
      keyword: '',
      refreshing: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const {accountInfo} = this.props;
    const {page, keyword, data, refreshing} = this.state;
    if (!refreshing) {
      this.setState({loading: true});
    }
    try {
      const response = await getFromServer(getApiUrl(API.LIST_AUDIO), {
        page,
        page_size: 50,
        keyword,
        token: accountInfo.access_token.token,
      });
      this.setState({
        data: page === 1 ? response.data : [...data, ...response.data],
      });
    } catch (e) {
    } finally {
      this.setState({loading: false, refreshing: false});
    }
  };

  playAudio = async item => {
    await this.close();
    setTimeout(() => {
      this.setState({dataSound: item, isShow: true});
    }, 100);
  };

  close = () => {
    this.setState({isShow: false});
  };

  renderItem = ({item, index}) => {
    const {play} = this.state;
    return (
      <ItemAudio
        play={play}
        playAudio={this.playAudio}
        item={item}
        index={index}
      />
    );
  };

  onRefresh = async () => {
    await this.setState({refreshing: true, page: 1});
    this.getData();
  };

  refreshControl() {
    const {refreshing} = this.state;
    return (
      <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
    );
  }

  render() {
    const {data, isShow, dataSound, refreshing, loading} = this.state;
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        {isShow && (
          <View
            style={{
              position: 'absolute',
              top: StatusBar.currentHeight - 20,
              width: '100%',
              zIndex: 999,
            }}>
            <ViewBookAudio close={this.close} data={dataSound} />
          </View>
        )}
        <ScrollView
          refreshing={refreshing}
          refreshControl={this.refreshControl()}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 24,
              marginLeft: 24,
              alignItems: 'center',
              marginRight: 16,
            }}>
            <Image source={Images.iconLogin2} style={{width: 26, height: 26}} />
            <Text
              style={{
                fontSize: 26,
                color: color.primaryColor,
                fontWeight: 'bold',
                marginLeft: 8,
                fontStyle: 'italic',
                flex: 1,
              }}>
              AudioBook
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Notification')}>
              <Icon
                name={'ios-notifications-outline'}
                type={'Ionicons'}
                style={{
                  fontSize: 24,
                  color: color.primaryColor,
                }}
              />
            </TouchableOpacity>
          </View>
          {loading ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator color={color.primaryColor} />
            </View>
          ) : (
            <View style={{marginTop: 16, marginBottom: 64}}>
              <FlatList
                data={data}
                renderItem={this.renderItem}
                removeClippedSubviews
                keyExtractor={() => String(Math.random())}
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
    padding: 16,
    borderRadius: 6,
  },
});

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(AudioBook);
