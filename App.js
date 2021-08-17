/**
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';
import type {Node} from 'react';
import {RecoilRoot} from 'recoil/native/recoil';

import {TrendDetail} from './components/trend/TrendDetail';
import {ReplyCommentWrite} from './components/comment/CommentWrite';
import {SettingContainer} from './components/user/setting';
import {Home} from './components/Home';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

let moment = require('moment');
require('moment/locale/ko');
moment.locale('ko');

const StackNavigator: () => Node = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{title: 'Gae9', headerShown: false}}/>
      <Stack.Screen name="TrendDetail" component={TrendDetail} options={{title: ''}}/>
      <Stack.Screen name="WriteReplyComment" component={ReplyCommentWrite} options={{title: ''}}/>
    </Stack.Navigator>
  );
};

const App: () => Node = () => {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={StackNavigator} options={{drawerLabel: 'Home'}}/>
          <Drawer.Screen name="Setting" component={SettingContainer} options={{drawerLabel: 'Setting'}}/>
        </Drawer.Navigator>
      </NavigationContainer>
    </RecoilRoot>
  );
};

export default App;
