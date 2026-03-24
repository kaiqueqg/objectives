import React, { ReactNode, useEffect } from 'react';
import { StyleSheet, ImageStyle, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing
} from 'react-native-reanimated';

import { AppPalette, globalStyle as gs } from '../Colors';
import { useUserContext } from '../Contexts/UserContext';
import { Images } from '../Images';

export interface LoadingProps{
  children?: ReactNode;
  isLoading?: boolean,
  size?: number,
}

export const Loading = (props: LoadingProps) => {
  const rotation = useSharedValue(0);
  const { theme: t } = useUserContext();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }]
    };
  });

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 700,
        easing: Easing.linear
      }),-1
    )
  }, []);

  const s = StyleSheet.create({
    container: {
      // ...(gs.baseSmallImage as ImageStyle),
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      ...(gs.baseSmallImage as ImageStyle),
      tintColor: t.inprogressicontint,
    },
  });

  return (
    props.isLoading || !props.children?
    <View style={s.container}>
      <Animated.Image
        source={Images.Refresh}
        style={[s.image, animatedStyle]}
      />
    </View>
    :
    <>
      {props.children}
    </>
  );
};