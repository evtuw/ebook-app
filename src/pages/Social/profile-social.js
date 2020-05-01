import React, {PureComponent} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  RefreshControl,
  TouchableWithoutFeedback,
  StyleSheet,
  VirtualizedList,
  Alert,
} from 'react-native';
import {Icon} from 'native-base';
import HeaderComponent from '../../components/headerComponents';
import {Images} from '../../assets/image';
import color from '../../assets/static-data/color';
import FastImage from 'react-native-fast-image';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../../config/server';
import {connect} from 'react-redux';
import {getFromServer} from '../../config';
import {setWidth} from '../../cores/baseFuntion';
import {formatDateNow} from '../../../components/until';

const {width: dvWidth} = Dimensions.get('window');

class ProfileSocial extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 1,
      lazy: false,
      refreshing: false,
      info: null,
      listImage: [],
    };
  }

  async componentDidMount() {
    const {navigation} = this.props;
    const {user_id} = navigation.state.params;
    await this.getInfo(user_id);
    this.getData();
  }

  getInfo = async id => {
    const {accountInfo} = this.props;
    try {
      const response = await getFromServer(getApiUrl(API.INFO_PROFILE), {
        token: accountInfo.access_token.token,
        id,
      });
      if (response.status === 1) {
        this.setState({info: response.data});
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  getData = async () => {
    const {accountInfo, navigation} = this.props;
    const {category_id, page, data} = this.state;
    const {user_id} = navigation.state.params;
    try {
      const response = await getFromServer(getApiUrl(API.LIST_POST), {
        token: accountInfo.access_token.token,
        page,
        page_size: 50,
        category_id,
      });
      let listImage = [];
      console.log(response);
      const newData = response.data.filter(t => t.user_id === user_id);
      newData.forEach(item => {
        const dataImage = JSON.parse(item.image);
        if (item.image) {
          listImage = [...listImage, ...dataImage];
        }
      });
      this.setState({
        data: page === 1 ? newData : [...data, ...newData],
        listImage,
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({refreshing: false, lazy: false});
    }
  };

  onRefresh = async () => {
    await this.setState({refreshing: true, page: 1, lazy: true, data: []});
    this.getData();
  };

  refreshControl() {
    const {refreshing} = this.state;
    return (
      <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
    );
  }

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  renderItem = ({item}) => {
    const {navigation} = this.props;
    const dataImage = item.image !== null ? JSON.parse(item.image) : [];
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate('NewsDetailScreen', {data: item, visible: false})
        }
        disabled={item.is_confirm === 0}>
        <View
          style={{
            backgroundColor: '#FFF',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            marginBottom: 16,
            padding: 16,
            width: dvWidth - 32,
            borderRadius: 4,
          }}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              // onPress={() => navigation.navigate('MyProfileScreen')}
              style={{flexDirection: 'row', flex: 1}}>
              <Image
                source={
                  item.avatar_author
                    ? {
                        uri:
                          HOST_IMAGE_UPLOAD + JSON.parse(item.avatar_author)[0],
                      }
                    : Images.avatarDefault
                }
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                }}
                resizeMode="cover"
              />
              <View style={{marginLeft: 16, flex: 1}}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: '#000',
                  }}>
                  {item.author}
                </Text>
                <Text style={{color: '#A7A9BC', fontSize: 12}}>
                  {formatDateNow(item.created_at)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{marginVertical: 8}}>
            <Text numberOfLines={4}>{item.content}</Text>
          </View>
          <View
            style={{
              flex: 1,
              flexWrap: 'wrap',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {dataImage !== null &&
              dataImage.map((v, index) => {
                if (index === 0) {
                  return (
                    <TouchableOpacity
                      disabled={item.is_active === 0}
                      onPress={() =>
                        navigation.navigate('NewsDetailScreen', {
                          data: item,
                          visible: false,
                        })
                      }>
                      <FastImage
                        source={{
                          uri: HOST_IMAGE_UPLOAD + v,
                          priority: FastImage.priority.high,
                        }}
                        style={{
                          width: setWidth('82%'),
                          height:
                            dataImage.length === 1
                              ? setWidth('50')
                              : setWidth('40%'),
                          borderRadius: 4,
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  );
                }
                if (index <= 1) {
                  return (
                    <TouchableOpacity
                      style={{
                        marginVertical: 8,
                      }}
                      onPress={() =>
                        navigation.navigate('NewsDetailScreen', {
                          data: item,
                          visible: false,
                        })
                      }>
                      <FastImage
                        source={{uri: HOST_IMAGE_UPLOAD + v}}
                        style={{
                          width: setWidth('40%'),
                          height: setWidth('40%'),
                          borderRadius: 4,
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  );
                }
                if (index === 2) {
                  return (
                    <TouchableOpacity
                      style={{
                        marginVertical: 8,
                      }}
                      onPress={() =>
                        navigation.navigate('NewsDetailScreen', {
                          data: item,
                          visible: false,
                        })
                      }>
                      <FastImage
                        source={{uri: HOST_IMAGE_UPLOAD + v}}
                        style={{
                          width: setWidth('40%'),
                          height: setWidth('40%'),
                          borderRadius: 4,
                        }}
                        resizeMode="cover"
                      />
                      {dataImage.length > 3 ? (
                        <View style={styles.viewAbsoluteImg}>
                          <View style={styles.viewLengthImg}>
                            <Text style={styles.txtLength}>
                              + {dataImage.length - 3}
                            </Text>
                            <Text style={styles.labelImg}> ẢNH</Text>
                          </View>
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                }
                return null;
              })}
          </View>
          <View style={{marginTop: 16}}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderTopColor: 'whitesmoke',
                borderTopWidth: 1,
                paddingTop: 16,
                justifyContent: 'center',
              }}
              disabled={item.is_confirm === 0}
              onPress={() => this.navigateDetail(item)}>
              <Icon
                name="commenting-o"
                type="FontAwesome"
                style={{
                  fontSize: 22,
                  fontWeight: 'normal',
                  color: '#AAA',
                }}
              />
              <Text style={{marginLeft: 8, color: '#AAA'}}>
                Bình luận ({item.user_comments || 0}){' '}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  navigateDetail = item => {
    const {navigation} = this.props;
    navigation.navigate('NewsDetailScreen', {data: item, visible: true});
  };

  regexStringToTag = str => {
    let r = str;
    r = r.replace(new RegExp(/\s/g), '');
    r = r.replace(new RegExp(/[àáâãäå]/g), 'a');
    r = r.replace(new RegExp(/æ/g), 'ae');
    r = r.replace(new RegExp(/ç/g), 'c');
    r = r.replace(new RegExp(/đ/g), 'd');
    r = r.replace(new RegExp(/[èéêë]/g), 'e');
    r = r.replace(new RegExp(/[ìíîï]/g), 'i');
    r = r.replace(new RegExp(/ñ/g), 'n');
    r = r.replace(new RegExp(/[òóôõöơớố]/g), 'o');
    r = r.replace(new RegExp(/œ/g), 'oe');
    r = r.replace(new RegExp(/[ùúûüư]/g), 'u');
    r = r.replace(new RegExp(/[ýÿ]/g), 'y');
    r = r.replace(new RegExp(/\W/g), '');
    return r;
  };

  renderImage = ({item, index}) => {
    const {navigation} = this.props;
    const {listImage} = this.state;
    if (index <= 5) {
      return (
        <TouchableOpacity
          style={{margin: 4, flex: 1}}
          onPress={() =>
            navigation.navigate('AlbumAll', {
              data: listImage,
            })
          }>
          <Image
            style={{
              width: '100%',
              height: dvWidth * 0.3,
              borderRadius: 6,
              borderWidth: 0.3,
              borderColor: color.primaryColor,
            }}
            source={{uri: HOST_IMAGE_UPLOAD + item}}
          />
        </TouchableOpacity>
      );
    }
    return null;
  };

  formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
    while (
      numberOfElementsLastRow !== numColumns &&
      numberOfElementsLastRow !== 0
    ) {
      data.push({key: `blank-${numberOfElementsLastRow}`, empty: true});
      numberOfElementsLastRow++;
    }

    return data;
  };

  alert = () => {
    Alert.alert(
      'E Book App',
      'Tính năng đang được phát triển, vui lòng thử lại sau. Xin cảm ơn!',
    );
  };

  render() {
    const {navigation, accountInfo} = this.props;
    const {data, info, listImage} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <HeaderComponent
          navigation={navigation}
          left
          right
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title={info?.name || 'Trang cá nhân'}
          onPressLeft={this.goBack}
        />
        <ScrollView
          refreshControl={this.refreshControl()}
          showsVerticalScrollIndicator={false}>
          <View style={{margin: 16, alignItems: 'center'}}>
            <View style={{position: 'absolute'}}>
              <Image
                source={Images.thumbdefault}
                style={{
                  width: dvWidth - 32,
                  height: dvWidth / 2,
                  borderRadius: 6,
                }}
              />
            </View>
            <View style={{marginTop: dvWidth / 3, alignItems: 'center'}}>
              <TouchableOpacity>
                <Image
                  source={
                    info?.avatar
                      ? {
                          uri: HOST_IMAGE_UPLOAD + JSON.parse(info.avatar)[0],
                        }
                      : Images.avatarDefault
                  }
                  style={{
                    width: dvWidth * 0.3 - 5,
                    height: dvWidth * 0.3 - 5,
                    borderColor: '#FFF',
                    borderWidth: 2,
                    borderRadius: (dvWidth * 0.3 - 5) / 2,
                  }}
                />
              </TouchableOpacity>
              <View
                style={{position: 'absolute', top: 50, alignItems: 'center'}}>
                <Text
                  style={{fontWeight: 'bold', color: '#FFF6', fontSize: 16}}>
                  E BOOK APP
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: 'bold',
                  marginLeft: 12,
                  marginTop: 8,
                }}>
                {info?.name}
              </Text>
              <View>
                <Text style={{color: color.primaryColor, marginTop: 8}}>
                  ({data?.length} bài đăng)
                </Text>
              </View>
              {info?.id !== accountInfo.id ? (
                <TouchableOpacity
                  style={{
                    width: setWidth('80%'),
                    backgroundColor: color.primaryColor,
                    padding: 10,
                    borderRadius: 6,
                    marginTop: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={this.alert}>
                  <Text style={{color: color.white}}>Theo dõi</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          <View style={{padding: 16}}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  width: 3,
                  height: 20,
                  backgroundColor: color.primaryColor,
                }}
              />
              <Text style={{marginLeft: 8, fontWeight: 'bold'}}>
                Thông tin cá nhân
              </Text>
            </View>
            <View>
              <View style={{flexDirection: 'row', marginTop: 8}}>
                <Icon
                  name={'location'}
                  type={'EvilIcons'}
                  style={{width: 30}}
                />
                <Text style={{padding: 4}}>
                  {info?.address || 'Chưa cập nhật'}
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 8}}>
                <Icon
                  name={'envelope'}
                  type={'EvilIcons'}
                  style={{width: 30}}
                />
                <Text style={{padding: 4}}>
                  {info?.email || 'Chưa cập nhật'}
                </Text>
              </View>
              <View style={{flexDirection: 'row', marginTop: 8}}>
                <Icon
                  name={'phone'}
                  type={'SimpleLineIcons'}
                  style={{fontSize: 18, width: 30, paddingLeft: 4}}
                />
                <Text style={{padding: 4}}>
                  {info?.phone || 'Chưa cập nhật'}
                </Text>
              </View>
            </View>
          </View>
          <View style={{paddingHorizontal: 16}}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  width: 3,
                  height: 20,
                  backgroundColor: color.primaryColor,
                }}
              />
              <Text style={{marginLeft: 8, fontWeight: 'bold', flex: 1}}>
                Album ảnh
              </Text>
              {listImage?.length > 6 ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('AlbumAll', {
                      data: listImage,
                    })
                  }>
                  <Text style={{color: color.primaryColor, fontSize: 13}}>
                    Xem thêm
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
          <View>
            <FlatList
              data={this.formatData(listImage, 4).filter(item => !item.empty)}
              numColumns={4}
              style={{paddingVertical: 16, paddingHorizontal: 12}}
              // columnWrapperStyle={{flex: 1, flexWrap: 'wrap'}}
              renderItem={this.renderImage}
              keyExtractor={() => String(Math.random())}
            />
          </View>
          {info?.id === accountInfo.id ? (
            <View style={{flexDirection: 'row', paddingHorizontal: 16}}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#FFF',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 1,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  height: 102,
                  flex: 1,
                  borderRadius: 6,
                  justifyContent: 'center',
                }}
                onPress={() =>
                  navigation.navigate('CreatePostScreen', {visible: false})
                }>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingHorizontal: 16,
                    flex: 1,
                    marginTop: 16,
                  }}>
                  <Image
                    source={
                      accountInfo.avatar
                        ? {
                            uri:
                              HOST_IMAGE_UPLOAD +
                              JSON.parse(accountInfo.avatar)[0],
                          }
                        : Images.avatarDefault
                    }
                    style={{width: 30, height: 30, borderRadius: 15}}
                  />
                  <Text
                    note
                    style={{
                      fontSize: 16,
                      marginLeft: 16,
                      flex: 1,
                    }}>
                    Đăng bài viết mới
                  </Text>
                </View>
                <View style={{flexDirection: 'row', backgroundColor: '#ccc2'}}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 4,
                    }}
                    onPress={() =>
                      navigation.navigate('CreatePostScreen', {visible: true})
                    }>
                    <Icon
                      name={'image'}
                      type={'EvilIcons'}
                      style={{color: color.primaryColor}}
                    />
                    <Text>Thư viện</Text>
                  </TouchableOpacity>
                  {/*<TouchableOpacity*/}
                  {/*  style={{*/}
                  {/*    flex: 1,*/}
                  {/*    flexDirection: 'row',*/}
                  {/*    alignItems: 'center',*/}
                  {/*    justifyContent: 'center',*/}
                  {/*  }}*/}
                  {/*  onPress={() => navigation.navigate('CreatePostScreen')}>*/}
                  {/*  <Icon*/}
                  {/*    name={'camera'}*/}
                  {/*    type={'EvilIcons'}*/}
                  {/*    style={{color: color.red}}*/}
                  {/*  />*/}
                  {/*  <Text>Máy ảnh</Text>*/}
                  {/*</TouchableOpacity>*/}
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={{paddingHorizontal: 16, paddingTop: 32}}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  width: 3,
                  height: 20,
                  backgroundColor: color.primaryColor,
                }}
              />
              <Text style={{marginLeft: 8, fontWeight: 'bold'}}>
                {info?.id === accountInfo.id ? 'Bài đăng của bạn' : 'Bài đăng'}
              </Text>
            </View>
          </View>
          <View style={{alignItems: 'center'}}>
            <VirtualizedList
              getItem={(d, index) => d[index]}
              getItemCount={d => d?.length}
              data={data}
              style={{marginTop: 16}}
              contentContainerStyle={{paddingHorizontal: 16}}
              keyExtractor={item => String(item.id)}
              renderItem={this.renderItem}
              maxToRenderPerBatch={6}
              updateCellsBatchingPeriod={100}
              removeClippedSubviews
              extraData={data}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewAbsoluteImg: {
    position: 'absolute',
    width: setWidth('40%'),
    height: setWidth('40%'),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtLength: {color: '#FFF', fontSize: 16},
  labelImg: {textAlign: 'right', color: '#FFF'},
  viewLengthImg: {
    marginRight: 5,
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(ProfileSocial);
