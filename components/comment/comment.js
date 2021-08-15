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
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import {http} from '../../utils/http';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faComments} from '@fortawesome/free-solid-svg-icons';
import TimeAgo from 'react-native-timeago';
import {stringColor} from '../../utils/stringColor';

let moment = require('moment');

export const CommentContainer: () => Node = ({trendCid}) => {
  const [loaded, setLoaded] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!trendCid) {
      return;
    }
    http.getComments(trendCid).then(res => {
      setComments(res.data.response.comments);
    });
  }, [trendCid]);

  useEffect(() => {
    setLoaded(true);
  }, [comments]);

  const renderItem = ({item}) => (
    <Comment comment={item}/>
  );

  return (
    <CommentContainerView>
      <CommentHeaderView>
        <FontAwesomeIcon
          icon={faComments}
          size={14}
        />
        <Text>&nbsp;댓글 ({comments.length})</Text>
      </CommentHeaderView>
      <View>
        {loaded && (
          <FlatList
            data={comments}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        )}
      </View>
    </CommentContainerView>
  );
};

const Comment: () => Node = ({comment}) => {
  const time = moment(comment.created_at).utcOffset('+09:00', true);

  return (
    <CommentView depth={comment.depth}>
      <ProfileImageView>
        <FastImage
          style={[
            styles.profileImage,
            {
              backgroundColor: '#' + stringColor(comment.username),
            },
          ]}
        />
        <ProfileImageText>{comment.username.slice(0, 5)}</ProfileImageText>
      </ProfileImageView>
      <DataView>
        <UsernameText>{comment.username}</UsernameText>
        <Text>{comment.content}</Text>
        <MetaText>
          <TimeAgo style={styles.timeAgo} time={time}/>
          {'     '}
          답글 달기
        </MetaText>
      </DataView>
    </CommentView>
  );
};

const CommentContainerView = styled.View`
  padding-top: 30;
  background-color: white;
  padding-left: 10;
  padding-right: 10;
`;

const CommentHeaderView = styled.View`
  flex-direction: row;
  border-bottom-color: #cccccc;
  border-bottom-width: 1;
  align-items: center;
  padding-top: 10;
  padding-bottom: 10;
  padding-right: 8;
  padding-left: 8;
`;

const CommentView = styled.View`
  flex-direction: row;
  margin-left: ${props => (props.depth - 1) * 14};
`;

const ProfileImageView = styled.View`
  margin-top: 8;
  margin-bottom: 8;
  margin-right: 10;
  width: 44;
  height: 44;
  text-align: center;
  justify-content: center;
  align-items: center;
`;

const ProfileImageText = styled.Text`
  color: #fff;
  height: 20;
`;
const DataView = styled.View`
  flex: 1;
  padding-top: 10;
`;

const UsernameText = styled.Text`
  font-weight: 700;
  margin-bottom: 2;
  font-size: 12;
`;

const MetaText = styled.Text`
  margin-top: 6;
  font-size: 12;
  color: #999;
`;

const styles = StyleSheet.create({
  profileImage: {
    position: 'absolute',
    borderRadius: 100,
    width: '100%',
    height: '100%',
  },
});
