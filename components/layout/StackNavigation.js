import React from 'react';
import {Home} from '../Home';
import {TrendDetail} from '../trend/TrendDetail';
import {ReplyCommentWrite} from '../comment/CommentWrite';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export const StackNavigator: () => Node = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{title: 'Gae9', headerShown: false}}/>
      <Stack.Screen name="TrendDetail" component={TrendDetail} options={{title: ''}}/>
      <Stack.Screen name="WriteReplyComment" component={ReplyCommentWrite} options={{title: ''}}/>
    </Stack.Navigator>
  );
};
