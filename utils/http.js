import {ToastAndroid} from 'react-native';

const axios = require('axios').default;
import qs from 'qs';
import constants from '../constants';
import {oauthTokenState} from './state';
import {promiseGetRecoil, promiseSetRecoil} from 'recoil-outside';

const instance = axios.create();

instance.interceptors.request.use(
  async function (config) {
    // const oauthToken = useRecoilValue(oauthTokenState);
    const oauthToken = await promiseGetRecoil(oauthTokenState);
    config.headers.Authorization = `Bearer ${oauthToken}`;
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  function (res) {
    if (res.data?.meta?.status >= 400) {
      ToastAndroid.show(res.data?.meta.message, ToastAndroid.LONG);
    }
    return res;
  },
  function (e) {
    return Promise.reject(e);
  },
);

class Http {
  getAD() {
    return instance.get(`${constants.API_URL}/ad`);
  }

  getTrend(cid) {
    return instance.get(`${constants.API_URL}/trend/${cid}`);
  }

  getTrends(maxId = 0, perPage = 40) {
    return instance.get(`${constants.API_URL}/trend/new`, {
      params: {
        max_id: maxId,
        per_page: perPage,
      },
    });
  }

  getMiniTrends(maxId = 0, perPage = 40) {
    return instance.get(`${constants.API_URL}/trend/mini`, {
      params: {
        max_id: maxId,
        per_page: perPage,
      },
    });
  }

  getHottestTrends() {
    return instance.get(`${constants.API_URL}/trend/hottest`);
  }

  getHotTrends() {
    return instance.get(`${constants.API_URL}/trend`);
  }

  getNsfwTrends() {
    return instance.get(`${constants.API_URL}/v2/trend/nsfw`);
  }

  getDailyTrends(dateStr) {
    return instance.get(`${constants.API_URL}/trend/${dateStr}`);
  }

  getWeekTrends(weekStr) {
    return instance.get(`${constants.API_URL}/trend/${weekStr}`);
  }

  getComments(cid) {
    return instance.get(`${constants.API_URL}/trend/${cid}/comments`);
  }

  createComment(cid, content, parentCommentId = null) {
    return instance.put(`${constants.API_URL}/trend/${cid}/comment`,
      qs.stringify({
        content: content,
        parent_comment_id: parentCommentId,
      }),
    );
  }

  reportComment(commentId) {
    return instance.post(`${constants.API_URL}/comment/${commentId}/report`);
  }

  signUp(email, username, password, passwordConfirm, recapchaResponse) {
    return instance.post(`${constants.API_URL}/users/sign_up`,
      qs.stringify({
        'email': email,
        'username': username,
        'password': password,
        'password-again': passwordConfirm,
        'g_recapcha_response': recapchaResponse,
      }));
  }

  login({email, password}) {
    return instance.post(`${constants.API_URL}/users/login`,
      qs.stringify({
        email: email,
        password: password,
      }));
  }

  getProfile() {
    return instance.get(`${constants.API_URL}/users/profile`);
  }

  updateProfile(user) {
    return instance.post(`${constants.API_URL}/users/profile/update`,
      qs.stringify({
        username: user.name,
        accept_marketing: user.accept_marketing,
      }));
  }

  oauthLogin(code, state, provider) {
    return instance.get(`${constants.API_URL}/users/oauth/${provider}`, {
      params: {
        code: code,
        state: state,
        provider: provider,
      },
    });
  }

  userAction(params) {
    return instance.post(`${constants.API_URL}/users/actions`,
      qs.stringify(params),
    );
  }

  consumePoint(params) {
    return instance.post(`${constants.API_URL}/users/point/consume`,
      qs.stringify(params),
    );
  }

  userComments(page = 1, n = 30) {
    return instance.get(`${constants.API_URL}/users/comments`, {
      params: {
        page,
        n,
      },
    });
  }

  me() {
    return instance.get(`${constants.API_URL}/me`);
  }

  trendUserAction(cid, params) {
    return instance.post(`${constants.API_URL}/trend/${cid}/action`,
      qs.stringify(params),
    );
  }

  getMyTrendAction(cid, params) {
    return instance.get(`${constants.API_URL}/trend/${cid}/action`, {
      params: params,
    });
  }
}

export const http = new Http();
