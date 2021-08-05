import React, {useCallback} from 'react';
import type {Node} from 'react';
import {TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

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

export const TrendContainer: () => Node = props => {
  const renderItem = ({item}) => (
    <TrendList trend={item} navigation={props.navigation}/>
  );

  const memoizedValue = useCallback(renderItem, []);
  const keyExtractor = useCallback(item => item.id,[]);

  return (
    <TrendContainerView
      contentInsetAdjustmentBehavior="automatic"
      darkMode={props.isDarkMode}>
      <TrendFlatList
        data={props.trends}
        renderItem={memoizedValue}
        keyExtractor={keyExtractor}
        contentContainerStyle={{ paddingBottom: 300 }}
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
