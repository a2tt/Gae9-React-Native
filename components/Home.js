import 'react-native-gesture-handler';
import React from 'react';
import type {Node} from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import styled from 'styled-components/native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {TabWrapper} from './layout/TabHeader';
import {TrendContainer} from './trend/TrendList';
import {useRecoilState} from 'recoil/native/recoil';
import {currTabState} from '../utils/atom';

export const Home: () => Node = ({navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const tabs = [
    {
      name: 'new',
      krName: '최신',
    },
    {
      name: 'hot',
      krName: '인기',
    },
    {
      name: 'nsfw',
      krName: '안건전',
    },
  ];

  const [currTab] = useRecoilState(currTabState);

  return (
    <Gae9SafeAreaView darkMode={isDarkMode}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}/>
      <TabWrapper tabs={tabs}/>

      {currTab === 'new' && (
        <TrendContainer navigation={navigation} tabName="new" infinite={true}/>
      )}
      {currTab === 'hot' && (
        <TrendContainer navigation={navigation} tabName="hot" infinite={false}/>
      )}
      {currTab === 'nsfw' && (
        <TrendContainer navigation={navigation} tabName="nsfw" infinite={true}/>
      )}

    </Gae9SafeAreaView>
  );
};

const Gae9SafeAreaView = styled.SafeAreaView`
  background-color: ${props => (props.darkMode ? Colors.darker : Colors.white)};
`;
