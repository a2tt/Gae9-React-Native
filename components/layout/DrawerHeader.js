import {useRecoilState} from 'recoil/native/recoil';
import {myState, profileState} from '../../utils/atom';
import React, {useEffect} from 'react';
import {UserCircle} from '../user/UserCircle';
import {intComma} from '../../utils/intComma';
import styled from 'styled-components';

export const LoginedHeader: () => Node = props => {
  const [my] = useRecoilState(myState);
  const [profile] = useRecoilState(profileState);

  return (
    <LoginedView>
      <LoginedUserView>
        <UserCircle username={profile?.username || ''}/>
        <UserText>{profile?.username || ''}</UserText>
      </LoginedUserView>
      <PointText>{intComma(profile?.point || 0)} Point</PointText>
    </LoginedView>
  );
};

const LoginedView = styled.View`
  padding-top: 20;
  padding-bottom: 20;
  padding-right: 20;
  padding-left: 20;
  background-color: #3d3d3d;
`;

const LoginedUserView = styled.View`
  flex-direction: row;
  align-items: center;
`;

const UserText = styled.Text`
  color: white;
`;

const PointText = styled.Text`
  color: #ccc;
`;
