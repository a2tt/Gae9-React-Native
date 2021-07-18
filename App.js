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
import {TrendContainer} from './components/trend/trend';


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

  const loadTrends = tab => {
    /* 게시글 로딩 */
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

  const [trends, setTrends] = useState([]);
  const [currTab, _setCurrTab] = useStateCallback('hot');

  const setCurrTab = newTab => {
    _setCurrTab(newTab);
    loadTrends(newTab);
  };

  useEffect(() => {
    /* 트랜드 변경 시 출력 (디버깅용) */
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
    /* 앱 실행 시 트랜드 로딩 */
    loadTrends(currTab);
  }, []);

  return (
    <Gae9SafeAreaView darkMode={isDarkMode}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}/>
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

      <TrendContainer trends={trends} isdarkMode={isDarkMode}/>
    </Gae9SafeAreaView>
  );
};

const Gae9SafeAreaView = styled.SafeAreaView`
  background-color: ${props => props.darkMode ? Colors.darker : Colors.white}
`;

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

export default App;
