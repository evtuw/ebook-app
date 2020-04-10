import React, {Component} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Text, Icon} from 'native-base';
import HeaderComponent from '../components/headerComponents';
import {connect} from 'react-redux';
import {getFromServer} from '../config';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../config/server';
import {formatDateNow} from '../../components/until';
import {Images} from '../assets/image';

class Bookcase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: [],
      recents: [],
      loading: true,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    try {
      const promises = [this.getListFavorite(), this.getListRecent()];
      const [favorites, recents] = await Promise.all(promises);
      this.setState({favorites: favorites.data, recents: recents.data});
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({loading: false, refreshing: false});
    }
  };

  getListFavorite = () => {
    const {accountInfo} = this.props;
    return new Promise(resolve => {
      const response = getFromServer(getApiUrl(API.BOOK_FAVORITE), {
        token: accountInfo.access_token.token,
        user_id: accountInfo.id,
      });
      return resolve(response);
    });
  };

  getListRecent = () => {
    const {accountInfo} = this.props;
    return new Promise(resolve => {
      const response = getFromServer(getApiUrl(API.BOOK_RECENT), {
        token: accountInfo.access_token.token,
        user_id: accountInfo.id,
      });
      return resolve(response);
    });
  };

  onRefresh = () => {
    this.setState({refreshing: true}, () => this.getData());
  };

  refreshControl() {
    const {refreshing} = this.state;
    return (
      <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
    );
  }

  renderRecent = ({item}) => {
    let bg = '';
    let text = '';

    if (item.is_latest === 0 && item.featured === 0) {
      bg = 'rgba(11,130,255,0.5)';
      text = 'Popular';
    } else if (item.is_latest === 0 && item.featured === 1) {
      bg = 'rgba(240,224,69,0.5)';
      text = 'Featured';
    } else {
      bg = 'rgba(189,81,108,0.5)';
      text = 'Latest';
    }

    return (
      <TouchableOpacity
        onPress={() => this.onNavigateToDetail(item.id)}
        style={{
          marginRight: 10,
          width: Dimensions.get('window').width / 2 - 50,
        }}>
        <Image
          source={
            item.image
              ? {uri: HOST_IMAGE_UPLOAD + item.image}
              : Images.thumbdefault
          }
          style={{
            width: Dimensions.get('window').width / 2 - 50,
            height: 200,
            borderRadius: 4,
          }}
        />
        <View
          style={{
            position: 'absolute',
            borderRadius: 4,
            padding: 4,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 8,
            backgroundColor: bg,
          }}>
          <Text style={{color: '#FFF'}}>{text}</Text>
        </View>
        <Text style={{marginTop: 8, fontSize: 16}} numberOfLines={1}>
          {item.title}
        </Text>
        <Text note>Đọc gần nhất: {formatDateNow(item.recent_read)}</Text>
      </TouchableOpacity>
    );
  };

  onNavigateToDetail = id => {
    const {navigation} = this.props;
    navigation.navigate('BookDetailScreen', {id});
  };

  renderFavorite = ({item}) => {
    let bg = '';
    let text = '';

    if (item.is_latest === 0 && item.featured === 0) {
      bg = 'rgba(11,130,255,0.5)';
      text = 'Popular';
    } else if (item.is_latest === 0 && item.featured === 1) {
      bg = 'rgba(240,224,69,0.5)';
      text = 'Featured';
    } else {
      bg = 'rgba(189,81,108,0.5)';
      text = 'Latest';
    }

    return (
      <TouchableOpacity
        onPress={() => this.onNavigateToDetail(item.id)}
        style={{
          marginRight: 10,
          width: Dimensions.get('window').width / 2 - 50,
        }}>
        <Image
          source={
            item.image
              ? {uri: HOST_IMAGE_UPLOAD + item.image}
              : Images.thumbdefault
          }
          style={{
            width: Dimensions.get('window').width / 2 - 50,
            height: 200,
            borderRadius: 4,
          }}
        />
        <View
          style={{
            position: 'absolute',
            borderRadius: 4,
            padding: 4,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 8,
            backgroundColor: bg,
          }}>
          <Text style={{color: '#FFF'}}>{text}</Text>
        </View>
        <View style={{position: 'absolute', right: 10, top: 5}}>
          <Icon
            name={'heart'}
            type={'FontAwesome'}
            style={{color: 'rgba(255,16,27,0.8)'}}
          />
        </View>
        <Text style={{marginTop: 8, fontSize: 16}} numberOfLines={1}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {navigation} = this.props;
    const {favorites, recents, loading, refreshing} = this.state;
    if (loading)
      return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator color={'#FF2D55'} animating size="small" />
        </View>
      );
    return (
      <View style={styles.saf}>
        <HeaderComponent
          navigation={navigation}
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title="Tủ sách"
          onPressLeft={this.goBack}
        />
        <ScrollView
          refreshControl={this.refreshControl()}
          refreshing={refreshing}>
          <View style={{margin: 16}}>
            <Text style={{fontSize: 18}}>Sách đã đọc gần đây</Text>
            <FlatList
              data={recents}
              maxToRenderPerBatch={6}
              horizontal
              removeClippedSubviews
              style={{marginTop: 16}}
              renderItem={this.renderRecent}
              showsHorizontalScrollIndicator={false}
              keyExtractor={() => String(Math.random())}
            />
          </View>
          <View style={{margin: 16}}>
            <Text style={{fontSize: 18}}>Sách yêu thích</Text>
            <FlatList
              data={favorites}
              horizontal
              style={{marginTop: 16}}
              showsHorizontalScrollIndicator={false}
              renderItem={this.renderFavorite}
              keyExtractor={() => String(Math.random())}
            />
          </View>
        </ScrollView>
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

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(Bookcase);
