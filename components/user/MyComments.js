import {Text, FlatList, View, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {http} from '../../utils/http';
import TimeAgo from 'react-native-timeago';
import styled from 'styled-components/native/dist/styled-components.native.esm';

let moment = require('moment');

export const MyComment: () => Node = ({route, navigation}) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    http.userComments().then(res => {
      setComments(res.data.response.comments);
    });
  }, []);

  const onPress = (cid) => {
    navigation.navigate('TrendDetail', {
      trendCid: cid,
    });
  };

  const renderItem = ({item}) => {
    const time = moment(item.created_at);

    return (
      <ContainerTouchableOpacity onPress={() => onPress(item.cid)}>
        <UpperView>
          <Text>{item.title}</Text>
          <TimeAgoText>
            <TimeAgo style={styles.timeAgo} time={time}/>
            {'     '}
          </TimeAgoText>
        </UpperView>
        <ContentText>{item.content}</ContentText>
      </ContainerTouchableOpacity>
    );
  };

  return (
    <FlatList
      data={comments}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const ContainerTouchableOpacity = styled.TouchableOpacity`
  padding-top: 10;
  padding-bottom: 10;
  padding-right: 6;
  padding-left: 6;
  margin-right: 10;
  margin-left: 10;
  border-bottom-width: 1;
  border-bottom-color: #ccc;
`;

const UpperView = styled.View`
  flex-direction: row;
  margin-bottom: 4;
`;

const TimeAgoText = styled.Text`
  margin-top: 2;
  margin-left: auto;
  font-size: 12;
  color: #999;
`;

const ContentText = styled.Text`
  color: #888;
`;

const styles = StyleSheet.create({
  timeAgo: {
    color: '#bbb',
    fontSize: 11,
    marginRight: 20,
  },
});
