import FastImage from 'react-native-fast-image';
import {stringColor} from '../../utils/stringColor';
import React from 'react';
import styled from 'styled-components';
import {StyleSheet} from 'react-native';

export const UserCircle: () => Node = ({username}) => {
  return (
    <ProfileImageView>
      <FastImage
        style={[
          styles.profileImage,
          {
            backgroundColor: '#' + stringColor(username),
          },
        ]}
      />
      <ProfileImageText>{username.slice(0, 5)}</ProfileImageText>
    </ProfileImageView>
  );
};

const ProfileImageView = styled.View`
  margin-top: 8;
  margin-bottom: 8;
  margin-right: 10;
  width: 44;
  height: 44;
  text-align: center;
  justify-content: center;
  align-items: center;
`;

const ProfileImageText = styled.Text`
  color: #fff;
  height: 20;
`;

const styles = StyleSheet.create({
  profileImage: {
    position: 'absolute',
    borderRadius: 100,
    width: '100%',
    height: '100%',
  },
});
