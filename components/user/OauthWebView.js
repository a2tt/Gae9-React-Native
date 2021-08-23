import React, {useRef} from 'react';
import {WebView} from 'react-native-webview';
import {oauthProviderState, oauthTokenState, toastMsgState} from '../../utils/state';
import {useRecoilState} from 'recoil/native/recoil';

import {
  NAVER_CREDENTIAL,
  KAKAO_CREDENTIAL,
  FACEBOOK_CREDENTIAL,
} from '../../constants';

const gae9ApiUri = 'https://gae9.com/api';
const redirectUri = {
  naver:
    'https://nid.naver.com/oauth2.0/authorize?response_type=code' +
    `&client_id=${NAVER_CREDENTIAL.client}` +
    `&redirect_uri=${gae9ApiUri}/users/oauth/naver` +
    '&state=gae9',
  kakao:
    'https://kauth.kakao.com/oauth/authorize?response_type=code' +
    `&client_id=${KAKAO_CREDENTIAL.client}` +
    `&redirect_uri=${gae9ApiUri}/users/oauth/kakao` +
    '&state=gae9',
  facebook:
    'https://www.facebook.com/dialog/oauth?response_type=code' +
    `&client_id=${FACEBOOK_CREDENTIAL.client}` +
    `&redirect_uri=${gae9ApiUri}/users/oauth/facebook` +
    '&state=gae9',
};

export const OauthWebViewContainer: () => Node = ({route, navigation}) => {
  let webviewRef = useRef();
  const [, setOauthProvider] = useRecoilState(oauthProviderState);
  const [, setOauthToken] = useRecoilState(oauthTokenState);
  const [, setToastMsg] = useRecoilState(toastMsgState);

  const handleOnMessage = ({nativeEvent: {data}}) => {
    // webview 에서 window.ReactNativeWebView.postMessage 으로 보낸 데이터 핸들링
    let resp = JSON.parse(data);
    if (resp.meta.status !== 200) {
      setToastMsg(resp.meta.message);
      navigation.navigate('Login');
    } else {
      setOauthProvider(route.params.provider);
      setOauthToken(resp.response.token);
      setToastMsg('로그인 되었습니다.');
      navigation.navigate('Home');
    }
  };

  const jsCode = `
  // 로그인 이후 옳바른 JSON 형식이 페이지에 보일 때 이를 RN 으로 보낸다. 
  setTimeout(() => {
    try {
      let jsonResp = JSON.parse(document.documentElement.innerText);
      window.ReactNativeWebView.postMessage(document.documentElement.innerText);
      window.close();
    } catch (e) {}
  }, 1000)
  true;
`;

  return (
    <WebView
      onMessage={handleOnMessage}
      ref={_ref => (webviewRef = _ref)}
      source={{uri: redirectUri[route.params.provider]}}
      javaScriptEnable={true}
      injectedJavaScript={jsCode}
    />
  );
};
