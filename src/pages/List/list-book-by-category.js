import React, {PureComponent} from 'react';
import {View, Text} from 'react-native';
import HeaderComponent from '../../components/headerComponents';
import LatestList from '../List/latest-list';
import {connect} from 'react-redux';
import {getFromServer} from '../../config';
import {getApiUrl, API} from '../../config/server';

class BookByCategory extends PureComponent {
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
    const {accountInfo, navigation} = this.props;
    const {id: cat_id} = navigation.state.params;
    try {
      const response = await getFromServer(getApiUrl(API.CATEGORY_BOOK_LIST), {
        token: accountInfo.access_token.token,
        page: 1,
        page_size: 16,
        cat_id,
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
    const {title} = navigation.state.params;
    const {data, total} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <HeaderComponent
          navigation={navigation}
          left
          right
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title={title}
          onPressLeft={this.goBack}
        />
        <View style={{marginTop: 16}}>
          <LatestList data={data} navigation={navigation} noTag />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(BookByCategory);
