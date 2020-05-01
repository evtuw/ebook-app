import React, {PureComponent} from 'react';
import {View, FlatList, Image} from 'react-native';
import {ListItem, Left, Right, Body, Icon, Text} from 'native-base';
import HeaderComponent from '../components/headerComponents';
import * as Animatable from 'react-native-animatable';
import {formatDateNow} from '../../components/until';
import color from '../assets/static-data/color';

export default class Notification extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
    };
  }

  componentDidMount = () => {
    const data = [
      {
        id: 1,
        name: 'Nguyễn Duy A',
        title: 'đã bình luận về bài viết của bạn',
        content: 'comment 1',
        created_at: '2020-02-08 20:12:00',
        avatar:
          'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
        status: 2, // 1 - like , 2 - comment
      },
      {
        id: 2,
        name: 'Nguyễn Văn B, Nguyễn Văn C và 2 người khác',
        title: 'đã thích bài viết của bạn',
        created_at: '2020-02-08 20:12:00',
        content: null,
        avatar:
          'https://assets.jpegmini.com/user/images/slider_puffin_jpegmini_mobile.jpg',
        status: 1, // 1 - like , 2 - comment
      },
      {
        id: 3,
        name: 'Kiều Quốc K',
        title: 'đã bình luận về bài viết của bạn',
        created_at: '2020-02-08 20:12:00',
        content: 'comment 2',
        avatar:
          'https://dyl80ryjxr1ke.cloudfront.net/external_assets/hero_examples/hair_beach_v1785392215/original.jpeg',
        status: 1, // 1 - like , 2 - comment
      },
      {
        id: 4,
        name: 'Nguyễn Hoàng V',
        title: 'đã bình luận về bài viết của bạn',
        created_at: '2020-02-08 20:12:00',
        content: 'comment 3',
        avatar:
          'https://dyl80ryjxr1ke.cloudfront.net/external_assets/hero_examples/hair_beach_v1785392215/original.jpeg',
        status: 2, // 1 - like , 2 - comment
      },
      {
        id: 5,
        name: 'Phùng Anh T',
        title: 'đã bình luận về bài viết bạn đang theo dõi.',
        created_at: '2020-02-08 20:12:00',
        content: 'comment 4',
        avatar:
          'https://dyl80ryjxr1ke.cloudfront.net/external_assets/hero_examples/hair_beach_v1785392215/original.jpeg',
        status: 1, // 1 - like , 2 - comment
      },
    ];
    this.setState({data});
    setTimeout(() => {
      this.setState({visible: true});
    }, 3000);
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  renderItem = ({item}) => {
    return (
      <ListItem
        style={{
          marginLeft: 0,
          backgroundColor: item.status === 1 ? '#F5F4F4' : '#FFF',
          borderBottomWidth: 0.3,
          borderBottomColor: 'whitesmoke',
        }}
        button>
        <Image
          source={{uri: item.avatar}}
          style={{width: 40, height: 40, borderRadius: 20, marginLeft: 16}}
        />
        <Body>
          <View style={{marginLeft: 8, flex: 1}}>
            <View style={{flexDirection: 'row'}}>
              <Text>
                <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
                <Text numberOfLines={1}> {item.title} </Text>
                {item.content ? <Text>"{item.content}"</Text> : null}
              </Text>
            </View>
            <Text note>{formatDateNow(item.created_at)}</Text>
          </View>
        </Body>
        <Right>
          <Icon
            name={'ios-more'}
            type={'Ionicons'}
            style={{fontSize: 20, color: '#000'}}
          />
        </Right>
      </ListItem>
    );
  };

  render() {
    const {navigation} = this.props;
    const {data, visible} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <HeaderComponent
          navigation={navigation}
          left
          right
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title="Thông báo"
          onPressLeft={this.goBack}
        />
        <View style={{flex: 1}}>
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={() => String(Math.random())}
          />
          {visible ? (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0,.3)',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Animatable.View
                animation="fadeInLeft"
                easing="ease-out-back"
                style={{alignItems: 'center', justifyContent: 'center'}}>
                <Icon
                  name={'md-notifications'}
                  type={'Ionicons'}
                  style={{fontSize: 48, color: color.primaryColor}}
                />
                <Text
                  style={{
                    fontSize: 20,
                    color: '#FFF',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    paddingHorizontal: 32,
                  }}>
                  Tính năng đang được phát triển, vui lòng quay lại sau. Xin cảm
                  ơn!
                </Text>
              </Animatable.View>
            </View>
          ) : null}
        </View>
      </View>
    );
  }
}
