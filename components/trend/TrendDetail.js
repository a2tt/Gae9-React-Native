import 'react-native-gesture-handler';
import React, {useState, useEffect, useCallback} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {myTrendLikeState, trendLikeState, trendState} from '../../utils/state';
import {useRecoilState, useRecoilValue} from 'recoil/native/recoil';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import {http} from '../../utils/http';
import {TrendSiteContainer} from './TrendSite';
import {TrendLikeContainer} from './TrendLike';
import {CommentContainer} from '../comment/Comment';
import {CommentWrite} from '../comment/CommentWrite';
import {faStar as faStarEmpty} from '@fortawesome/free-regular-svg-icons';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

export const TrendDetailNavHeader: () => Node = props => {
  const trend = useRecoilValue(trendState);
  const [scraped, setScraped] = useState(trend.scraped);

  useEffect(() => {
    setScraped(trend.scraped);
  }, [trend]);

  const toggleScrap = () => {
    http
      .trendScrap(trend.trend_num, scraped)
      .then(res => {
        if (res.status === 200) {
          setScraped(!scraped);
        }
      }).catch(e => {
      console.error(e);
    });
  };

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text numberOfLines={1} style={{fontSize: 16}}>{props.children}</Text>
      <TouchableOpacity
        style={{marginLeft: 'auto', padding: 4}}
        onPress={() => toggleScrap()}
      >
        {scraped
          ? (<FontAwesomeIcon icon={faStar}/>)
          : (<FontAwesomeIcon icon={faStarEmpty}/>)}
      </TouchableOpacity>
    </View>
  );
};

export const TrendDetail: () => Node = ({route, navigation}) => {
  const trendCid = route.params.trendCid;
  const [trend, setTrend] = useRecoilState(trendState);
  const [imageSize, setImageSize] = useState({});
  const [myTrendLike, setMyTrendLike] = useRecoilState(myTrendLikeState);
  const [trendLike, setTrendLike] = useRecoilState(trendLikeState);

  useEffect(() => {
    // 첫 렌더링 시, 트렌드 데이터를 가져온다.
    console.log('===============================');
    http.getTrend(trendCid).then(res => {
      setMyTrendLike(res.data.response.my_trend_action);
      let _trend = res.data.response.trend;
      setTrendLike(_trend.trend_data.expression);

      // width, height 값을 정확히 할아야 제대로 보여줄 수 있으므로, 이미지 사이즈 먼저 확인한다.
      Promise.all(_trend.images.map(imageUrl => getImageSize(imageUrl))).then(
        values => {
          let _imageSize = {};
          _trend.images.map((imageUrl, idx) => {
            _imageSize[imageUrl] = values[idx];
          });
          setImageSize(_imageSize);
          setTrend(_trend);
        },
      );

      navigation.setOptions({title: res.data.response.trend.title}); // navigation header title
    });
  }, [route]);

  const getImageSize = uri =>
    new Promise(resolve => {
      Image.getSize(uri, (width, height) => {
        resolve([width, height]);
      });
    });

  const renderItem = ({item}) => {
    const size = imageSize[item];
    if (!size) {
      return;
    }
    const deviceWidth = Dimensions.get('window').width;
    return (
      <FastImage
        style={[
          styles.image,
          {
            width: deviceWidth,
            height: (deviceWidth * size[1]) / size[0],
          },
        ]}
        source={{uri: item}}
      />
    );
  };

  const keyExtractor = useCallback(item => item, []);

  return (
    <ContentView>
      <View style={{flex: 1}}>
        {Object.keys(imageSize).length > 0 && (
          <ImageFlatList
            data={Object.keys(imageSize)}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListFooterComponent={(
              <BelowImage
                route={route}
                navigation={navigation}
                trend={trend}
              />
            )}
          />
        )}
      </View>
      <CommentWrite trendCid={trendCid}/>
    </ContentView>
  );
};

const BelowImage: () => Node = ({route, navigation, trend}) => {
  return (
    <View>
      <TrendLikeContainer/>
      <TrendSiteContainer posts={trend.posts}/>
      <CommentContainer route={route} navigation={navigation}/>
    </View>
  );
};

const ImageFlatList = styled.FlatList`
  text-align: center;
`;

const TrendScrollView = styled.ScrollView``;

const HeaderView = styled.View``;

const ContentView = styled.View`
  flex: 1;
`;

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#cccccc',
    marginTop: 0,
  },
});
