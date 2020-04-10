import React, {Component} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Keyboard,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Platform,
} from 'react-native';
import {setWidth, setHeight} from '../../cores/baseFuntion';
import HeaderComponent from '../../components/headerComponents';
import FastImage from 'react-native-fast-image';
import {Icon, Text, Toast} from 'native-base';
import {connect} from 'react-redux';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../../config/server';
import {Images} from '../../assets/image';
import {formatDateNow} from '../../../components/until';
import Modal from 'react-native-modal';
import {getFromServer, postToServer} from '../../config';
import ImageManipulator from '../../lib/react-native-image-manipulator';
import ImageBrowser from '../../../components/multi-select-image/ImageBrowser';
import axios from 'axios';
import {each} from 'lodash';
import {postToServerWithAccount} from '../../../components/fetch';
import ProgressDialog from '../../../components/ProgressDialog';
import {LazyLoadingNews} from '../../../components/lazy-load';
import ShowImageView from '../../../components/show-image-view';

class NewDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      comments: [],
      content: '',
      image: null,
      showSelectImage: false,
      imgSelected: [],
      imageUri: null,
      commenting: false,
      uploading: false,
      imgUpload: null,
      lazy: true,
      refreshing: false,
      showImage: false,
    };
  }

  componentDidMount = () => {
    const {data, visible} = this.props.navigation.state.params;
    const {id} = data;
    if (visible) {
      this.setState({visible: visible || false});
    }
    this.getComment(id);
  };

  getComment = async id => {
    const {accountInfo} = this.props;
    // this.setState({lazy: true});
    try {
      const response = await getFromServer(getApiUrl(API.LIST_COMMENT_POST), {
        token: accountInfo.access_token.token,
        post_id: id,
        page: 1,
        page_size: 50,
      });
      this.setState({comments: response.data});
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({lazy: false, refreshing: false});
    }
  };

  selectImage = () => {
    this.setState({showSelectImage: true});
  };

  getFileFromUri = async image => {
    const type = image.type.split('/')[1];

    return await ImageManipulator.manipulateAsync(
      image.uri,
      [{resize: {width: image.width, height: image.height}}],
      {format: type},
    );
  };

  imageBrowserCallback = callback => {
    this.setState({showSelectImage: false});
    if (callback) {
      callback.forEach(image => {
        const newImage = this.getFileFromUri(image);
        const imgNew = {...image, ...newImage};
        let {imgSelected} = this.state;
        imgSelected = imgSelected ? [...imgSelected, imgNew] : [imgNew];
        this.setState({imgSelected, imageUri: imgSelected[0].uri}, () =>
          this.submit(imgSelected),
        );
      });
    }
  };

  submit = async imgSelected => {
    const {accountInfo} = this.props;
    this.setState({uploading: true});
    try {
      const response = await postToServerWithAccount(
        getApiUrl(API.UPLOAD_IMAGE),
        {
          token: accountInfo.access_token.token,
        },
        imgSelected,
      );
      console.log(response.data, 'a');
      this.setState({
        imgUpload: response.data,
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({uploading: false});
    }
  };

  hideSelect = () => {
    this.setState({showSelectImage: false});
  };

  postComment = async () => {
    const {accountInfo, navigation} = this.props;
    const {data} = navigation.state.params;
    const {content, imgUpload} = this.state;
    this.setState({
      commenting: true,
    });
    Keyboard.dismiss();
    try {
      const params = {
        content,
        user_id: accountInfo.id,
        token: accountInfo.access_token.token,
        image: imgUpload,
        post_id: data.id,
      };
      const response = await postToServer(getApiUrl(API.ADD_COMMENT), params);
      if (response.status === 1) {
        this.getComment(data.id);
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({commenting: false, content: '', imgSelected: []});
    }
  };

  deleteComment = async item => {
    const {accountInfo} = this.props;
    const {id: comment_id, post_id} = item;
    try {
      const res = await postToServer(getApiUrl(API.DELETE_COMMENT), {
        comment_id,
        post_id,
        token: accountInfo.access_token.token,
        user_id: accountInfo.id,
      });
      if (res.status === 1) {
        this.onRefresh();
      } else {
        Toast.show({
          text: 'Đã có lỗi xảy ra, vui lòng thử lại.',
          duration: 2500,
          position: 'center',
          type: 'danger',
        });
      }
    } catch (e) {
    } finally {
    }
  };

  showModalImage = (state, index) => {
    if (Platform.OS === 'ios') StatusBar.setHidden(state, 'slide');
    this.setState({showImage: state});
  };

  renderComment = ({item}) => {
    const {accountInfo} = this.props;
    const dataImage = item.image ? JSON.parse(item.image) : [];
    return (
      <View>
        <View
          style={{
            backgroundColor: '#FFF',
            paddingHorizontal: 16,
            paddingVertical: 5,
            flexDirection: 'row',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={
                item.avatar_author
                  ? {uri: HOST_IMAGE_UPLOAD + JSON.parse(item.avatar_author)[0]}
                  : Images.avatarDefault
              }
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
              }}
              resizeMode="cover"
            />
          </View>
          <View
            style={{
              marginVertical: 8,
              flex: 1,
              marginHorizontal: 16,
              backgroundColor: '#FFF',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              padding: 8,
              borderRadius: 6,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 15,
                  color: '#000',
                }}
                numberOfLines={1}>
                {item.author}
              </Text>
              <View
                style={{
                  width: 2,
                  height: 2,
                  borderRadius: 1,
                  backgroundColor: '#CCC',
                  marginHorizontal: 8,
                }}
              />
              <Text note style={{flex: 1}}>
                {formatDateNow(item.created_at)}
              </Text>
              {item.user_id === accountInfo.id && (
                <View>
                  <TouchableOpacity onPress={() => this.deleteComment(item)}>
                    <Icon
                      name={'delete'}
                      type={'MaterialIcons'}
                      style={{fontSize: 16, color: '#AAA'}}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <Text>{item.content}</Text>
            {item.image && (
              <Image
                source={{uri: HOST_IMAGE_UPLOAD + dataImage[0]}}
                style={{
                  width: setWidth('70%'),
                  height: setWidth('30%'),
                  marginTop: 8,
                  borderRadius: 6,
                }}
                resizeMode="cover"
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  onRefresh = () => {
    const {navigation} = this.props;
    const {data} = navigation.state.params;
    this.setState({lazy: true, comments: []}, () => this.getComment(data.id));
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
      comments,
      visible,
      content,
      showSelectImage,
      imgSelected,
      commenting,
      uploading,
      lazy,
      refreshing,
      showImage,
    } = this.state;
    const {data} = navigation.state.params;
    const dataImage = data.image ? JSON.parse(data.image) : [];
    return (
      <View style={styles.saf}>
        <HeaderComponent
          navigation={navigation}
          iconRightStyle={{fontSize: 35}}
          iconLeft="ios-arrow-back"
          left
          right
          typeIconRight="EvilIcons"
          title={`Bài viết của ${data.author}`}
          onPressLeft={() => navigation.goBack()}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 32}}>
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
              borderRadius: 4,
              padding: 16,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={
                  data.avatar_author
                    ? {
                        uri:
                          HOST_IMAGE_UPLOAD + JSON.parse(data.avatar_author)[0],
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
              <View style={{marginLeft: 16}}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: '#000',
                  }}>
                  {data.author}
                </Text>
                <Text note>{formatDateNow(data.created_at)}</Text>
              </View>
            </View>
            <View style={{marginVertical: 8}}>
              <Text>{data.content}</Text>
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
                disabled={data.is_active === 0}
                onPress={() => this.setState({visible: true})}>
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
                  Bình luận ({comments?.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexWrap: 'wrap',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 16,
            }}>
            {dataImage &&
              dataImage.map((v, index) => {
                return (
                  <TouchableOpacity
                    disabled={data.is_active === 0}
                    onPress={this.showModalImage.bind(this, true, 0)}>
                    <FastImage
                      source={{uri: HOST_IMAGE_UPLOAD + v}}
                      style={{
                        width: setWidth('100%') - 32,
                        height: setWidth('50'),
                        borderRadius: 4,
                        marginTop: index > 0 ? 16 : 0,
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                );
              })}
          </View>
          <ShowImageView
            showGallery={showImage}
            onRequestClose={this.showModalImage.bind(this, false, 0)}
            onClosePress={this.showModalImage.bind(this, false, 0)}
            initPage={0}
            image={dataImage && dataImage.length > 0 ? dataImage : []}
          />
        </ScrollView>
        <Modal
          isVisible={visible}
          backdropOpacity={0.5}
          backdropColor="#000"
          animationIn="fadeIn"
          animationOut="slideOutDown"
          animationInTiming={300}
          animationOutTiming={300}
          backdropTransitionInTiming={300}
          backdropTransitionOutTiming={0}
          useNativeDriver
          hideModalContentWhileAnimating
          onBackdropPress={() => this.setState({visible: false})}
          onBackButtonPress={() => this.setState({visible: false})}
          style={styles.modal}>
          <View
            style={{
              width: setWidth('100%'),
              height: setHeight('80%'),
              backgroundColor: '#FFF',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 6,
              borderTopRightRadius: 6,
              borderTopLeftRadius: 6,
            }}>
            <ProgressDialog
              visible={uploading}
              message="Vui lòng chờ giây lát..."
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 0.6,
                borderBottomColor: '#CCC',
              }}>
              <TouchableOpacity
                style={{paddingLeft: 16}}
                onPress={() => this.setState({visible: false})}>
                <Icon
                  name="ios-arrow-round-back"
                  type="Ionicons"
                  style={{fontSize: 32}}
                />
              </TouchableOpacity>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#00c068',
                  paddingVertical: 8,
                  fontSize: 16,
                  flex: 1,
                }}>
                Bình luận
              </Text>
              <View style={{width: 1}} />
            </View>
            <LazyLoadingNews length={1} visible={lazy} />
            <FlatList
              style={{flex: 1}}
              contentContainerStyle={{paddingVertical: 16}}
              data={comments}
              renderItem={this.renderComment}
              refreshing={refreshing}
              refreshControl={this.refreshControl()}
              keyExtractor={() => String(Math.random())}
            />
            {imgSelected.length > 0 && (
              <View
                style={{
                  position: 'absolute',
                  width: 100,
                  height: 150,
                  bottom: 55,
                  left: 10,
                  borderRadius: 6,
                }}>
                <Image
                  source={{uri: imgSelected[0]?.uri}}
                  style={{
                    width: 100,
                    height: 150,
                    borderRadius: 6,
                  }}
                  resizeMode="cover"
                />
                <View style={{position: 'absolute', left: 5, top: 5}}>
                  <TouchableOpacity
                    hitSlop={{top: 10, left: 10, bottom: 10, right: 10}}
                    onPress={() =>
                      this.setState({imgSelected: [], imgUpload: null})
                    }>
                    <Icon
                      name="ios-close-circle"
                      type="Ionicons"
                      style={{fontSize: 20, color: '#FFF'}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View
              style={{
                backgroundColor: '#FFF',
                shadowColor: '#000',
                shadowOffset: {
                  width: 2,
                  height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4,
                borderTopColor: 'whitesmoke',
                borderTopWidth: 2,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <TextInput
                placeholder="Aa..."
                // autoFocus
                style={{color: '#000', fontSize: 16, flex: 1}}
                value={content}
                onChangeText={text => this.setState({content: text})}
              />
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{marginRight: 16}}
                  onPress={this.selectImage}>
                  <Icon name="camera" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginRight: 16}}
                  onPress={this.postComment}
                  disabled={!content || commenting}>
                  <Icon
                    name="send"
                    style={{color: commenting ? '#AAA' : '#000'}}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {showSelectImage ? (
              <ImageBrowser
                max={1}
                hideSelect={this.hideSelect}
                visible={showSelectImage}
                callback={this.imageBrowserCallback}
                selectedCount={imgSelected && imgSelected.length}
              />
            ) : null}
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  saf: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  imageview: {
    width: '100%',
    height: setWidth('55%'),
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    margin: 0,
    padding: 0,
  },
});

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(NewDetail);
