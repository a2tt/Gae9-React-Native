import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import type {Node} from 'react';
import {
  View,
  Keyboard,
  Text,
  TextInput,
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
export const ReplyCommentWrite: () => Node = ({route, navigation}) => {
  const comment = route.params.comment;
  const trendCid = route.params.trendCid;

  useEffect(() => {
    navigation.setOptions({title: '댓글 작성'});
  }, []);

  return (
    <View style={{backgroundColor: 'white'}}>
      <Comment comment={comment}/>
      <CommentWrite
        trendCid={trendCid}
        parentId={comment.id}
        cb={() => navigation.goBack()}
      />
    </View>
  );
};

/**
 * 디테일뷰 하단 댓글 작성 컴포넌트
 * */
export const CommentWrite: () => Node = ({trendCid, parentId = null, cb = null}) => {
  const multiline = !!parentId;
  const [, setCommentWritten] = useRecoilState(commentWrittenState);
  const [text, setText] = useState('');

  const writeComment = () => {
    console.log(text);
    http
      .createComment(trendCid, text, parentId)
      .then(res => {
        Keyboard.dismiss();
        setText('');
        setCommentWritten(Date.now());
        if (cb) {
          cb();
        }
      })
      .catch(e => {
        console.error(e);
      });
  };

  return (
    <CommentWriteView>
      <CommentInput
        multiline={multiline}
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
  height: ${props => (props.multiline ? 'auto' : 40)};
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
