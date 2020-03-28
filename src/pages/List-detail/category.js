import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';
import HeaderComponent from '../../components/headerComponents';
import CategoryList from '../List/category-list';
import {connect} from 'react-redux';
import {getFromServer} from '../../config';
import {getApiUrl, API} from '../../config/server';

class Category extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      total: 0,
    };
  }

  componentDidMount = () => {
    this.getData();
  };

  getData = async () => {
    const {accountInfo} = this.props;
    try {
      const response = await getFromServer(getApiUrl(API.CATEGORY), {
        token: accountInfo.access_token.token,
        page: 1,
        page_size: 16,
      });
      this.setState({data: response.data, total: response.total});
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  render() {
    const {navigation} = this.props;
    const {data, total} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <HeaderComponent
          navigation={navigation}
          left
          right
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title="Thể loại"
          onPressLeft={this.goBack}
        />
        <View style={{margin: 16}}>
          <Text
            style={{
              fontSize: 16,
              color: '#A7A9BC',
              fontFamily: 'SF Pro Text',
              fontWeight: 'bold',
            }}>
            Có {total} thể loại
          </Text>
        </View>
        <CategoryList data={data} navigation={navigation} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(Category);
