import 'react-native-gesture-handler';
import React, {useState} from 'react';
import type {Node} from 'react';
import {
  View,
  Keyboard,
} from 'react-native';
import styled from 'styled-components/native';
import {http} from '../../utils/http';
import {faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {commentWrittenState} from '../../utils/state';
import {useRecoilState} from 'recoil/native/recoil';
import {Comment} from './Comment';

/**
 * 대댓글 작성 페이지
 * */
export const ReplyCommentWrite: () => Node = ({}) => {
  return (
    <View>
      <Comment comment={{}}/>
    </View>
  );
};

export const CommentWrite: () => Node = ({trendCid}) => {
  const [, setCommentWritten] = useRecoilState(commentWrittenState);
  const [text, setText] = useState('');

  const writeComment = () => {
    console.log(text);
    http
      .createComment(trendCid, text)
      .then(res => {
        Keyboard.dismiss();
        setText('');
        setCommentWritten(Date.now());
      })
      .catch(e => {
        console.error(e);
      });
  };

  return (
    <CommentWriteView>
      <CommentInput
        defaultValue={text}
        onChangeText={_text => setText(_text)}
        placeholder="댓글을 작성해보세요."
      />
      <SendBtnTouchable onPress={() => writeComment()}>
        <FontAwesomeIcon
          icon={faPaperPlane}
          size={20}
        />
      </SendBtnTouchable>
    </CommentWriteView>
  );
};


const CommentWriteView = styled.View`
  background-color: #fff;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-top-width: 1px;
  border-color: #efefef;
`;

const CommentInput = styled.TextInput`
  flex: 1;
  margin-top: 4;
  margin-bottom: 4;
  margin-right: 6;
  margin-left: 6;
  padding-right: 10;
  padding-left: 10;
  height: 40;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 10;
  background-color: #efefef;
`;

const SendBtnTouchable = styled.TouchableOpacity`
  padding-top: 4;
  padding-bottom: 4;
  padding-right: 8;
  padding-left: 4;
`;
