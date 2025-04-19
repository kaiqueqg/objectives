import React, { useEffect, useRef } from 'react';
import { StyleSheet, ImageStyle, Animated, Easing, View } from 'react-native';
import { ThemePalette } from '../Colors';
import { useUserContext } from '../Contexts/UserContext';

interface Props {
  theme: ThemePalette;
  // style?: ImageStyle;
}

const Loading: React.FC<Props> = () => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  const { theme } = useUserContext();

  useEffect(() => {
    // Start the rotation animation when the component mounts
    const startRotation = () => {
      Animated.loop(
        Animated.timing(rotateValue, {
          toValue: 1,
          duration: 700, // 0.7 seconds per rotation
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    };

    startRotation();

    // Clean up the animation when the component unmounts
    return () => rotateValue.stopAnimation();
  }, [rotateValue]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const s = (theme: ThemePalette) => StyleSheet.create({
    container: {
      width: 30,
      height: 30,
      margin: 10,
    },
    image: {
      flex: 1,
      width: 30,
      height: 30,
      tintColor: theme.inprogressicontint,
    },
  });

  return (
    <View style={s(theme).container}>
      <Animated.Image
        style={[
          s(theme).image,
          { transform: [{ rotate }] },
        ]}
        source={require('../../public/images/refresh.png')}
      />
    </View>
  );
};



export default Loading;
