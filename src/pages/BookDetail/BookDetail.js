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
} from 'react-native';
import {Icon} from 'native-base';
import {connect} from 'react-redux';
import {setWidth} from '../../cores/baseFuntion';
import {ScrollView} from 'react-native-gesture-handler';
import CardView from 'react-native-cardview';
import FastImage from 'react-native-fast-image';
import {dispatchParams, getFromServer} from '../../config';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../../config/server';
import {Images} from '../../assets/image';
import {formatDateNow} from '../../../components/until';
import {setCoinInDay} from '../../actions/action';
import {saveAccountInfo} from '../../config/storage';
import {accountActionTypes} from '../../actions/type';
class BookDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      check: false,
      data: {},
    };
  }

  componentDidMount = () => {
    const {navigation} = this.props;
    const {id: book_id} = navigation.state.params;
    this.getData(book_id);
  };

  getData = async book_id => {
    const {accountInfo} = this.props;
    try {
      const response = await getFromServer(getApiUrl(API.BOOK_DETAIL), {
        token: accountInfo.access_token.token,
        book_id,
      });
      this.setState({data: response.data[0]});
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  readNow = () => {
    const {navigation, accountInfo} = this.props;
    const {data} = this.state;
    let newCoin = accountInfo.coinInDay + 100;
    this.props.setCoinInDay(newCoin);
    this.props.dispatchParams(
      {...accountInfo, coinInDay: newCoin, coin: accountInfo.coin + 100},
      accountActionTypes.APP_USER_INFO,
    );
    saveAccountInfo({
      ...accountInfo,
      coinInDay: newCoin,
      coin: accountInfo.coin + 100,
    });
    navigation.navigate('ViewAllBookScreen', {data});
  };

  render() {
    const {navigation} = this.props;
    const {data} = this.state;
    return (
      <View style={styles.saf}>
        <StatusBar translucent backgroundColor="transparent" animated barStyle="light-content" />
        <ScrollView>
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
                  <Text style={styles.textAuthor}>Author</Text>
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
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ListCommentScreen', {id: data.id})
                }>
                <Text style={{color: '#F2994A', marginRight: 16}}>
                  Xem thêm
                </Text>
              </TouchableOpacity>
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
                        ? {uri: HOST_IMAGE_UPLOAD + item.avatar}
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
        </ScrollView>
        <View style={styles.viewFooter}>
          <TouchableOpacity style={styles.toRead} onPress={this.readNow}>
            <Text style={styles.textFooter}>ĐỌC NGAY</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toRead,
              {backgroundColor: '#FFF', borderColor: '#2D9CDB', borderWidth: 1},
            ]}
            onPress={() =>
              navigation.navigate('ListCommentScreen', {id: data.id})
            }>
            <Text style={{color: '#000'}}>XEM BÌNH LUẬN</Text>
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
    width: setWidth('66%'),
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
    backgroundColor: '#2D9CDB',
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
