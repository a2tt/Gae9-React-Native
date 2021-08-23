import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import {SafeAreaView, Text, ToastAndroid, TouchableOpacity} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {StackNavigator} from './StackNavigation';
import {SettingContainer} from '../user/Setting';
import {LoginContainer} from '../user/Login';
import {OauthWebViewContainer} from '../user/OauthWebView';
import {useRecoilState} from 'recoil/native/recoil';
import {
  oauthProviderState, oauthTokenState, toastMsgState,
} from '../../utils/state';
import {View} from 'react-native-reanimated';

const Drawer = createDrawerNavigator();

const CustomDrawerContent: () => Node = (props) => {
  const [oauthProvider, setOauthProvider] = useRecoilState(oauthProviderState);
  const [oauthToken, setOauthToken] = useRecoilState(oauthTokenState);
  const [, setToastMsg] = useRecoilState(toastMsgState);

  const [logined, setLogined] = useState(false);

  useEffect(() => {
    if (oauthProvider && oauthToken) {
      setLogined(true);
    } else {
      setLogined(false);
    }
  }, [oauthProvider, oauthToken]);

  const doLogout = () => {
    setOauthProvider('');
    setOauthToken('');
    setToastMsg('로그아웃 되었습니다.');
    props.navigation.navigate('Home');
  };

  const drawerHeader = () => {
    if (oauthProvider && oauthToken) {
      return (
        <DrawerToLoginView>
          <Text>{oauthProvider}</Text>
          <Text>{oauthToken}</Text>
        </DrawerToLoginView>
      );
    } else {
      return (
        <DrawerToLoginView>
          <DrawerToLoginText>
            로그인을 하시면{'\n'}좀 더 다양한 기능을 사용할 수 있어요!
          </DrawerToLoginText>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('Login');
            }}>
            <DrawerToLoginBtnView>
              <DrawerToLoginBtnText>로그인하기</DrawerToLoginBtnText>
            </DrawerToLoginBtnView>
          </TouchableOpacity>
        </DrawerToLoginView>
      );
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {drawerHeader()}
      <DrawerContentScrollView {...props}>
        {logined && (
          <DrawerItem label="로그아웃" onPress={() => doLogout()}/>
        )}
        <DrawerItemList {...props}/>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

export const DrawerNavigator: () => Node = () => {
  const [toastMsg, setToastMsg] = useRecoilState(toastMsgState);

  useEffect(() => {
    if (toastMsg) {
      ToastAndroid.show(toastMsg, ToastAndroid.LONG);
      setToastMsg('');
    }
  }, [toastMsg]);

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={_props => <CustomDrawerContent {..._props} />}>
      <Drawer.Screen name="Home" component={StackNavigator} options={{drawerLabel: 'Home'}}/>
      <Drawer.Screen name="Setting" component={SettingContainer} options={{drawerLabel: 'Setting'}}/>
      <Drawer.Screen name="Login" component={LoginContainer} options={{drawerLabel: 'Login'}}/>
      <Drawer.Screen name="OAuthWebView" component={OauthWebViewContainer} options={{drawerLabel: 'OAuthWebView'}}/>
    </Drawer.Navigator>
  );
};


const DrawerToLoginView = styled.View`
  padding-top: 20;
  padding-bottom: 20;
  padding-right: 20;
  padding-left: 20;
  background-color: #3d3d3d;
`;

const DrawerToLoginText = styled.Text`
  color: #cccccc;
`;

const DrawerToLoginBtnView = styled.View`
  margin-top: 10;
  background-color: #5d5d5d;
  padding-top: 7;
  padding-bottom: 7;
  padding-right: 7;
  padding-left: 7;
  border-radius: 6;
`;

const DrawerToLoginBtnText = styled.Text`
  color: #ffffff;
  text-align: center;
`;
