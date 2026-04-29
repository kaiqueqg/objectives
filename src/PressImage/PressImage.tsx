import React, { useEffect, useState } from "react";
import { Image, ImageStyle, ImageSourcePropType, View, Vibration, StyleSheet, Text, Pressable } from "react-native";
import { useUserContext } from "../Contexts/UserContext";
import { MessageType, Pattern } from "../Types";
import { useLogContext } from "../Contexts/LogContext";

import { globalStyle as gs, ObjectivePallete } from "../Colors";
import { Images } from "../Images";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
  withSequence
} from 'react-native-reanimated';
import { cp } from "../ColorPalette";
import { Loading } from "../Loading/Loading";

export interface PressImageProps{
  source: ImageSourcePropType,
  cT?: ObjectivePallete,
  raw?: boolean,
  color?: string,

  onPress?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
  onLongPress?: () => void,
  delayLongPress?: number,

  disable?: boolean,
  disableMsg?: string,
  onPressDisabled?: () => void,
  
  hide?: boolean,
  confirm?: boolean,
  isSelected?: boolean,
  fade?: boolean,
  
  text?: string,

  size?: number,
  showLock?: boolean,

  isLoading?: boolean,
}

const PressImage = (props: PressImageProps) => {
  const {userPrefs, theme: t} = useUserContext();
  const {log, popMessage} = useLogContext();
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [wasLongPressed, setWasLongPressed] = useState(false);

  const [text, setText] = useState<number>(2000);

  const finalTintColor = (() => {
    if(props.raw) return undefined;

    if(props.cT){
      if(props.disable) return props.cT.icontintfade;

      if(props.fade) return props.cT.icontintfade;

      if(props.isSelected) return props.cT.icontintselected;
      
      if(props.color) return props.color;
      return props.cT.icontint;
    }
    
    if(props.disable) return t.icontintfade;
    
    if(props.fade) return t.icontintfade;
    
    if(props.isSelected) return t.icontintselected;
    
    if(props.color) return props.color;
    return t.icontint;
  })();

  const finalSize = (() => {
    if(props.size && typeof gs.baseSmallImage.width === 'number'){
      return {...gs.baseSmallImage, width: gs.baseSmallImage.width + props.size, height: gs.baseSmallImage.width + props.size} as ImageStyle;
    }
    else return gs.baseSmallImage;
  })();

  const handleLongPress = () => {
    setWasLongPressed(true);
    props.onLongPress?.();
  };

  const getHideImage = () => {
    return(
      <Pressable style={s.container} onPressOut={()=>{}} onPressIn={()=>{}} onLongPress={()=>{}}>
        <View style={s.image}></View>
      </Pressable>
    )
  }

  const normalTouchEnd = () => {
    if (wasLongPressed) {
      setWasLongPressed(false);
      return;
    }

    if(!props.disable) {
      if(props.confirm){
        setText(2000);
        confirm();
      }
      else if(props.onPress){
        if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

        props.onPress();
      }
    }
    else{
      if(userPrefs.vibrate) Vibration.vibrate(Pattern.Wrong);
      if(props.disableMsg) popMessage(props.disableMsg, MessageType.Alert);
      if(props.onPressDisabled) props.onPressDisabled();
    }
  }

  const getDisplayImage = () => {
    return(
      <Loading isLoading={props.isLoading}>
        {props.showLock &&<Image style={[s.lockImage as ImageStyle, finalSize]} source={Images.Lock}></Image>}
        <Animated.Image style={[s.image, {tintColor: finalTintColor} as ImageStyle, finalSize]} source={props.source}/>
        {/* <Image style={[props.style as ImageStyle, props.disable? (props.disableStyle as ImageStyle):{}, s.image]} source={props.source}></Image> */}
        {props.text && <Text style={[s.text]}>{props.text}</Text>}
      </Loading>
    )
  }

  const getNormalImage = () => {
    return(
      <Pressable 
        style={[s.container]}
        onPressOut={normalTouchEnd}
        onPressIn={props.onPressIn}
        onLongPress={handleLongPress}
        delayLongPress={props.delayLongPress??800}>
        {props.isSelected?
          <View style={s.out}>
            <View style={s.in}>
              {getDisplayImage()}
            </View>
          </View>
          :
          getDisplayImage()
        }
      </Pressable>
    )
  }

  const onPressAfterConfirmed = () => {
    setIsConfirming(false);
    if(props.onPress) {
      if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

      props.onPress();
    }
  }

  const getConfirmingImage = () => {
    return(
      <Pressable style={s.container} onPressOut={onPressAfterConfirmed} onPressIn={props.onPressIn} onLongPress={handleLongPress} delayLongPress={props.delayLongPress??800}>
        <Image style={[s.image as ImageStyle, {tintColor: props.cT?props.cT.doneicontint:t.doneicontint}]} source={Images.Done}></Image>
      </Pressable>
    )
  }

  const confirm = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Short);
    setIsConfirming(true);

    setTimeout(()=>{
      setIsConfirming(false);
    }, 2000);
  }

  const s = StyleSheet.create({
    container:{
      ...gs.baseImageContainer,
    },
    text: {
      position: 'absolute',
      zIndex: 1,
      fontSize: 10,
      color: props.cT?.textcolor?props.cT.textcolor:cp.red,
      fontWeight: 'bold',
    },
    out:{
      borderColor: t.bordercolorselected,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      // borderLeftWidth: 2,
      // borderTopWidth: 2,
      borderRadius: 8,
      borderStyle: 'solid',
    },
    in:{
      padding: 4,
      justifyContent: 'center',
      alignItems: 'center',
      verticalAlign: 'middle',

      backgroundColor: cp.darky,

      borderColor: t.bordercolorselected,
      borderWidth: 1,
      borderRadius: 7,
      borderStyle: 'solid',
    },
    image:{
      ...gs.baseSmallImage,
    },
    lockImage:{
      height: 5,
      width: 5,
      zIndex: 1,
      position: "absolute",
    }
  });

  return(
    props.hide ?
      getHideImage()
    :
    (props.confirm?
    (
      (isConfirming?
        getConfirmingImage()
        :
        getNormalImage()
      )
    )
    :
    getNormalImage()
    )
    
  )
}

export default PressImage