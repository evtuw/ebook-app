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
} from 'react-native';
import {setWidth, setHeight} from '../../cores/baseFuntion';
import HeaderComponent from '../../components/headerComponents';
import FastImage from 'react-native-fast-image';
import {Icon, Text} from 'native-base';
import {connect} from 'react-redux';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../../config/server';
import {Images} from '../../assets/image';
import {formatDateNow} from '../../../components/until';
import Modal from 'react-native-modal';
import {getFromServer} from '../../config';

class NewDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      comments: [],
      content: '',
      image: null,
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
    }
  };

  selectImage = () => {};

  submit = async () => {};

  renderComment = ({item}) => {
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
                item.avatar
                  ? {uri: HOST_IMAGE_UPLOAD + item.avatar}
                  : Images.avatarDefault
              }
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#ff2e54',
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
                  flex: 1,
                }}
                numberOfLines={1}>
                {item.author}
              </Text>
              <Text note style={{marginTop: 8}}>
                {formatDateNow(item.created_at)}
              </Text>
            </View>
            <Text>{item.content}</Text>
            {item.image && (
              <Image
                source={{uri: HOST_IMAGE_UPLOAD + item.image}}
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

  render() {
    const {navigation} = this.props;
    const {comments, visible, content} = this.state;
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
                    ? {uri: HOST_IMAGE_UPLOAD + data.avatar_author}
                    : Images.avatarDefault
                }
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: '#ff2e54',
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
                <Text style={{marginLeft: 8, color: '#AAA'}}>Bình luận</Text>
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
                  <TouchableOpacity disabled={data.is_active === 0}>
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
                  color: '#ff2e54',
                  paddingVertical: 8,
                  fontSize: 16,
                  flex: 1,
                }}>
                Bình luận
              </Text>
              <View style={{width: 1}} />
            </View>
            <FlatList
              style={{flex: 1}}
              contentContainerStyle={{paddingVertical: 16}}
              data={comments}
              renderItem={this.renderComment}
              keyExtractor={() => String(Math.random())}
            />
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
                  onPress={this.submit}
                  disabled={!content}>
                  <Icon name="send" />
                </TouchableOpacity>
              </View>
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
  },
});

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(NewDetail);
