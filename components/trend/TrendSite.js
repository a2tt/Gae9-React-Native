import 'react-native-gesture-handler';
import React from 'react';
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
  return (
    <TrendSiteContainerView>
      <SiteHeaderView>
        <FontAwesomeIcon
          icon={faExternalLinkAlt}
          size={10}
          style={{flex: 1, paddingTop: 5}}
        />
        <Text>&nbsp;출처</Text>
      </SiteHeaderView>
      <View>
        {posts && posts.map(post => <TrendSite post={post} key={post.id} />)}
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
  padding-top: 10;
  padding-bottom: 10;
  padding-right: 8;
  padding-left: 8;
  border-bottom-color: #cccccc;
  border-bottom-width: 1;
  flex-direction: row;
  align-items: center;
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
