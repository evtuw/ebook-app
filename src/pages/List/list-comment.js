import React, {PureComponent} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  DeviceEventEmitter,
} from 'react-native';
import HeaderComponent from '../../components/headerComponents';
import {connect} from 'react-redux';
import {Icon} from 'native-base';
import {getFromServer, postToServer} from '../../config';
import {API, getApiUrl, HOST_IMAGE_UPLOAD} from '../../config/server';
import {Images} from '../../assets/image';
import {formatDateNow} from '../../../components/until';

class ListComment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      comment: '',
      refreshing: false,
      page: 1,
      total: 0,
      loadmore: false,
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const {accountInfo, navigation} = this.props;

    const {id: book_id} = navigation.state.params;
    const {data} = this.state;
    const {page} = this.state;
    try {
      const response = await getFromServer(getApiUrl(API.LIST_COMMENT), {
        token: accountInfo.access_token.token,
        book_id,
        page,
        page_size: 10,
      });
      if (response.data.length === 0) this.setState({endLoadmore: true});
      this.setState({
        data: page === 1 ? response.data : [...data, ...response.data],
        total: response.total,
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({refreshing: false, loadmore: false});
    }
  };

  submit = async () => {
    const {accountInfo, navigation} = this.props;

    const {id: book_id} = navigation.state.params;
    const {comment} = this.state;
    try {
      const response = await postToServer(getApiUrl(API.POST_COMMENT), {
        user_id: accountInfo.id,
        book_id,
        content: comment,
        token: accountInfo.access_token.token,
      });
      if (response.status === 1) {
        this.onRefresh();
        this.setState({comment: ''});
        DeviceEventEmitter.emit('LoadData');
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  onRefresh = () => {
    this.setState({refreshing: true, page: 1, endLoadmore: false}, () =>
      this.getData(),
    );
  };

  clickMore = () => {
    const {page} = this.state;
    this.list.scrollToEnd({animated: true});
    this.setState({page: page + 1, loadmore: true}, () => this.getData());
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
      comment,
      refreshing,
      endLoadmore,
      total,
      loadmore,
    } = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <HeaderComponent
          navigation={navigation}
          left
          right
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title="Bình luận"
          onPressLeft={this.goBack}
        />
        <FlatList
          ref={ref => {
            this.list = ref;
          }}
          data={data}
          refreshing={refreshing}
          refreshControl={this.refreshControl()}
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
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                }}
              />
              <View style={{flex: 1, marginLeft: 16}}>
                <Text style={{fontSize: 16, color: '#999'}}>{item.name}</Text>
                <Text>{item.content}</Text>
              </View>
              <Text>{formatDateNow(item.created_at)}</Text>
            </View>
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: '#999'}}>Chưa có bình luận nào.</Text>
            </View>
          )}
          keyExtractor={() => String(Math.random())}
          ListFooterComponent={() => (
            <View>
              {!endLoadmore && total > 10 && (
                <View style={{marginHorizontal: 8, marginVertical: 8}}>
                  <TouchableOpacity onPress={this.clickMore}>
                    {loadmore ? (
                      <ActivityIndicator />
                    ) : (
                      <Text style={{fontWeight: 'bold'}}>
                        Xem thêm bình luận
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
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
            autoFocus
            style={{color: '#000', fontSize: 16, flex: 1}}
            value={comment}
            onChangeText={text => this.setState({comment: text})}
          />
          <TouchableOpacity
            style={{marginRight: 16}}
            onPress={this.submit}
            disabled={!comment}>
            <Icon name="send" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(ListComment);
