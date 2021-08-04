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
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import {http} from '../../utils/http';

const TrendSite: () => Node = ({route, navigation}) => {
};

export const TrendSiteContainer: () => Node = ({route, navigation}) => {
  return (
    <>
      <View>
        <Text>출처</Text>
      </View>
      <View>
        <View><Text>1</Text></View>
        <View><Text>2</Text></View>
        <View><Text>3</Text></View>
      </View>
    </>
  )
};
