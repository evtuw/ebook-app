import React, {PureComponent} from 'react';
import {View, TextInput, Image, TouchableOpacity, Text} from 'react-native';
import {Icon} from 'native-base';
import styles from './styles/search';

export default class HeaderSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      type: 1,
      keyword: '',
    };
  }

  focusInput = () => {
    this.inputSearch.focus();
  };

  onSubmitEditing = () => {
    const {onSearch} = this.props;
    const {keyword} = this.state;
    const key = keyword.trim();
    onSearch(key);
  };

  onChangeText = keyword => {
    this.setState({keyword});
    const {onHaveText} = this.props;
    onHaveText(keyword);
  };

  /** clicked on bar-search */
  onPressDone = () => {
    const {onPress} = this.props;
    const {type} = this.state;
    onPress(type);
  };

  openAdvancedSearch = type => {
    const {navigation} = this.props;
    navigation.replace('HomeSearch', {type});
  };

  render() {
    const {keyword} = this.state;
    const {onPress, disable, text} = this.props;
    return (
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity onPress={onPress} style={{marginLeft: 6}}>
            <Icon name="ios-arrow-round-back" type="Ionicons" />
          </TouchableOpacity>
          {disable ? (
            <TouchableOpacity onPress={this.openAdvancedSearch}>
              <Text style={styles.entry}>{text || keyword}</Text>
            </TouchableOpacity>
          ) : (
            <TextInput
              style={styles.entry}
              value={text || keyword}
              autoFocus
              ref={input => {
                this.inputSearch = input;
              }}
              placeholderTextColor="#D0C9D6"
              placeholder="Tìm theo tiêu đề, nội dung sách..."
              onChangeText={this.onChangeText}
              returnKeyType="search"
              onSubmitEditing={this.onSubmitEditing}
            />
          )}
        </View>
      </View>
    );
  }
}
