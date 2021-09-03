import 'react-native-gesture-handler';
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

import {http} from '../utils/http';
import {Tab} from './layout/Header';
import {TrendContainer} from './trend/TrendList';
import {FontAwesomeSpin} from '../utils/fontAwesomeSpin';
import {useRecoilState} from 'recoil/native/recoil';
import {currTabState} from '../utils/atom';

export const Home: () => Node = props => {
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

  // const [trends, setTrends] = useState(
  //   tabs
  //     .map(item => item.name)
  //     .reduce((obj, x) => {
  //       obj[x] = [];
  //       return obj;
  //     }, {}),
  // );
  const [currTab, setCurrTab] = useRecoilState(currTabState);

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
        <TrendContainer navigation={props.navigation} tabName="new" infinite={true}/>
      )}
      {currTab === 'hot' && (
        <TrendContainer navigation={props.navigation} tabName="hot"/>
      )}
      {currTab === 'nsfw' && (
        <TrendContainer navigation={props.navigation} tabName="nsfw"/>
      )}

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
