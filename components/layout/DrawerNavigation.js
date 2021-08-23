import React from 'react';
import styled from 'styled-components/native';
import {SafeAreaView, TouchableOpacity} from 'react-native';
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

const Drawer = createDrawerNavigator();

const CustomDrawerContent: () => Node = (props) => {
  return (
    <SafeAreaView style={{flex: 1}}>
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

      <DrawerContentScrollView {...props}>
        <DrawerItem label="test 1" onPress={() => console.log(1)}/>
        <DrawerItem label="test 2" onPress={() => console.log(2)}/>
        <DrawerItemList {...props}/>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

export const DrawerNavigator: () => Node = () => {
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
