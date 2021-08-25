import React, {useState, useEffect, useRef} from 'react';
import {WebView} from 'react-native-webview';
import {
  oauthProviderState,
  oauthTokenState,
  toastMsgState,
  myState,
  profileState,
} from '../../utils/state';
import {useRecoilState} from 'recoil/native/recoil';
import {http} from '../../utils/http';
import {promiseGetRecoil, promiseSetRecoil} from 'recoil-outside';

import {
  NAVER_CREDENTIAL,
  KAKAO_CREDENTIAL,
  FACEBOOK_CREDENTIAL,
} from '../../constants';
import {View} from 'react-native';

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
  const [, setMyState] = useRecoilState(myState);
  const [, setProfile] = useRecoilState(profileState);
  const [visible, setVisible] = useState(true);
  const [targetUri, setTargetUri] = useState('');

  useEffect(() => {
    setTargetUri(redirectUri[route.params.provider]);
    setVisible(true);
  }, [route]);

  /**
   * webview 에서 window.ReactNativeWebView.postMessage 으로 보낸 데이터 핸들링
   * @param data
   */
  const handleOnMessage = async ({nativeEvent: {data}}) => {
    setVisible(false);

    let resp = JSON.parse(data);
    if (resp.meta.status !== 200) {
      setToastMsg(resp.meta.message);
      navigation.navigate('Login');
    } else {
      setOauthProvider(route.params.provider);

      // axios interceptor 에서 사용하기 위해 promiseSetRecoil 사용
      await promiseSetRecoil(oauthTokenState, resp.response.token);
      const v = await promiseGetRecoil(oauthTokenState);
      console.log(v);
      onLogin();

      setToastMsg('로그인 되었습니다.');
      navigation.navigate('Home');
    }
  };

  /**
   * 내 정보 요청 후 저장
   * @returns {Promise<void>}
   */
  const onLogin = async () => {
    let res = await http.me();
    setMyState(res.data.response.setting);

    let res2 = await http.getProfile();
    setProfile(res2.data.response.user);
  };

  const jsCode = `
  // 로그인 이후 옳바른 JSON 형식이 페이지에 보일 때 이를 RN 으로 보낸다. 
  setTimeout(() => {
    try {
      let jsonResp = JSON.parse(document.documentElement.innerText);
      window.ReactNativeWebView.postMessage(document.documentElement.innerText);
      window.location.href="";
    } catch (e) {}
  }, 300)
  true;
`;

  return (
    <View>
      {visible && (
        <WebView
          onMessage={handleOnMessage}
          ref={_ref => (webviewRef = _ref)}
          source={{uri: targetUri}}
          javaScriptEnable={true}
          injectedJavaScript={jsCode}
        />
      )}
    </View>
  );
};
