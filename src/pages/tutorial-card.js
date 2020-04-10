import React, {PureComponent} from 'react';
import {ScrollView, View, Text, Image} from 'react-native';
import HeaderComponent from '../components/headerComponents';
import {Images} from '../assets/image';

export default class TutorialCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {};

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  render() {
    const {navigation} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <HeaderComponent
          navigation={navigation}
          left
          right
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title="Hướng dẫn đổi thẻ cào"
          onPressLeft={this.goBack}
        />
        <ScrollView>
          <View style={{padding: 16}}>
            <View style={{flexDirection: 'row'}}>
              <Text>Bước 1: </Text>
              <Text style={{flex: 1}}>
                Sau khi đăng nhập xong, tại trang Home, chọn sách bạn muốn đọc.
              </Text>
            </View>
            <Image
              source={Images.step1}
              style={{
                height: 300,
                borderRadius: 4,
                borderColor: '#AAA',
                borderWidth: 1,
                alignSelf: 'center',
                marginTop: 16,
              }}
              resizeMode="contain"
            />
          </View>

          <View style={{padding: 16}}>
            <View style={{flexDirection: 'row'}}>
              <Text>Bước 2: </Text>
              <Text style={{flex: 1}}>
                Trong màn hình chi tiết sách, nhấn Đọc ngay.
              </Text>
            </View>
            <Image
              source={Images.step2}
              style={{
                height: 300,
                borderRadius: 4,
                borderColor: '#AAA',
                borderWidth: 1,
                alignSelf: 'center',
                marginTop: 16,
              }}
              resizeMode="contain"
            />
          </View>
          <View style={{padding: 16}}>
            <View style={{flexDirection: 'row'}}>
              <Text>Bước 3: </Text>
              <Text style={{flex: 1}}>
                Đọc sách và chờ kết quả!!! Nếu điểm trong tài khoản của bạn đã
                trên 10.000, hãy nhấn đổi ngay.
              </Text>
            </View>
            <Image
              source={Images.step3}
              style={{
                height: 300,
                borderRadius: 4,
                borderColor: '#AAA',
                borderWidth: 1,
                alignSelf: 'center',
                marginTop: 16,
              }}
              resizeMode="contain"
            />
          </View>
          <View style={{padding: 16}}>
            <View style={{flexDirection: 'row'}}>
              <Text>Bước 4: </Text>
              <Text style={{flex: 1}}>
                Chọn thẻ tương ứng với số tiền cần quy đổi, sau đó nhấn Tiếp tục
                là xong.
              </Text>
            </View>
            <Image
              source={Images.step4}
              style={{
                height: 300,
                borderRadius: 4,
                borderColor: '#AAA',
                borderWidth: 1,
                alignSelf: 'center',
                marginTop: 16,
              }}
              resizeMode="contain"
            />
          </View>
          <View style={{padding: 32, alignItems: 'center'}}>
            <Text style={{fontSize: 24, textAlign: 'center'}}>
              Chúc bạn có những trải nghiệm tuyệt vời trên E-Book. Thanks for
              using app.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
