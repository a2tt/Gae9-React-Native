/**
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import {
  Button,
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
import {faSpinner} from '@fortawesome/free-solid-svg-icons';
import {RecoilRoot, useRecoilState} from 'recoil/native/recoil';

import {http} from './utils/http';
import {useStateCallback} from './utils/useStateCallback';
import {Tab} from './components/layout/header';
import {TrendContainer} from './components/trend/TrendList';
import {TrendDetail} from './components/trend/TrendDetail';
import {ReplyCommentWrite} from './components/comment/CommentWrite';
import {FontAwesomeSpin} from './utils/fontAweSome';

const Stack = createStackNavigator();

let moment = require('moment');
require('moment/locale/ko');
moment.locale('ko');

const App: () => Node = () => {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} options={{title: 'Gae9', headerShown: false}}/>
          <Stack.Screen name="TrendDetail" component={TrendDetail}/>
          <Stack.Screen name="WriteReplyComment" component={ReplyCommentWrite}/>
        </Stack.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
};

const Home: () => Node = props => {
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

  const loadTrends = () => {
    /* 게시글 로딩 */
    if (loading) return;

    setLoading(true);
    (currTab === 'hot'
        ? http.getHottestTrends()
        : currTab === 'new'
          ? http.getTrends(maxId)
          : http.getNsfwTrends()
    )
      .then(res => {
        // let lastId = 0;
        let _trends = res.data.response.trends.map(item => {
          item.site_description = item.sites.map(it => it.title).join(', ');
          return item;
        });

        if (res.data.response.next_max_id) {
          setMaxId(res.data.response.next_max_id); // 트랜드 로드 시 maxId 이하를 가져옴
        }

        setTrends(prev => {
          prev[currTab] = prev[currTab].concat(_trends);
          return prev;
        });
      })
      .catch(e => {
        console.error(e);
      })
      .finally(e => {
        setLoading(false);
      });
  };

  const [trends, setTrends] = useState(
    tabs
      .map(item => item.name)
      .reduce((obj, x) => {
        obj[x] = [];
        return obj;
      }, {}),
  );
  const [currTab, _setCurrTab] = useStateCallback('new'); // setState 에 대한 async callback
  const [maxId, setMaxId] = useState(0);
  const [loading, setLoading] = useState(false);

  const setCurrTab = newTab => {
    _setCurrTab(newTab, () => {});
  };

  useEffect(() => {
    if (trends[currTab].length === 0) {
      loadTrends();
    }
  }, [currTab]);

  useEffect(() => {
    /* 트랜드 변경 시 출력 (디버깅용) */
    // for (const tab in trends) {
    //   console.log(tab, trends[tab].length);
    // }
    // console.log(Object.keys(trends).length, maxId);
  }, [trends]);

  useEffect(() => {
    console.log('first render')
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

      {currTab === 'new' && (
        <MoreView>
          <MoreText onPress={e => loadTrends()}>
            {loading ? (
              <FontAwesomeSpin
                icon={faSpinner}
                style={{fontSize: 0, color: 'yellow'}}
              />
            ) : (
              '더 보기'
            )}
          </MoreText>
        </MoreView>
      )}

      <TrendContainer navigation={props.navigation} trends={trends[currTab]} isdarkMode={isDarkMode}/>
    </Gae9SafeAreaView>
  );
};

const Gae9SafeAreaView = styled.SafeAreaView`
  background-color: ${props => (props.darkMode ? Colors.darker : Colors.white)};
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

const MoreView = styled.View`
  margin-top: 10;
  margin-bottom: 10;
  margin-left: auto;
  margin-right: auto;
  background-color: #305060;
  padding-top: 4;
  padding-right: 20;
  padding-bottom: 4;
  padding-left: 20;
`;

const MoreText = styled.Text`
  text-align: center;
  color: #efefef;
`;
export default App;
