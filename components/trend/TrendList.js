import React, {useEffect, useState, useCallback} from 'react';
import type {Node} from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {http} from '../../utils/http';

const TrendItem: () => Node = ({navigation, trend}) => {
  return (
    <TouchableOpacity
      onPress={e => {
        navigation.navigate('TrendDetail', {
          trendCid: trend.id,
        });
      }}>
      <TrendView>
        <TrendThumbImage source={{uri: trend.thumb_url}}/>
        <TrendTextView>
          <TrendTitleText numberOfLines={2}>
            {trend.title}
          </TrendTitleText>
          <TrendMetaText>
            <TrendMetaViewText>
              {trend.view_cnt} view&nbsp;&nbsp;&nbsp;&nbsp;
            </TrendMetaViewText>
            <TrendMetaCommentText>
              <TrendCommentImage source={require('../../static/comment.png')}/>
              &nbsp;{trend.comments_cnt}
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

  const loadTrends = () => {
    /* 게시글 로딩 */
    if (loading) {
      return;
    }

    setLoading(true);
    (tabName === 'hot'
      ? http.getHottestTrends()
      : tabName === 'new'
        ? http.getTrends(maxId)
        : http.getNsfwTrends())
      .then(res => {
        saveTrends(res.data.response?.trends || res.data.trends);

        if (res.data.response?.next_max_id) {
          setMaxId(res.data.response.next_max_id); // 트랜드 로드 시 maxId 이하를 가져옴
        }
      })
      .catch(e => {
        console.error(e);
      })
      .finally(e => {
        setLoading(false);
      });
  };

  const saveTrends = trendData => {
    let _trends = trendData.map(item => {
      item.site_description = item.sites.map(it => it.title).join(', ');
      return item;
    });

    setTrends(prev => {
      if (prev.length >= 0) {
        return prev.concat(_trends);
      } else {
        return _trends;
      }
    });
  };

  const handleRefresh = () => {
    setTrends([]);
    setMaxId(0);
    setNeedLoading(true);
  };

  const handleLoadMore = () => {
    if (infinite && (tabName === 'new' || tabName === 'nsfw')) {
      loadTrends();
    }
  };

  const renderItem = ({item}) => (
    <TrendItem trend={item} navigation={navigation}/>
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

const TrendContainerView = styled.View``;

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
