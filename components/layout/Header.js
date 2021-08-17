import type {Node} from 'react';
import {StyleSheet, Text} from 'react-native';
import React from 'react';

export const Tab: () => Node = props => {
  let idx = props.idx;
  let tab = props.tab;
  let currTab = props.currTab;
  let setCurrTab = props.setCurrTab;
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
      key={tab.name}
      onPress={e => setCurrTab(tab.name)}>
      {tab.krName}
    </Text>
  );
};


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

