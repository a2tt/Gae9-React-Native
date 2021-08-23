import React, {useEffect} from 'react';
import {Text, View, ToastAndroid} from 'react-native';
import styled from 'styled-components/native';
import {useRecoilState} from 'recoil/native/recoil';
import {oauthProviderState, oauthTokenState} from '../../utils/state';

export const LoginContainer: () => Node = ({route, navigation}) => {
  const [oauthProvider, setOauthProvider] = useRecoilState(oauthProviderState);
  const [oauthToken, setOauthToken] = useRecoilState(oauthTokenState);

  useEffect(() => {
    if (route.params && route.params.toastMsg) {
      ToastAndroid.show(route.params.toastMsg, ToastAndroid.LONG);
    }
  }, [route.params]);

  if (oauthProvider && oauthToken) {
    return (
      <LoginView>
        <Text>{oauthProvider}</Text>
        <Text>{oauthToken}</Text>
      </LoginView>
    )
  } else {
    return (
      <LoginView>
        <BtnTouchableOpacity
          onPress={() =>
            navigation.navigate('OAuthWebView', {provider: 'kakao'})
          }>
          <View>
            <SocialText>KaKao</SocialText>
          </View>
        </BtnTouchableOpacity>
        <BtnTouchableOpacity
          onPress={() =>
            navigation.navigate('OAuthWebView', {provider: 'naver'})
          }>
          <View>
            <SocialText>Naver</SocialText>
          </View>
        </BtnTouchableOpacity>
        <BtnTouchableOpacity
          onPress={() =>
            navigation.navigate('OAuthWebView', {provider: 'facebook'})
          }>
          <View>
            <SocialText>Facebook</SocialText>
          </View>
        </BtnTouchableOpacity>
      </LoginView>
    );
  }
};

const LoginView = styled.View`
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const BtnTouchableOpacity = styled.TouchableOpacity`
  background-color: #cdcdcd;
  width: 50%;
  border-radius: 10;
  padding-top: 10;
  padding-bottom: 10;
  padding-right: 10;
  padding-left: 10;
  margin-top: 20;
`;

const SocialText = styled.Text`
  text-align: center;
`;
