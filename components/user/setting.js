import React, {Node} from 'react';
import {Text, View} from 'react-native';

export const SettingContainer: () => Node = () => {
  return (
    <View style={{alignItems: 'center', justifyContent: 'center', height: '100%'}}>
      <Text>Setting View</Text>
    </View>
  );
};
