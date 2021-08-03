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
} from 'react-native';
import styled from 'styled-components/native';
import {http} from '../../utils/http';

export const TrendDetail: () => Node = ({route, navigation}) => {
  const trendCid = route.params.trendCid;
  const [trend, setTrend] = useState({});
  const [imageSize, setImageSize] = useState({});
  const [myTrendAction, setMyTrendAction] = useState({good_cnt: 0, bad_cnt: 0});

  useEffect(() => {
    // 첫 렌더링 시, 트렌드 데이터를 가져온다.
    console.log('===============================');
    http.getTrend(trendCid).then(res => {
      setMyTrendAction(res.data.response.my_trend_action);
      let _trend = res.data.response.trend;

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
  }, []);

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
      <TrendImage
        source={{uri: item}}
        // width={deviceWidth.toFixed(1)}
        height={((deviceWidth * size[1]) / size[0]).toFixed(1)}
      />
    );
  };

  const memoizedValue = useCallback(renderItem, []); // FIXME image size 를 비동기로 가져오기 떄문에, 캐싱 문제가 발생
  const keyExtractor = useCallback(item => item, []);

  return (
    <>
      <ContentView>
        {Object.keys(imageSize).length > 0 && (
          <ImageFlatList
            data={Object.keys(imageSize)}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={{paddingBottom: 300}}
          />
        )}
      </ContentView>

      <Text>end</Text>
    </>
  );
};

const ImageFlatList = styled.FlatList``;

// width: ${props => props.width};
const TrendImage = styled.Image`
  resize-mode: contain;
  width: 100%;
  height: ${props => props.height};
  margin: 0 auto;
  background-color: #cccccc;
  margin-bottom: 20;
`;

const TrendScrollView = styled.ScrollView`
`;

const HeaderView = styled.View``;

const ContentView = styled.View`
  text-align: center;
`;
