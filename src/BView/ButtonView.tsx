import React, { ReactNode, useEffect, useState } from "react";
import { Image, ImageStyle, ImageSourcePropType, View, ViewProps, Vibration, StyleSheet, Text, Pressable } from "react-native";

export interface ButtonProps extends ViewProps {
  outStyle: any,
  inStyle: any,

  children?: ReactNode,

  textStyle: any,
  text: string,
  defaultText?: string,
  defaultStyle?: {itemtextfade?: any},
  hideDefaultTextBorder?: boolean,
  onPress: () => void,
  imageSource?: ImageSourcePropType,
  imageStyle?: any,
  ellipsizeMode?: "head" | "middle" | "tail" | "clip",
  numberOfLines?: number,

  isLoading?: boolean,
}

const ButtonView = (props: ButtonProps) => {
  const s = StyleSheet.create({
    
  });

  return(

    <Pressable style={props.outStyle} onPress={props.onPress}>
      <View style={props.inStyle}>
        {props.children}
      </View>
    </Pressable>
  )   
}

export default ButtonView