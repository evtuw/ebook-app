import React, {PureComponent} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Menu, {MenuItem} from 'react-native-material-menu';
import {Icon} from 'native-base';
import FastImage from 'react-native-fast-image';
import {HOST_IMAGE_UPLOAD} from '../../../config/server';
import {Images} from '../../../assets/image';
import {formatDateNow, formatNumber} from '../../../../components/until';
import moment from 'moment';
import color from '../../../assets/static-data/color';

export default class ItemBookSelling extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loadExpired: false,
    };
  }
  componentWillUnmount() {
    this._menu.hide();
  }

  updateExpired = async item => {
    const {updateExpired} = this.props;
    this.setState({loadExpired: true});
    if (updateExpired) await updateExpired(item);
    this.setState({loadExpired: false});
  };

  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = item => {
    this._menu.show();
  };

  openEdit = item => {
    const {navigation, data} = this.props;
    const newImage = item.image ? JSON.parse(item.image) : [];
    this.hideMenu();
    navigation.navigate('AddNewBookScreen', {
      item,
      name: data.name,
      image: newImage,
      store_id: data.id,
    });
  };

  render() {
    const {item, navigation, accountInfo, data, updateExpired} = this.props;
    const {loadExpired} = this.state;
    const newImage = item.image ? JSON.parse(item.image) : null;
    const today = moment().format('YYYY-MM-DD');
    let isNew = 'HOT';
    if (moment(item.created_at).format('YYYY-MM-DD') === today) {
      isNew = 'NEW';
    }
    return (
      <View>
        <Menu ref={this.setMenuRef} style={styles.menuAction} button={<View />}>
          <MenuItem onPress={() => this.openEdit(item)} style={{height: 44}}>
            <Icon
              name="edit"
              type={'AntDesign'}
              style={{color: '#3F3356', fontSize: 20}}
            />
            <View style={styles.viewEmpty} />
            <Text style={styles.labelEdit}>Chỉnh sửa</Text>
          </MenuItem>
          <MenuItem onPress={this.hideMenu} style={{height: 44}}>
            <Icon
              name="delete"
              type={'AntDesign'}
              style={{color: '#FF647C', fontSize: 20}}
            />
            <View style={styles.viewEmpty} />
            <Text style={styles.labelRemove}>Xóa</Text>
          </MenuItem>
        </Menu>
        <TouchableOpacity
          style={styles.item}
          onPress={() =>
            navigation.navigate('DetailBookScreen', {
              id: item.id,
              item: {...item, ...data},
              newImage,
            })
          }>
          <View style={styles.contentContainer}>
            <FastImage
              style={styles.imageBackground}
              source={
                newImage?.length > 0
                  ? {
                      uri: HOST_IMAGE_UPLOAD + newImage[0],
                      priority: FastImage.priority.normal,
                    }
                  : Images.thumbdefault
              }
              resizeMode="cover"
            />
            <View
              style={{
                position: 'absolute',
                backgroundColor:
                  isNew === 'NEW'
                    ? 'rgba(30,234,51,0.46)'
                    : 'rgba(234,25,106,0.71)',
                paddingHorizontal: 6,
                paddingVertical: 2,
                left: 8,
                top: 8,
                borderRadius: 4,
              }}>
              <Text style={{color: '#FFF'}}>{isNew}</Text>
            </View>
            <View style={styles.content}>
              <Text style={styles.name} numberOfLines={1}>
                {item.title_book}
              </Text>
              <View style={{height: 30}}>
                <Text style={styles.address} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
              <View style={styles.smallContent}>
                <Text style={styles.price}>{formatNumber(item.price)} VNĐ</Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.postTime}>
                  {formatDateNow(item.created_at)}
                </Text>
                <TouchableOpacity
                  disabled={data.user_id !== accountInfo.id}
                  onPress={() => this.updateExpired(item)}>
                  {loadExpired ? (
                    <ActivityIndicator color={color.primaryColor} />
                  ) : (
                    <Text
                      style={{
                        color:
                          item.is_expired === 0
                            ? color.primaryColor
                            : color.red,
                        textTransform: 'uppercase',
                      }}>
                      {item.is_expired === 0 ? 'Chưa bán' : 'Đã bán'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
            {data.user_id === accountInfo.id ? (
              <View>
                <TouchableOpacity
                  hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
                  style={{
                    paddingRight: 16,
                    width: 24,
                    height: 24,
                    paddingTop: 8,
                  }}
                  onPress={() => this.showMenu(item)}>
                  <Icon
                    name={'md-more'}
                    type={'Ionicons'}
                    style={{fontSize: 20, color: '#A7A9BC'}}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFF'},
  item: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    marginVertical: 8,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    height: 128,
    flexDirection: 'row',
  },
  content: {
    flex: 2,
    flexDirection: 'column',
    height: 128,
    marginLeft: 10,
    marginRight: 10,
  },
  imageBackground: {
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    width: 128,
    height: 128,
  },
  postTime: {
    fontFamily: 'SF Pro Text',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: '#9B9B9B',
  },
  name: {
    color: '#0D0E10',
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 17,
    marginBottom: 4,
    marginTop: 10,
  },
  address: {
    color: '#505D68',
    fontFamily: 'SF Pro Text',
    fontSize: 11,
    lineHeight: 16,
  },
  smallContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 24,
    marginTop: 8,
  },
  acreage: {
    fontFamily: 'SF Pro Text',
    fontSize: 13,
    color: '#3AA2DD',
    fontWeight: 'bold',
    lineHeight: 24,
  },
  price: {
    fontFamily: 'SF Pro Text',
    fontSize: 12,
    color: '#3AA2DD',
    fontWeight: '500',
    lineHeight: 16,
  },
  priority: {
    top: 8,
    left: 8,
    position: 'absolute',
    fontFamily: 'SF Pro Text',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 14,
    color: '#FFF',
    paddingVertical: 2,
    paddingHorizontal: 3,
    borderRadius: 3,
    textAlign: 'center',
  },
  menuAction: {
    marginLeft: '40%',
    width: 154,
    height: 88,
    borderRadius: 8,
  },
  viewEmpty: {width: 10, height: 1},
  labelEdit: {
    color: '#3F3356',
    fontWeight: 'normal',
    fontSize: 15,
    bottom: 10,
  },
  labelRemove: {
    color: '#FF647C',
    fontWeight: 'normal',
    fontSize: 15,
    bottom: 10,
  },
});
