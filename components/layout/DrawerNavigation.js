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
import {LoginContainer} from '../user/Login';
import {OauthWebViewContainer} from '../user/OauthWebView';
import {LoginedHeader} from './DrawerHeader';
import {MyComment} from '../user/MyComments';
import {TrendDetail} from '../trend/TrendDetail';
import {useRecoilState, useRecoilValue} from 'recoil/native/recoil';
import {
  oauthProviderState,
  oauthTokenState,
  toastMsgState,
  myState,
  profileState,
} from '../../utils/atom';
import {MyScrap} from '../user/MyScrap';
import {http} from '../../utils/http';

const Drawer = createDrawerNavigator();

const CustomDrawerHeader: () => Node = ({loggedIn, navigation}) => {
  const [oauthProvider] = useRecoilValue(oauthProviderState);

  if (loggedIn) {
    return <LoginedHeader oauthProvider={oauthProvider}/>;
  } else {
    return (
      <DrawerToLoginView>
        <DrawerToLoginText>
          로그인을 하시면{'\n'}좀 더 다양한 기능을 사용할 수 있어요!
        </DrawerToLoginText>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}>
          <DrawerToLoginBtnView>
            <DrawerToLoginBtnText>로그인하기</DrawerToLoginBtnText>
          </DrawerToLoginBtnView>
        </TouchableOpacity>
      </DrawerToLoginView>
    );
  }
};

const CustomDrawerContent: () => Node = (props) => {
  const [oauthProvider, setOauthProvider] = useRecoilState(oauthProviderState);
  const [oauthToken, setOauthToken] = useRecoilState(oauthTokenState);
  const [, setMy] = useRecoilState(myState);
  const [, setProfie] = useRecoilState(profileState);
  const [, setToastMsg] = useRecoilState(toastMsgState);

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (oauthProvider && oauthToken) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [oauthProvider, oauthToken]);

  const doLogout = async () => {
    setOauthProvider('');
    setOauthToken('');
    setMy('');
    setProfie('');
    setToastMsg('로그아웃 되었습니다.');
    props.navigation.navigate('Home');
  };

  const {state, ...restProps} = props;
  const newState = {...state}; // copy
  const LoginOnly = ['MyComment', 'MyScrap'];
  let excludeItemNames = ['Login', 'OAuthWebView', 'TrendDetail'];

  if (!loggedIn) {
    excludeItemNames = excludeItemNames.concat(LoginOnly);
  }
  newState.routes = newState.routes.filter(
    item => !excludeItemNames.includes(item.name),
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <CustomDrawerHeader loggedIn={loggedIn} navigation={props.navigation}/>
      <DrawerContentScrollView {...props}>
        <DrawerItemList state={newState} {...restProps}/>
        {loggedIn && <DrawerItem label="로그아웃" onPress={() => doLogout()}/>}
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

export const DrawerNavigator: () => Node = () => {
  const [toastMsg, setToastMsg] = useRecoilState(toastMsgState);
  const [oauthToken] = useRecoilValue(oauthTokenState);
  const [oauthProvider] = useRecoilValue(oauthProviderState);
  const [, setMyState] = useRecoilState(myState);
  const [, setProfile] = useRecoilState(profileState);

  useEffect(() => {
    if (oauthToken && oauthProvider) {
      getUserInfo();
    }
  }, [oauthToken]);

  const getUserInfo = async () => {
    let res = await http.me();
    setMyState(res.data.response.setting);

    let res2 = await http.getProfile();
    setProfile(res2.data.response.user);
  };

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
      <Drawer.Screen name="Home" component={StackNavigator} options={{drawerLabel: '홈'}}/>
      <Drawer.Screen name="MyComment" component={MyComment} options={{drawerLabel: '내가 작성한 댓글'}}/>
      <Drawer.Screen name="MyScrap" component={MyScrap} options={{drawerLabel: '내가 스크랩한 글'}}/>
      <Drawer.Screen name="Login" component={LoginContainer} options={{drawerLabel: ''}}/>
      <Drawer.Screen name="OAuthWebView" component={OauthWebViewContainer} options={{drawerLabel: ''}}/>
      <Drawer.Screen name="TrendDetail" component={TrendDetail} options={{drawerLabel: ''}}/>
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
