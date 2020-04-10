import React, {PureComponent} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  StatusBar,
} from 'react-native';
import {Icon, Text} from 'native-base';
import ViewBookAudio from '../pages/view-book-audio';
import TrackPlayer from 'react-native-track-player';
import ItemAudio from '../pages/List-detail/audio-item';
import {connect} from 'react-redux';
import {getFromServer} from '../config';
import {API, getApiUrl} from '../config/server';

class AudioBook extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      play: false,
      isShow: false,
      dataSound: {},
      page: 1,
      keyword: '',
    };
  }

  componentDidMount() {
    const data = [
      {
        id: '1',
        name: 'Book Audio 1',
        link:
          'http://files.vixahoi.com/ThuVienSachNoi/VanHoc/NuocNgoai/LocDinhKy/01.LocDinhKy-Phan1.mp3',
        image:
          'https://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg',
        title: 'Book Audio 1',
        artist: 'N0 John',
        category: 'Hài hước',
      },
      {
        id: '2',
        name: 'Book Audio 2',
        link:
          'http://data.thuviensachnoi.vn//ThuVienSachNoi/VanHoc/VanHocNuocNgoai/NuHoangAiCap/NuHoangAiCap02.mp3',
        image:
          'https://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg',
        title: 'Book Audio 1',
        artist: 'N0 John',
        category: 'Kinh dị',
      },
    ];
    this.getData();
  }

  getData = async () => {
    const {accountInfo} = this.props;
    const {page, keyword, data} = this.state;
    this.setState({loading: true});
    try {
      const response = await getFromServer(getApiUrl(API.LIST_AUDIO), {
        page,
        page_size: 16,
        keyword,
        token: accountInfo.access_token.token,
      });
      this.setState({
        data: page === 1 ? response.data : [...data, ...response.data],
      });
    } catch (e) {
    } finally {
      this.setState({loading: false});
    }
  };

  playAudio = async item => {
    await this.close();
    setTimeout(() => {
      this.setState({dataSound: item, isShow: true});
    }, 100);
  };

  close = () => {
    this.setState({isShow: false});
  };

  renderItem = ({item, index}) => {
    const {play} = this.state;
    return (
      <ItemAudio
        play={play}
        playAudio={this.playAudio}
        item={item}
        index={index}
      />
    );
  };

  render() {
    const {data, isShow, dataSound} = this.state;
    return (
      <View style={styles.container}>
        {isShow && (
          <View
            style={{
              position: 'absolute',
              top: StatusBar.currentHeight - 20,
              width: '100%',
              zIndex: 999,
            }}>
            <ViewBookAudio close={this.close} data={dataSound} />
          </View>
        )}
        <Text style={{marginTop: 32, textAlign: 'center', fontSize: 24}}>
          Audio Book
        </Text>
        <View style={{marginTop: 16, marginBottom: 64}}>
          <FlatList
            data={data}
            renderItem={this.renderItem}
            keyExtractor={() => String(Math.random())}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
    padding: 16,
    borderRadius: 6,
  },
});

const mapStateToProps = state => ({
  accountInfo: state.accountReducer,
});

export default connect(mapStateToProps)(AudioBook);
