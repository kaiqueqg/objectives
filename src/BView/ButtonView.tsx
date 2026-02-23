import React, { ReactNode, useEffect, useState } from "react";
import { Image, ImageStyle, ImageSourcePropType, View, ViewProps, Vibration, StyleSheet, Text, Pressable } from "react-native";
import { useUserContext } from "../Contexts/UserContext";
import { Pattern } from "../Types";
import { useLogContext } from "../Contexts/LogContext";
import { GeneralPalette } from "../Colors";

export interface ButtonProps extends ViewProps {
  cT?: GeneralPalette,
  
  text?: string,
  onPress?: () => void,
  imageSource?: ImageSourcePropType,

  isLoading?: boolean,

  type?: 'foward'|'backward'|'neutral'|'reset',
  size?: number,

  vibrate?: boolean,
}

const ButtonView = (props: ButtonProps) => {
  const {theme: t } = useUserContext();
  const { popMessage } = useLogContext();

  const getBkColor = () => {
    if(props.type){
      if(props.type === 'foward') return t.fowardbk;
      if(props.type === 'backward') return t.backwardbk;
      if(props.type === 'neutral') return t.neutralbk;
      if(props.type === 'reset') return t.resetbk;
    }

    return t.backgroundcolordarker;
  }

  const getColor = () => {
    if(props.type){
      if(props.type === 'foward') return t.fowardtext;
      if(props.type === 'backward') return t.backwardtext;
      if(props.type === 'neutral') return t.neutraltext;
      if(props.type === 'reset') return t.resettext;
    }

    return t.textcolor;
  }

  const s = StyleSheet.create({
    press:{
      minHeight: 40,
      minWidth: 40,
      margin: 5,
    },
    out:{
      borderColor: 'black',
      borderRightWidth: 2,
      borderBottomWidth: 2,
      borderRadius: 8,
      borderStyle: 'solid',
    },
    in:{
      justifyContent: 'center',
      alignItems: 'center',
      verticalAlign: 'middle',
      backgroundColor: getBkColor(),

      borderColor: t.bordercolorlight,
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
    },
    text:{
      justifyContent: 'center',
      alignItems: 'center',
      verticalAlign: 'middle',
      fontWeight: 'bold',
      fontSize: props.size?(props.size+15):15,

      marginVertical: 10,
      marginHorizontal: 15,

      color: getColor(),
    }
  });

  const btnOnPress = () => {

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