import React, { useEffect, useRef } from 'react';
import { StyleSheet, ImageStyle, Animated, Easing, View } from 'react-native';
import { AppPalette } from '../Colors';
import { useUserContext } from '../Contexts/UserContext';

interface Props {
  theme: AppPalette;
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

  const s = (theme: AppPalette) => StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
    },
    image: {
      width: 25,
      height: 25,
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
