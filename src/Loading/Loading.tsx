import React, { useEffect, useRef } from 'react';
import { StyleSheet, ImageStyle, Animated, Easing, View, Image } from 'react-native';
import { AppPalette, globalStyle as gs } from '../Colors';
import { useUserContext } from '../Contexts/UserContext';

interface LoadingProps {
}

const Loading = (props: LoadingProps) => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  const { theme: t } = useUserContext();

  useEffect(() => {
    
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
    return () => {
      rotateValue.stopAnimation();
    }
  }, [rotateValue]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const s = StyleSheet.create({
    container: {
      height: 40,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      ...(gs.baseSmallImage as ImageStyle),
      tintColor: t.inprogressicontint,
    },
    imageSmall: {
      ...(gs.baseSmallImage as ImageStyle),
      tintColor: t.inprogressicontint,
    },
  });

  return (
    <View style={[s.container]}>
      <Animated.Image
        style={[
          s.image,
          { transform: [{ rotate }] },
        ]}
        source={require('../../public/images/refresh.png')}
      />
    </View>
  );
};



export default Loading;
