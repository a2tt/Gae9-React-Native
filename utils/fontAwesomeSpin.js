import React, {useEffect, useRef} from 'react';
import {Animated, Easing, Text} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

export const FontAwesomeSpin: () => Node = props => {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const spin = () => {
    rotateValue.setValue(0);
    Animated.timing(rotateValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => spin());
  };

  useEffect(() => {
    spin();
  }, []);

  return (
    <Animated.View style={{transform: [{rotate}]}}>
      <FontAwesomeIcon style={props.style} icon={props.icon} />
    </Animated.View>
  );
};
