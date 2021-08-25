import {atom} from 'recoil';

export const toastMsgState = atom({
  key: 'toastMsg',
  default: '', // written timestamp
});

export const commentWrittenState = atom({
  key: 'commentWritten',
  default: 0, // written timestamp
});

export const oauthProviderState = atom({
  key: 'oauthProvider',
  default: '',
});

export const oauthTokenState = atom({
  key: 'oauthToken',
  default: '',
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
