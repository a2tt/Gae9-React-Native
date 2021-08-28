import React from 'react';
import {Home} from '../Home';
import {TrendDetail, TrendDetailNavHeader} from '../trend/TrendDetail';
import {ReplyCommentWrite} from '../comment/CommentWrite';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

export const StackNavigator: () => Node = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{title: 'Gae9', headerShown: false}}/>
      <Stack.Screen
        name="TrendDetail"
        component={TrendDetail}
        options={{
          title: '', // name 값으로 초기 세팅 되는 것 방지
          headerTitle: props => <TrendDetailNavHeader {...props}/>
        }}
      />
      <Stack.Screen name="WriteReplyComment" component={ReplyCommentWrite} options={{title: ''}}/>
    </Stack.Navigator>
  );
};
