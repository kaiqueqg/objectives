import React, { useState } from "react";
import { Image, ImageStyle, ImageSourcePropType, View, Vibration, Text } from "react-native";
import { useUserContext } from "../Contexts/UserContext";
import { Pattern } from "../Types";

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
}

const PressImage = (props: PressImageProps) => {
  const {userPrefs} = useUserContext();
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const [text, setText] = useState<number>(2000);

  const getHideImage = () => {
    return(
      <View style={props.pressStyle} onTouchEnd={()=>{}} onTouchStart={()=>{}}>
        <View style={props.style as ImageStyle}></View>
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
        style={props.pressStyle}
        onTouchEnd={normalTouchEnd}
        onTouchStart={props.onPressIn}>
        <Image style={[props.style as ImageStyle, props.disable? (props.disableStyle as ImageStyle):{}]} source={props.source}></Image>
      </View>
    )
  }

  const getConfirmingImage = () => {
    return(
      <View style={props.pressStyle} onTouchEnd={props.onPress} onTouchStart={props.onPressIn}>
        <Image style={[(props.style as ImageStyle)]} source={require('../../public/images/done.png')}></Image>
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