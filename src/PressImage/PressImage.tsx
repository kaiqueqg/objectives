import React, { useEffect, useState } from "react";
import { Image, ImageStyle, ImageSourcePropType, View, Vibration, StyleSheet, Text, Pressable } from "react-native";
import { useUserContext } from "../Contexts/UserContext";
import { Pattern } from "../Types";
import { useLogContext } from "../Contexts/LogContext";
import { colorPalette } from "../Colors";

export interface PressImageProps{
  style: any,
  source: ImageSourcePropType,
  pressStyle?: any,
  onPress?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
  onLongPress?: () => void,
  delayLongPress?: number,

  hide?: boolean,
  disable?: boolean,
  disableStyle?: any,
  confirm?: boolean,
  confirmStyle?: any,
  text?: string,
  textStyle?: any,
}

const PressImage = (props: PressImageProps) => {
  const {userPrefs} = useUserContext();
  const {log} = useLogContext();
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [wasLongPressed, setWasLongPressed] = useState(false);

  const [text, setText] = useState<number>(2000);

  const handleLongPress = () => {
    setWasLongPressed(true);
    props.onLongPress?.();
  };

  const getHideImage = () => {
    return(
      <Pressable style={props.pressStyle} onPressOut={()=>{}} onPressIn={()=>{}} onLongPress={()=>{}}>
        <View style={(props.confirmStyle?props.confirmStyle:props.style) as ImageStyle}></View>
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
        if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
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
    }
  }

  const getNormalImage = () => {
    return(
      <Pressable 
        style={[props.pressStyle]}
        onPressOut={normalTouchEnd}
        onPressIn={props.onPressIn}
        onLongPress={handleLongPress}
        delayLongPress={props.delayLongPress??800}>
        <Image style={[props.style as ImageStyle, props.disable? (props.disableStyle as ImageStyle):{}]} source={props.source}></Image>
        {props.text && <Text style={props.textStyle?? s.text}>{props.text}</Text>}
      </Pressable>
    )
  }

  const getConfirmingImage = () => {
    return(
      <Pressable style={props.pressStyle} onPressOut={props.onPress} onPressIn={props.onPressIn} onLongPress={handleLongPress} delayLongPress={props.delayLongPress??800}>
        <Image style={[(props.confirmStyle??props.style as ImageStyle)]} source={require('../../public/images/done.png')}></Image>
      </Pressable>
    )
  }

  const confirm = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    setIsConfirming(true);

    setTimeout(()=>{
      setIsConfirming(false);
    }, 2000);
  }

  
  const s = StyleSheet.create({
    text: {
      position: 'absolute',
      color: colorPalette.blue,
      fontSize: 12,
      fontWeight: 'bold',
    },
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