import React, { useEffect, useState } from "react";
import { Image, ImageStyle, ImageSourcePropType, View, Vibration, StyleSheet, Text, Pressable } from "react-native";
import { useUserContext } from "../Contexts/UserContext";
import { Pattern } from "../Types";
import { useLogContext } from "../Contexts/LogContext";
import { colorPalette, GeneralPalette, globalStyle as gs, ObjectivePallete } from "../Colors";
import { Images } from "../Images";

export interface PressImageProps{
  source: ImageSourcePropType,
  cT?: GeneralPalette,
  raw?: boolean,
  color?: string,

  onPress?: () => void,
  onPressIn?: () => void,
  onPressOut?: () => void,
  onLongPress?: () => void,
  delayLongPress?: number,

  hide?: boolean,
  disable?: boolean,
  confirm?: boolean,
  selected?: boolean,
  fade?: boolean,
  
  text?: string,

  size?: number,
}

const PressImage = (props: PressImageProps) => {
  const {userPrefs, theme: t} = useUserContext();
  const {log} = useLogContext();
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [wasLongPressed, setWasLongPressed] = useState(false);

  const [text, setText] = useState<number>(2000);

  const finalTintColor = (() => {
    if(props.raw) return undefined;

    if(props.cT){
      if(props.disable) return props.cT.icontintfade;

      if(props.fade) return props.cT.icontintfade;

      if(props.selected) return props.cT.icontintselected;
      
      if(props.color) return props.color;
      return props.cT.icontint;
    }
    
    if(props.disable) return t.icontintfade;
    
    if(props.fade) return t.icontintfade;
    
    if(props.selected) return t.icontintselected;
    
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
    }
  }

  const getNormalImage = () => {
    return(
      <Pressable 
        // style={[s.container, props.pressStyle, props.selected? props.selectedStyle:{}]}
        style={[s.container]}
        onPressOut={normalTouchEnd}
        onPressIn={props.onPressIn}
        onLongPress={handleLongPress}
        delayLongPress={props.delayLongPress??800}>
        {/* <View style={[s.shadow]}/> */}
        {/* <View style={[s.border2]}/> */}
        <Image style={[s.image, {tintColor: finalTintColor} as ImageStyle, finalSize]} source={props.source}></Image>
        {/* <Image style={[props.style as ImageStyle, props.disable? (props.disableStyle as ImageStyle):{}, s.image]} source={props.source}></Image> */}
        {props.text && <Text style={[s.text]}>{props.text}</Text>}
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
      color: props.cT?.textColor?props.cT.textColor:colorPalette.red,
      fontSize: 16,
      fontWeight: 'bold',
    },

    shadow: {
      position: "absolute",
      left: 4,
      top: 4,

      width: 40,
      height: 40,
      backgroundColor: 'black',

      borderColor: '#00000000',
      borderWidth: 1,
      borderRadius: 25,
      borderStyle: 'solid',
    },
    border2: {
      position: "absolute",

      width: 40,
      height: 40,
      backgroundColor: t.backgroundcolor,

      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 25,
      borderStyle: 'solid',
    },
    image:{
      ...gs.baseSmallImage,
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