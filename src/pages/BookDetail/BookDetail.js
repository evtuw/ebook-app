import React, {Component} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ImageBackground,
  StatusBar,
  RefreshControl,
  DeviceEventEmitter,
  ActivityIndicator,
} from 'react-native';
import {Icon} from 'native-base';
import {connect} from 'react-redux';
import {setWidth} from '../../cores/baseFuntion';
import {ScrollView} from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';
import {dispatchParams, getFromServer, postToServer} from '../../config';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../../config/server';
import {Images} from '../../assets/image';
import {formatDateNow} from '../../../components/until';
import {setCoinInDay} from '../../actions/action';
import HomeLatest from '../List/home-latest';
import LazyDetailBook from '../../../components/lazy-load/lazy-detail-book';

class BookDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      check: false,
      data: {},
      book_cate: [],
      book_author: [],
      lazyLoad: true,
      loading: false,
      isFavorite: false,
    };
  }

  componentDidMount = () => {
    const {navigation} = this.props;
    const {id: book_id} = navigation.state.params;
    this.getData(book_id);
    this.getListFavorite();
    this.listener = DeviceEventEmitter.addListener('LoadData', () =>
      this.onRefresh(),
    );
  };

  getData = async book_id => {
    const {accountInfo} = this.props;
    try {
      const response = await getFromServer(getApiUrl(API.BOOK_DETAIL), {
        token: accountInfo.access_token.token,
        book_id,
      });
      const allPromise = [
        this.getBookByCategory(response.data[0]?.category_id),
        this.getBookByAuthor(response.data[0].author_id),
      ];
      const [book_cate, book_author] = await Promise.all(allPromise);
      this.setState({
        data: response.data[0],
        book_author: book_author.data.filter(
          t => t.id !== response.data[0]?.id,
        ),
        book_cate: book_cate.data.filter(v => v.id !== response.data[0]?.id),
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({refreshing: false, lazyLoad: false});
    }
  };

  getBookByCategory = categoryId => {
    const {accountInfo} = this.props;
    return new Promise(resolve => {
      const response = getFromServer(getApiUrl(API.BOOK_BY_CATEGORY), {
        token: accountInfo.access_token.token,
        cat_id: categoryId,
        page: 1,
        page_size: 5,
      });
      return resolve(response);
    });
  };

  getBookByAuthor = authorId => {
    const {accountInfo} = this.props;
    return new Promise(resolve => {
      const response = getFromServer(getApiUrl(API.BOOK_BY_AUTHOR), {
        token: accountInfo.access_token.token,
        author_id: authorId,
        page: 1,
        page_size: 5,
      });
      return resolve(response);
    });
  };

  readNow = () => {
    const {navigation} = this.props;
    const {data} = this.state;
    navigation.navigate('ViewAllBookScreen', {data});
    this.recentBook(data.id);
  };

  recentBook = async book_id => {
    const {accountInfo} = this.props;
    try {
      await postToServer(getApiUrl(API.ADD_TO_RECENT), {
        user_id: accountInfo.id,
        book_id,
        token: accountInfo.access_token.token,
      });
    } catch (e) {
      console.log(e);
    }
  };

  getListFavorite = async () => {
    const {accountInfo, navigation} = this.props;
    const {id: book_id} = navigation.state.params;
    try {
      const response = await getFromServer(getApiUrl(API.BOOK_FAVORITE), {
        token: accountInfo.access_token.token,
        user_id: accountInfo.id,
      });
      if (response) {
        const favorite = response.data?.find(v => v.id === book_id);

        this.setState({isFavorite: !!favorite});
      }
    } catch (e) {
      console.log(e);
    }
  };

  getDetailBook = book_id => {
    this.setState({lazyLoad: true});
    this.getData(book_id);
  };

  addToFavorite = async () => {
    const {accountInfo} = this.props;
    const {data} = this.state;
    this.setState({loading: true});
    try {
      const response = await postToServer(getApiUrl(API.ADD_TO_FAVORITE), {
        user_id: accountInfo.id,
        book_id: data.id,
        token: accountInfo.access_token.token,
      });
      if (response.status === 1) {
        this.getListFavorite();
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({loading: false});
    }
  };

  onRefresh = () => {
    const {navigation} = this.props;
    const {id: book_id} = navigation.state.params;
    this.setState({refreshing: true}, () => this.getData(book_id));
  };

  refreshControl() {
    const {refreshing} = this.state;
    return (
      <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
    );
  }

  render() {
    const {navigation} = this.props;
    const {
      data,
      refreshing,
      book_cate,
      book_author,
      lazyLoad,
      loading,
      isFavorite,
    } = this.state;
    if (lazyLoad) return <LazyDetailBook />;
    return (
      <View style={styles.saf}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          animated
          barStyle="light-content"
        />
        <ScrollView
          refreshing={refreshing}
          refreshControl={this.refreshControl()}>
          <ImageBackground
            style={styles.imageHeader}
            source={
              data?.image
                ? {uri: HOST_IMAGE_UPLOAD + data?.image}
                : Images.thumbdefault
            }>
            <View style={styles.viewOpa} />
            <View style={styles.viewHeader}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="close" type="EvilIcons" style={styles.iconClose} />
              </TouchableOpacity>
              <View />
            </View>
            <View style={styles.viewla}>
              <View style={styles.body}>
                <CardView style={styles.cardView}>
                  <Image
                    style={styles.image}
                    source={
                      data?.image
                        ? {uri: HOST_IMAGE_UPLOAD + data?.image}
                        : Images.thumbdefault
                    }
                  />
                </CardView>
                <View style={styles.viewText}>
                  <Text style={styles.textName}>{data?.title}</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
          <View style={styles.viewNgang} />
          <View style={styles.viewTrong} />
          <View style={styles.viewDetail}>
            <Text style={styles.textTitle3}>Thông tin sách</Text>
            <View style={styles.textitem}>
              <Text style={styles.textcate}>Thể loại</Text>
              <Text style={styles.textnamecate}>
                {data?.category_name || 'Chưa cập nhật'}
              </Text>
            </View>
            <View style={styles.textitem}>
              <Text style={styles.textcate}>Tác giả</Text>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={
                    data?.author_avatar
                      ? {uri: HOST_IMAGE_UPLOAD + data.author_avatar}
                      : Images.avatarDefault
                  }
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    marginLeft: 16,
                    marginRight: 8,
                  }}
                />
                <Text style={styles.textnamecate}>
                  {data?.author_name || 'Chưa cập nhật'}
                </Text>
              </View>
            </View>
            <View style={styles.textitem}>
              <Text style={styles.textcate}>Lượt xem</Text>
              <Text style={styles.textnamecate}>{data?.view}</Text>
            </View>
            {/*<View style={styles.textitem}>*/}
            {/*  <Text style={styles.textcate}>Ngày xuất bản</Text>*/}
            {/*  <Text style={styles.textnamecate}>Thời gian</Text>*/}
            {/*  <View />*/}
            {/*</View>*/}
          </View>
          <View style={{marginBottom: 16}}>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                padding: 16,
                borderWidth: 1,
                borderColor: '#00c068',
              }}
              onPress={this.addToFavorite}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color={'#00c068'} />
              ) : (
                <Text style={{color: '#00c068', fontSize: 16}}>
                  {isFavorite
                    ? 'Đã thêm vào danh sách yêu thích'
                    : 'Thêm vào yêu thích'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.viewTrong} />
          <View style={styles.viewSp}>
            <Text style={styles.textTitle}>Mô tả</Text>
            <Text
              style={{
                margin: 12,
                textAlign: 'justify',
                fontSize: 18,
                color: '#AAA',
              }}>
              {data?.description || 'Chưa có mô tả'}
            </Text>
          </View>
          <View style={styles.viewSp}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.textTitle, {flex: 1}]}>Bình luận</Text>
              {data.user_comments && data.user_comments.length > 3 && (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ListCommentScreen', {id: data.id})
                  }>
                  <Text style={{color: '#00c068', marginRight: 16}}>
                    Xem thêm
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <FlatList
              data={data?.user_comments}
              ItemSeparatorComponent={() => (
                <View style={{borderColor: 'whitesmoke', borderWidth: 0.5}} />
              )}
              renderItem={({item}) => (
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 16,
                    alignItems: 'center',
                    paddingVertical: 16,
                  }}>
                  <Image
                    source={
                      item.avatar
                        ? {uri: HOST_IMAGE_UPLOAD + JSON.parse(item.avatar)[0]}
                        : Images.avatarDefault
                    }
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                    }}
                  />
                  <View style={{flex: 1, marginLeft: 16}}>
                    <Text style={{fontSize: 16, color: '#999'}}>
                      {item.name}
                    </Text>
                    <Text>{item.content}</Text>
                  </View>
                  <Text>{formatDateNow(item.created_at)}</Text>
                </View>
              )}
              ListEmptyComponent={() => (
                <View style={{marginLeft: 12}}>
                  <Text style={{color: '#999'}}>Chưa có bình luận nào.</Text>
                </View>
              )}
              keyExtractor={() => String(Math.random())}
            />
          </View>

          {book_author?.length > 0 && (
            <View style={styles.viewSp}>
              <Text style={[styles.textTitle, {flex: 1}]}>
                Sách cùng tác giả
              </Text>
              <HomeLatest
                data={book_author}
                navigation={navigation}
                horizontal
                getDetailBook={this.getDetailBook}
              />
            </View>
          )}

          {book_cate?.length > 0 && (
            <View style={styles.viewSp}>
              <Text style={[styles.textTitle, {flex: 1}]}>
                Sách cùng thể loại
              </Text>
              <HomeLatest
                data={book_cate}
                navigation={navigation}
                horizontal
                getDetailBook={this.getDetailBook}
              />
            </View>
          )}
        </ScrollView>
        <View style={styles.viewFooter}>
          <TouchableOpacity style={styles.toRead} onPress={this.readNow}>
            <Text style={styles.textFooter}>ĐỌC NGAY</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toRead,
              {backgroundColor: '#FFF', borderColor: '#00c068', borderWidth: 1},
            ]}
            onPress={() =>
              navigation.navigate('ListCommentScreen', {id: data.id})
            }>
            <Text style={{color: '#00c068'}}>XEM BÌNH LUẬN</Text>
          </TouchableOpacity>
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
  imageHeader: {
    height: setWidth('50%'),
    justifyContent: 'center',
  },
  viewOpa: {
    backgroundColor: '#272525b3',
    height: setWidth('50%'),
    justifyContent: 'center',
  },
  viewla: {
    position: 'absolute',
    top: setWidth('16%'),
  },
  viewHeader: {
    top: setWidth('6.5%'),
    left: setWidth('3%'),
    position: 'absolute',
  },
  iconClose: {
    fontSize: setWidth('9%'),
    color: '#fff',
  },
  body: {
    flexDirection: 'row',
    paddingHorizontal: setWidth('3%'),
  },
  viewText: {
    width: setWidth('50%'),
    marginTop: setWidth('5%'),
  },
  cardView: {
    marginLeft: setWidth('7%'),
    marginRight: setWidth('7%'),
  },
  image: {
    width: setWidth('30%'),
    height: setWidth('45%'),
  },
  textName: {
    fontSize: setWidth('4.5%'),
    marginBottom: setWidth('3%'),
    color: '#fff',
  },
  textAuthor: {
    fontSize: setWidth('3.6%'),
    color: '#fff',
  },
  textDescribe: {
    marginBottom: setWidth('3%'),
  },
  textMore: {
    fontSize: setWidth('4%'),
    color: '#FF2D55',
  },
  viewNgang: {
    marginVertical: setWidth('7%'),
  },
  viewdown: {alignItems: 'center', marginTop: setWidth('2%')},
  icondown: {
    color: '#FF2D55',
    marginBottom: setWidth('3%'),
    marginTop: setWidth('2%'),
    fontSize: setWidth('6%'),
  },
  viewDes: {
    paddingHorizontal: setWidth('3%'),
  },
  textTitleDes: {
    fontSize: setWidth('5%'),
    marginBottom: setWidth('2%'),
  },
  textDes: {
    fontSize: setWidth('4%'),
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemModal: {
    paddingHorizontal: setWidth('2%'),
    width: setWidth('85%'),
    backgroundColor: '#fff',
    borderRadius: setWidth('3%'),
  },
  tittleModal: {
    fontSize: setWidth('5%'),
    fontWeight: '500',
    textAlign: 'center',
    paddingVertical: setWidth('3%'),
  },
  viewNgang2: {
    height: setWidth('0.2%'),
    backgroundColor: 'silver',
    marginBottom: setWidth('2%'),
  },
  viewButtonModal: {
    borderRadius: setWidth('2%'),
    borderColor: '#FF2D55',
    borderWidth: setWidth('0.2%'),
    width: setWidth('70%'),
    height: setWidth('10%'),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: setWidth('3%'),
    marginLeft: setWidth('4.5%'),
  },
  btnCancel: {
    color: '#FF2D55',
    fontSize: setWidth('5%'),
    fontWeight: '500',
  },
  saparator: {
    height: setWidth('0.2%'),
    backgroundColor: 'silver',
    marginVertical: setWidth('4%'),
  },
  viewTrong: {
    backgroundColor: '#D4D4D4',
    width: setWidth('100%'),
    height: setWidth('1.7%'),
  },
  viewDetail: {
    padding: setWidth('5%'),
  },
  textTitle3: {
    fontSize: setWidth('5%'),
  },
  textitem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: setWidth('3%'),
    marginTop: setWidth('3%'),
    borderTopWidth: setWidth('0.1%'),
    borderTopColor: 'silver',
  },
  textcate: {
    color: 'gray',
    width: setWidth('30%'),
    fontSize: setWidth('4%'),
  },
  textnamecate: {
    width: setWidth('55%'),
    fontSize: setWidth('4%'),
  },
  iconright: {
    color: 'silver',
    fontSize: setWidth('8%'),
    width: setWidth('5%'),
  },
  viewSp: {
    paddingVertical: setWidth('3%'),
  },
  textTitle: {
    fontSize: setWidth('4.7%'),
    marginHorizontal: setWidth('3%'),
  },
  item2: {
    marginHorizontal: setWidth('2%'),
    marginBottom: setWidth('3%'),
  },
  image2: {
    width: setWidth('28%'),
    height: setWidth('40%'),
  },
  textTitle2: {marginTop: setWidth('1%'), width: setWidth('28%')},
  viewFooter: {
    height: setWidth('14%'),
    borderTopColor: 'silver',
    borderTopWidth: setWidth('0.1%'),
    alignItems: 'center',
    flexDirection: 'row',
  },
  toRead: {
    width: setWidth('80%'),
    height: setWidth('11%'),
    backgroundColor: '#00c068',
    borderRadius: setWidth('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 16,
  },
  textFooter: {
    color: '#fff',
  },
});

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
  coinInDay: state.coinInDayReducer,
});

const matchDispatchToProps = dispatch => {
  return {
    setCoinInDay: data => {
      dispatch(setCoinInDay(data));
    },
    dispatchParams: (data, type) => {
      dispatch(dispatchParams(data, type));
    },
  };
};

export default connect(
  mapStateToProps,
  matchDispatchToProps,
)(BookDetail);
