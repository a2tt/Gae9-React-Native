import React from 'react';
import {
  atom,
} from 'recoil';

export const commentWrittenState = atom({
  key: 'commentWritten',
  default: 0, // written timestamp
});
