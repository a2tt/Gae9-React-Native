/**
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect} from 'react';
import type {Node} from 'react';
import {RecoilRoot, useRecoilState} from 'recoil/native/recoil';

import {DrawerNavigator} from './components/layout/DrawerNavigation';

let moment = require('moment');
require('moment/locale/ko');
moment.locale('ko');

const App: () => Node = () => {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <DrawerNavigator/>
      </NavigationContainer>
    </RecoilRoot>
  );
};

export default App;
