import React, { ReactNode, useEffect, useState } from "react";
import { Image, ImageStyle, ImageSourcePropType, View, ViewProps, Vibration, StyleSheet, Text, Pressable } from "react-native";
import { useUserContext } from "../Contexts/UserContext";
import { Pattern } from "../Types";
import { useLogContext } from "../Contexts/LogContext";
import { ObjectivePallete } from "../Colors";
import { clamp } from "../Helper";

export interface ButtonProps extends ViewProps {
  cT?: ObjectivePallete,
  
  text?: string,
  onPress?: () => void,
  imageSource?: ImageSourcePropType,

  isLoading?: boolean,
  isSelected?: boolean,

  type?: 'foward'|'backward'|'neutral'|'reset'|'positive',
  size?: number,

  vibrate?: boolean,
}

const ButtonView = (props: ButtonProps) => {
  const {theme: t, user } = useUserContext();
  const { popMessage } = useLogContext();

  const index = 1;
  let vertical = clamp(props.size, 10, 50);
  let horizontal = clamp(props.size, 15, 50);
  let f = clamp(props.size, 15, 50);

  const getBkColor = () => {
    if(props.type){
      if(props.type === 'foward') return t.fowardbk;
      if(props.type === 'backward') return t.backwardbk;
      if(props.type === 'neutral') return t.neutralbk;
      if(props.type === 'reset') return t.resetbk;
      if(props.type === 'positive') return t.positivebk;
    }

    return t.backgroundcolordarker;
  }

  const getColor = () => {
    if(props.type){
      if(props.type === 'foward') return t.fowardtext;
      if(props.type === 'backward') return t.backwardtext;
      if(props.type === 'neutral') return t.neutraltext;
      if(props.type === 'reset') return t.resettext;
      if(props.type === 'positive') return t.positivetext;
    }

    return t.textcolor;
  }
  
  const s = StyleSheet.create({
    press:{
      // minHeight: props.size?props.size+40:40,
      // minWidth: props.size?props.size+40:40,
      margin: 5,
    },
    out:{
      borderColor: 'black',
      borderRightWidth: 3,
      borderBottomWidth: 3,
      borderRadius: 8,
      borderStyle: 'solid',
    },
    in:{
      justifyContent: 'center',
      alignItems: 'center',
      verticalAlign: 'middle',
      backgroundColor: getBkColor(),

      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
    },
    text:{
      justifyContent: 'center',
      alignItems: 'center',
      verticalAlign: 'middle',
      fontWeight: 'bold',
      fontSize: f,

      marginVertical: vertical,
      marginHorizontal: horizontal,

      color: getColor(),
    },
  });

  const btnOnPress = () => {
    // if(user.userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    if(props.onPress){
      props.onPress();
    }
    else{
      // popMessage('Click');
    }
  }

  return(

    <Pressable style={s.press} onPress={btnOnPress}>
      <View style={s.out}>
        <View style={s.in}>
          <Text style={s.text}>
            {props.text?props.text.trim():''}
          </Text>
        </View>
      </View>
    </Pressable>
  )   
}

export default ButtonView