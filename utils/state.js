import {atom} from 'recoil';
import {AsyncStorage} from 'react-native';
import {recoilPersist} from './recoilPersist';

const {persistAtom} = recoilPersist({
  storage: AsyncStorage,
});

export const toastMsgState = atom({
  key: 'toastMsg',
  default: '', // written timestamp
});

export const commentWrittenState = atom({
  key: 'commentWritten',
  default: 0, // written timestamp
});

export const trendState = atom({
  key: 'trendState',
  default: {
    id: '', // cid
    title: '',
    trend_num: 0,
    view_cnt: 0,
    sites: [],
    posts: [],
    scraped: false,
    images: [],
  },
});

export const trendLikeState = atom({
  key: 'trendlikeState',
  default: {
    good_cnt: 0,
    bad_cnt: 0,
  },
});

export const myTrendLikeState = atom({
  key: 'myTrendlikeState',
  default: {
    good_cnt: 0,
    bad_cnt: 0,
  },
});

export const oauthProviderState = atom({
  key: 'oauthProvider',
  default: '',
  effects_UNSTABLE: [persistAtom],
});

export const oauthTokenState = atom({
  key: 'oauthToken',
  default: '',
  effects_UNSTABLE: [persistAtom],
});

export const myState = atom({
  key: 'myState',
  default: {
    user_id: null,
  },
});

export const profileState = atom({
  key: 'profile',
  default: {
    username: '',
    id: '',
    email: '',
    auth_type: '',
  },
});
