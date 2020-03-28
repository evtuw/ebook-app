import React, {PureComponent} from 'react';
import {
  Image,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  RefreshControl,
} from 'react-native';
// import Swiper from 'react-native-swiper';
// import TrackPlayer from 'react-native-track-player';

import {ScrollView} from 'react-native-gesture-handler';
import {Icon} from 'native-base';
import {connect} from 'react-redux';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../config/server';
import HomeLatest from './List/home-latest';
import {getFromServer} from '../config';
import HomeFeatured from './List/home-featured';
import HomePopular from './List/home-popular';
import CategoryHome from './List/category-home';
import AuthorHome from './List/author-home';
import {LazyLoadingProduct} from '../../components/lazy-load';

class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      latest: [],
      featured: [],
      popular: [],
      authors: [],
      categories: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.getData();
    const date = new Date();
    if (date.getHours() < 12 && date.getHours() >= 6) {
      this.setState({textHello: 'Chào buổi sáng!'});
    }
    if (date.getHours() >= 12 && date.getHours() < 18) {
      this.setState({textHello: 'Chào buổi chiều!'});
    }
    if (
      (date.getHours() >= 18 && date.getHours() < 24) ||
      (date.getHours() >= 0 && date.getHours() < 6)
    ) {
      this.setState({textHello: 'Chào buổi tối!'});
    }
  }

  getData = async () => {
    const {accountInfo} = this.props;

    try {
      const response = await getFromServer(getApiUrl(API.HOME), {
        token: accountInfo.access_token.token,
      });
      this.setState({
        latest: response.data.latest_books,
        featured: response.data.featured_books,
        popular: response.data.popular_books,
        authors: response.data.authors,
        categories: response.data.categories,
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({loading: false, refreshing: false});
    }
  };

  componentWillUnmount() {}

  /**
   * get random color
   * @returns {string}
   */
  getRandomColor = () => {
    const letters = '0123456789abcdef';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  getFirstNameLetter = name => {
    if (name.trim() !== '') {
      let nameSplit = name.split(' ');
      let letter = nameSplit[0].substring(0, 1);
      return letter.toUpperCase();
    }
    return ' ';
  };

  onRefresh = () => {
    this.setState(
      {
        loading: true,
        latest: [],
        featured: [],
        popular: [],
        authors: [],
        categories: [],
      },
      () => this.getData(),
    );
  };

  refreshControl() {
    const {refreshing} = this.state;
    return (
      <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
    );
  }

  render() {
    const {navigation, accountInfo, coinInDay} = this.props;
    const {navigate} = navigation;
    const {
      textHello,
      latest,
      featured,
      popular,
      categories,
      authors,
      loading,
      refreshing,
    } = this.state;
    return (
      <View style={styles.saf}>
        <ScrollView
          refreshing={refreshing}
          refreshControl={this.refreshControl()}>
          <View
            style={{flexDirection: 'row', margin: 24, alignItems: 'center'}}>
            {accountInfo.avatar ? (
              <Image source={{uri: HOST_IMAGE_UPLOAD + accountInfo.avatar}} />
            ) : (
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: this.getRandomColor(),
                  borderRadius: 30,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: '#FFF', fontSize: 30}}>
                  {this.getFirstNameLetter(accountInfo.name)}
                </Text>
              </View>
            )}
            <View style={{flexDirection: 'row', marginHorizontal: 16}}>
              <Text style={{fontSize: 22, color: '#3F3356'}}>
                {accountInfo?.name.substring(0, 5).trim()},{' '}
              </Text>
              <Text style={{fontSize: 22, color: '#3F3356'}}>{textHello}</Text>
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text style={{color: '#3F3356', fontSize: 14}}>
              Số coin kiếm được trong ngày
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={{color: '#3F3356', fontSize: 20, marginTop: 8}}>
                {accountInfo.coinInDay}
              </Text>
              <Icon
                name="coin"
                style={{color: '#f0a901', fontSize: 16}}
                type="MaterialCommunityIcons"
              />
            </View>
          </View>

          <View style={{alignItems: 'center'}}>
            <View style={styles.viewSearch}>
              <Icon
                name="search"
                style={{fontSize: 24, color: '#CCC', marginLeft: 8}}
              />
              <TouchableOpacity
                style={{marginLeft: 8, flex: 1}}
                onPress={() => navigation.navigate('ListBookSearch')}>
                <Text style={{color: '#AAA'}}>Nhập tên sách cần tìm</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              marginHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 22, color: '#3F3356'}}>Mới nhất</Text>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => navigation.navigate('LatestScreen')}>
              <Text style={{color: '#F2994A'}}>Xem thêm</Text>
              <Icon
                name="chevron-right"
                type="MaterialCommunityIcons"
                style={{color: '#F2994A', fontSize: 16}}
              />
            </TouchableOpacity>
          </View>

          <LazyLoadingProduct length={3} visible={loading} horizontal />

          <HomeLatest data={latest} horizontal navigation={navigation} />

          <View
            style={{
              marginHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 22, color: '#3F3356'}}>Đặc sắc</Text>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => navigation.navigate('FeaturedScreen')}>
              <Text style={{color: '#F2994A'}}>Xem thêm</Text>
              <Icon
                name="chevron-right"
                type="MaterialCommunityIcons"
                style={{color: '#F2994A', fontSize: 16}}
              />
            </TouchableOpacity>
          </View>

          <LazyLoadingProduct length={3} visible={loading} horizontal />

          <HomeFeatured data={featured} navigation={navigation} horizontal />
          <View
            style={{
              marginHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 22, color: '#3F3356'}}>Phổ biến</Text>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => navigation.navigate('PopularScreen')}>
              <Text style={{color: '#F2994A'}}>Xem thêm</Text>
              <Icon
                name="chevron-right"
                type="MaterialCommunityIcons"
                style={{color: '#F2994A', fontSize: 16}}
              />
            </TouchableOpacity>
          </View>

          <LazyLoadingProduct length={3} visible={loading} horizontal />
          <HomePopular data={popular} navigation={navigation} horizontal />
          <View
            style={{
              marginHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 22, color: '#3F3356'}}>Thể loại</Text>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => navigation.navigate('CategoryScreen')}>
              <Text style={{color: '#F2994A'}}>Xem thêm</Text>
              <Icon
                name="chevron-right"
                type="MaterialCommunityIcons"
                style={{color: '#F2994A', fontSize: 16}}
              />
            </TouchableOpacity>
          </View>
          <CategoryHome data={categories} navigation={navigation} />
          <View
            style={{
              marginHorizontal: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 22, color: '#3F3356'}}>Tác giả</Text>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => navigation.navigate('AuthorsScreen')}>
              <Text style={{color: '#F2994A'}}>Xem thêm</Text>
              <Icon
                name="chevron-right"
                type="MaterialCommunityIcons"
                style={{color: '#F2994A', fontSize: 16}}
              />
            </TouchableOpacity>
          </View>
          <AuthorHome data={authors} navigation={navigation} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  saf: {
    flex: 1,
    backgroundColor: '#fff',
  },
  viewSearch: {
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 48,
    width: '90%',
    marginVertical: 16,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
  coinInDay: state.coinInDayReducer,
});

export default connect(mapStateToProps)(Home);
