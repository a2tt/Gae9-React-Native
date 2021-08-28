import {Text, FlatList, View, StyleSheet} from 'react-native';
import React, {useState, useEffect} from 'react';
import {http} from '../../utils/http';
import TimeAgo from 'react-native-timeago';
import styled from 'styled-components/native';
import FastImage from 'react-native-fast-image';

let moment = require('moment');

export const MyScrap: () => Node = ({route, navigation}) => {
  const [scraps, setScraps] = useState([]);

  useEffect(() => {
    http.userScraps().then(res => {
      setScraps(res.data.trends.reverse());
    });
  }, []);

  const onPress = cid => {
    navigation.navigate('TrendDetail', {
      trendCid: cid,
    });
  };

  const renderItem = ({item}) => {
    const time = moment(item.created_at);

    return (
      <ContainerTouchableOpacity onPress={() => onPress(item.id)}>
        <FastImage
          style={{
            width: 70,
            height: 70,
            borderRadius: 10,
          }}
          source={{uri: item.thumb_url}}
        />
        <ContentView>
          <UpperView>
            <Text>{item.title}</Text>
          </UpperView>
          <TimeAgoText>
            <TimeAgo style={styles.timeAgo} time={time}/>
            {'     '}
          </TimeAgoText>
        </ContentView>
      </ContainerTouchableOpacity>
    );
  };

  return (
    <FlatList
      data={scraps}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

const ContainerTouchableOpacity = styled.TouchableOpacity`
  flex-direction: row;
  padding-top: 4;
  padding-bottom: 4;
  padding-right: 6;
  padding-left: 6;
  margin-right: 4;
  margin-left: 4;
  border-bottom-width: 1;
  border-bottom-color: #ccc;
  align-items: center;
`;

const UpperView = styled.View`
  flex-direction: row;
  margin-bottom: 4;
`;

const TimeAgoText = styled.Text`
  margin-top: 2;
  font-size: 12;
  margin-left: auto;
  color: #999;
`;

const ContentView = styled.View`
  margin-left: 10;
  flex: 1;
`;

const styles = StyleSheet.create({
  timeAgo: {
    color: '#bbb',
    fontSize: 11,
    marginRight: 20,
  },
});
