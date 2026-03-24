import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  withSequence,
} from 'react-native-reanimated';
import { scheduleOnRN } from "react-native-worklets";

interface ShakeWrapperProps {
  children: React.ReactNode;
  onShakeComplete: () => void;
}

export const ShakeWrapper = (props: ShakeWrapperProps) => {
  const rotation = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }]
    };
  });
  
  useEffect(() => {
    const angle = 30;
    const time = 100;
    rotation.value = withRepeat(withSequence(
      withTiming(angle, {duration: time, easing: Easing.linear}),
      withTiming(-angle, {duration: time*2, easing: Easing.linear}),
      withTiming(0, {duration: time, easing: Easing.linear})),
      5,
      false,
      () => {
        scheduleOnRN(props.onShakeComplete);
      }
    )
  }, [])

  return (
    <Animated.View style={[animatedStyle]}>
      {props.children}
    </Animated.View>
  );
};