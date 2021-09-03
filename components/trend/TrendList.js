import React, {useEffect, useState, useCallback} from 'react';
import type {Node} from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useRecoilState} from 'recoil/native/recoil';
import {currTabState} from '../../utils/atom';
import {http} from '../../utils/http';

const TrendList: () => Node = props => {
  return (
    <TouchableOpacity
      onPress={e => {
        props.navigation.navigate('TrendDetail', {
          trendCid: props.trend.id,
        });
      }}>
      <TrendView>
        <TrendThumbImage source={{uri: props.trend.thumb_url}}/>
        <TrendTextView>
          <TrendTitleText numberOfLines={2}>
            {props.trend.title}
          </TrendTitleText>
          <TrendMetaText>
            <TrendMetaViewText>
              {props.trend.view_cnt} view&nbsp;&nbsp;&nbsp;&nbsp;
            </TrendMetaViewText>
            <TrendMetaCommentText>
              <TrendCommentImage source={require('../../static/comment.png')}/>
              &nbsp;{props.trend.comments_cnt}
            </TrendMetaCommentText>
          </TrendMetaText>
        </TrendTextView>
      </TrendView>
    </TouchableOpacity>
  );
};

export const TrendContainer: () => Node = ({navigation, tabName, infinite}) => {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(false);
  const [maxId, setMaxId] = useState(0);
  const [needLoading, setNeedLoading] = useState(true);

  useEffect(() => {
    if (needLoading === true) {
      loadTrends();
      setNeedLoading(false);
    }
  }, [needLoading]);

  const handleRefresh = () => {
    setTrends([]);
    setMaxId(0);
    setNeedLoading(true);
  };

  const loadTrends = () => {
    /* 게시글 로딩 */
    if (loading) {
      return;
    }

    setLoading(true);
    if (tabName === 'nsfw') {
      http
        .getNsfwTrends()
        .then(res => {
          let _trends = res.data.trends.map(item => {
            item.site_description = item.sites.map(it => it.title).join(', ');
            return item;
          });

          _trends.forEach(item => {
            console.log(item.title);
          });

          setTrends(prev => {
            if (prev.length >= 0) {
              return prev.concat(_trends);
            } else {
              return _trends;
            }
          });
        })
        .catch(e => {
          console.error(e);
        })
        .finally(e => {
          setLoading(false);
        });
    } else {
      (tabName === 'hot' ? http.getHottestTrends() : http.getTrends(maxId))
        .then(res => {
          let _trends = res.data.response.trends.map(item => {
            item.site_description = item.sites.map(it => it.title).join(', ');
            return item;
          });

          if (res.data.response.next_max_id) {
            setMaxId(res.data.response.next_max_id); // 트랜드 로드 시 maxId 이하를 가져옴
          }

          setTrends(prev => {
            if (prev.length >= 0) {
              return prev.concat(_trends);
            } else {
              return _trends;
            }
          });
        })
        .catch(e => {
          console.error(e);
        })
        .finally(e => {
          setLoading(false);
        });
    }
  };

  const handleLoadMore = () => {
    if (tabName === 'new' || tabName === 'nsfw') {
      loadTrends();
    }
  };

  const renderItem = ({item}) => (
    <TrendList trend={item} navigation={navigation}/>
  );

  const memoizedValue = useCallback(renderItem, []);
  const keyExtractor = useCallback(item => item.id, []);

  return (
    <TrendContainerView contentInsetAdjustmentBehavior="automatic">
      <TrendFlatList
        data={trends}
        renderItem={memoizedValue}
        keyExtractor={keyExtractor}
        contentContainerStyle={{paddingBottom: 100}}
        refreshing={loading}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={1}
      />
    </TrendContainerView>
  );
};

const TrendContainerView = styled.View`
  background-color: ${props => (props.darkMode ? Colors.darker : Colors.white)};
`;

const TrendFlatList = styled.FlatList``;

const TrendView = styled.View`
  padding: 1%;
  flex-direction: row;
`;
const TrendThumbImage = styled.Image`
  width: 70;
  height: 70;
  border-radius: 10;
`;
const TrendTextView = styled.View`
  flex-direction: column;
  flex: 1;
  padding-top: 6;
  padding-left: 8;
  font-size: 12;
  border-bottom-width: 1;
  border-bottom-color: #ddd;
`;

const TrendTitleText = styled.Text`
  height: 40;
  color: #000;
`;
const TrendMetaText = styled.Text`
  color: blue;
  text-align: right;
`;

const TrendMetaViewText = styled.Text`
  color: #00bfff;
`;
const TrendCommentImage = styled.Image`
  width: 14;
  height: 14;
`;
const TrendMetaCommentText = styled.Text`
  color: #000;
`;
