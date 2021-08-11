import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import {Text, View, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import TimeAgo from 'react-native-timeago';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import styled from 'styled-components/native';

let moment = require('moment');

const TrendSite: () => Node = ({post}) => {
  // API server returns KST without offset. Add utc offset to use timeAgo
  const time = moment(post.created_at).utcOffset('+09:00', true);
  return (
    <TouchableOpacity
      onPress={() => {
        Linking.openURL(post.source);
      }}>
      <TrendSiteView>
        <View>
          <Text>{post.title}</Text>
        </View>
        <View>
          <Text>
            <TimeAgo style={styles.timeAgo} time={time}/>
            {'      '}
            <SiteTitleText>{post.site.title}</SiteTitleText>
          </Text>
        </View>
      </TrendSiteView>
    </TouchableOpacity>
  );
};

export const TrendSiteContainer: () => Node = ({posts}) => {
  const defaultNum = 3;
  const [showAll, setShowAll] = useState(false);
  const [visibleSites, setVisibleSites] = useState([]);

  useEffect(() => {
    posts.length <= defaultNum ? setShowAll(true) : setShowAll(false);
    applyVisiblility();
  }, [posts]);

  useEffect(() => {
    applyVisiblility();
  }, [showAll]);

  const applyVisiblility = () => {
    let limit = showAll ? posts.length : defaultNum;
    setVisibleSites(posts.slice(0, limit));
  };

  return (
    <TrendSiteContainerView>
      <SiteHeaderView>
        <SiteHeaderTextView>
          <FontAwesomeIcon
            icon={faExternalLinkAlt}
            size={10}
            style={{flex: 1, paddingTop: 5}}
          />
          <Text>&nbsp;출처</Text>
        </SiteHeaderTextView>
        {!showAll && (
          <LoadMoreTouchable onPress={e => setShowAll(true)}>
            <LoadMoreText>더보기</LoadMoreText>
          </LoadMoreTouchable>
        )}
      </SiteHeaderView>
      <View>
        {visibleSites.length > 0 && visibleSites.map(post => <TrendSite post={post} key={post.id}/>)}
      </View>
    </TrendSiteContainerView>
  );
};

const TrendSiteContainerView = styled.View`
  padding-top: 30;
  background-color: white;
  padding-left: 10;
  padding-right: 10;
`;

const SiteHeaderView = styled.View`
  flex-direction: row;
  border-bottom-color: #cccccc;
  border-bottom-width: 1;
  justify-content: space-between;
  align-items: center;
`;

const SiteHeaderTextView = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 10;
  padding-bottom: 10;
  padding-right: 8;
  padding-left: 8;
`;

const LoadMoreTouchable = styled.TouchableOpacity`
  border-width: 1px;
  padding-top: 2;
  padding-bottom: 2;
  padding-right: 8;
  padding-left: 8;
  border-radius: 6;
  border-color: #777;
`;
const LoadMoreText = styled.Text`
  color: #777;
`;

const TrendSiteView = styled.View`
  padding-top: 10;
  padding-bottom: 10;
  padding-right: 8;
  padding-left: 8;
`;

const SiteTitleText = styled.Text`
  font-size: 11;
  color: #3ad1ff;
`;

const styles = StyleSheet.create({
  timeAgo: {
    color: '#bbb',
    fontSize: 11,
    marginRight: 20,
  },
});
