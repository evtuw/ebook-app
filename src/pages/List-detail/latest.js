import React, {PureComponent} from 'react';
import {View, Text, RefreshControl} from 'react-native';
import HeaderComponent from '../../components/headerComponents';
import LatestList from '../List/latest-list';
import {connect} from 'react-redux';
import {getFromServer} from '../../config';
import {getApiUrl, API} from '../../config/server';
import {LazyLoadingListing} from '../../../components/lazy-load';

class Latest extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      total: 0,
      lazy: true,
      refreshing: false,
      page: 1,
      endLoadMore: false,
    };
  }

  componentDidMount = () => {
    this.getData();
  };

  getData = async () => {
    const {accountInfo} = this.props;
    const {page, data} = this.state;
    try {
      const response = await getFromServer(getApiUrl(API.LATEST), {
        token: accountInfo.access_token.token,
        page,
        page_size: 50,
      });
      if (!response.data && response.data.length === 0) {
        this.setState({endLoadMore: true});
      }
      this.setState({
        data: page === 1 ? response.data : [...data, ...response.data],
        total: response.total,
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.setState({lazy: false, refreshing: false, loadMore: false});
    }
  };

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  onRefresh = () => {
    this.setState({lazy: true, data: [], page: 1, endLoadMore: false}, () =>
      this.getData(),
    );
  };

  refreshControl() {
    const {refreshing} = this.state;
    return (
      <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
    );
  }

  loadMore = () => {
    const {page, endLoadMore} = this.state;
    if (!endLoadMore) {
      this.setState({page: page + 1, loadMore: true}, () => this.getData());
    }
  };

  render() {
    const {navigation} = this.props;
    const {data, total, lazy, refreshing, loadMore} = this.state;
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <HeaderComponent
          navigation={navigation}
          left
          right
          iconLeft="ios-arrow-back"
          iconLeftType="Ionicons"
          title="Sách mới nhất"
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
            Có {total} sách mới nhất
          </Text>
        </View>
        <LazyLoadingListing length={5} visible={lazy} listName="book" />
        <LatestList
          refreshing={refreshing}
          onRefresh={this.refreshControl()}
          nextPage={this.loadMore}
          data={data}
          loadMore={loadMore}
          navigation={navigation}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(Latest);
