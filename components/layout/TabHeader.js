import type {Node} from 'react';
import {StyleSheet, Text} from 'react-native';
import React from 'react';
import styled from 'styled-components/native/dist/styled-components.native.esm';
import {useRecoilState} from 'recoil/native/recoil';
import {currTabState} from '../../utils/atom';

export const TabWrapper: () => Node = ({tabs}) => {
  return (
    <TabWrapperView>
      {tabs.map((tab, idx) => {
        return <Tab idx={idx} tab={tab} tabs={tabs}/>;
      })}
    </TabWrapperView>
  );
};

const Tab: () => Node = props => {
  const [currTab, setCurrTab] = useRecoilState(currTabState);

  let idx = props.idx;
  let tab = props.tab;
  let tabs = props.tabs;

  return (
    <Text
      style={[
        styles.headerTab,
        currTab === tab.name ? styles.headerActiveTab : '',
        idx === 0
          ? styles.headerFirstTab
          : idx === tabs.length - 1
          ? styles.headerLastTab
          : '',
      ]}
      onPress={e => setCurrTab(tab.name)}>
      {tab.krName}
    </Text>
  );
};

const TabWrapperView = styled.View`
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

const styles = StyleSheet.create({
  headerActiveTab: {
    backgroundColor: '#305060',
    color: '#efefef',
  },
  headerTab: {
    flex: 1,
    textAlign: 'center',
    paddingTop: 4,
    paddingRight: 10,
    paddingBottom: 4,
    paddingLeft: 10,
    borderRightWidth: 1,
    borderRightColor: '#305060',
    color: '#305060',
  },
  headerFirstTab: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  headerLastTab: {
    borderRightWidth: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
});

