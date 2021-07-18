/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
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
} from 'react-native';
import styled from 'styled-components/native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {http} from './utils/http';
import {useStateCallback} from './utils/useStateCallback';
import {Tab} from './components/layout/header';


const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const tabs = [
    {
      name: 'new',
      krName: '최신',
    },
    {
      name: 'hot',
      krName: '인기!',
    },
    {
      name: 'nsfw',
      krName: '안건전',
    },
  ];

  const [trends, setTrends] = useState([]);

  const [currTab, _setCurrTab] = useStateCallback('hot');
  const loadTrends = tab => {
    (tab === 'hot' ? http.getHottestTrends() : http.getTrends())
      .then(res => {
        // this.isLoadingTrends = false;
        // this.last_update_at = res.data.response.last_update_at;
        // this.nextMaxId = res.data.response.next_max_id;
        let _trends = res.data.response.trends.map(item => {
          item.site_description = item.sites.map(it => it.title).join(', ');
          return item;
        });
        setTrends(prev => prev.concat(_trends));
      })
      .catch(e => {
        console.error(e);
      });
  };

  const setCurrTab = newTab => {
    _setCurrTab(newTab);
    loadTrends(newTab);
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    for (let trend of trends) {
      console.log(
        trend.id,
        trend.title,
        trend.thumb_url,
        trend.view_cnt,
        trend.comments_cnt,
      );
    }
    console.log(trends.length);
  }, [trends]);

  useEffect(() => {
    loadTrends(currTab);
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}/>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <TabWrapper>
          {tabs.map((tab, idx) => {
            return (
              <Tab
                idx={idx}
                tab={tab}
                currTab={currTab}
                setCurrTab={setCurrTab}
                tabs={tabs}
              />
            );
          })}
        </TabWrapper>

        <ListContainer
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <TrendContainer
            data={trends}
            renderItem={({item}) => (
              <Trend>
                <TrendThumb source={{uri: item.thumb_url}}/>
                <TrendTextView>
                  <TrendTitle numberOfLines={2}>
                    {item.title}
                  </TrendTitle>
                  <TrendMeta>
                    <TrendMetaViewText>
                      {item.view_cnt} view&nbsp;&nbsp;&nbsp;&nbsp;
                    </TrendMetaViewText>
                    <TrendMetaCommentText>
                      <TrendCommentImage source={require('./static/comment.png')} />
                      &nbsp;{item.comments_cnt}
                    </TrendMetaCommentText>
                  </TrendMeta>
                </TrendTextView>
              </Trend>
            )}
          />
        </ListContainer>
      </ScrollView>
    </SafeAreaView>
  );
};


const ListContainer = styled.View``;

const TabWrapper = styled.View`
  flex-direction: row;
  margin-top: 10;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 10;
  width: 300;
  background-color: #efefef;
  border-width: 1;
  border-color: #305060;
  border-radius: 10;
  text-align: center;
`;

const TrendContainer = styled.FlatList``;

const Trend = styled.View`
  padding: 1.0%;
  flex-direction: row;
`;
const TrendThumb = styled.Image`
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

const TrendTitle = styled.Text`
  height: 40;
  color: #000;
`;
const TrendMeta = styled.Text`
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

export default App;
