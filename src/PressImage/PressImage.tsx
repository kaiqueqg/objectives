import React, { useEffect, useState } from "react";
import { Image, ImageStyle, ImageSourcePropType, View, Vibration, StyleSheet, Text } from "react-native";
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

  const [text, setText] = useState<number>(2000);

  const getHideImage = () => {
    return(
      <View style={props.pressStyle} onTouchEnd={()=>{}} onTouchStart={()=>{}}>
        <View style={(props.confirmStyle?props.confirmStyle:props.style) as ImageStyle}></View>
      </View>
    )
  }

  const normalTouchEnd = () => {
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
      <View 
        style={[props.pressStyle]}
        onTouchEnd={normalTouchEnd}
        onTouchStart={props.onPressIn}>
        <Image style={[props.style as ImageStyle, props.disable? (props.disableStyle as ImageStyle):{}]} source={props.source}></Image>
        {props.text && <Text style={props.textStyle?? s.text}>{props.text}</Text>}
      </View>
    )
  }

  const getConfirmingImage = () => {
    return(
      <View style={props.pressStyle} onTouchEnd={props.onPress} onTouchStart={props.onPressIn}>
        <Image style={[(props.confirmStyle??props.style as ImageStyle)]} source={require('../../public/images/done.png')}></Image>
      </View>
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