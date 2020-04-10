import React, {PureComponent} from 'react';
import {View, Text, Keyboard} from 'react-native';
import {connect} from 'react-redux';
import HeaderSearch from '../../components/header-search';
import LatestList from './latest-list';
import {getFromServer} from '../../config';
import {API, getApiUrl} from '../../config/server';
import {LazyLoadingListing} from '../../../components/lazy-load';

class ListBookSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      lazy: false,
    };
  }

  componentDidMount = () => {};

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  doSearch = () => {
    Keyboard.dismiss();
  };

  onChangeText = async text => {
    this.setState({keySearch: text});
    const {accountInfo} = this.props;
    if (text !== '' && text.length > 3) {
      this.setState({lazy: true});
      try {
        const response = await getFromServer(getApiUrl(API.SEARCH_BOOK), {
          page: 1,
          page_size: 16,
          keyword: text,
          token: accountInfo.access_token.token,
        });
        this.setState({data: response.data});
      } catch (e) {
        console.log(e);
      } finally {
        this.setState({lazy: false});
      }
    } else {
      this.setState({data: []});
    }
  };

  render() {
    const {keySearch, data, lazy} = this.state;
    const {navigation} = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#FFF'}}>
        <HeaderSearch
          ref={ref => {
            this.headerSearch = ref;
          }}
          autoFocus
          onPress={this.goBack}
          text={keySearch}
          onSearch={this.doSearch}
          onHaveText={this.onChangeText}
        />
        <View style={{marginHorizontal: 16, marginTop: 16}}>
          <Text style={{fontSize: 16}}>Sách tìm thấy: </Text>
        </View>
        <LazyLoadingListing length={5} visible={lazy} listName="book" />
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

export default connect(mapStateToProps)(ListBookSearch);
