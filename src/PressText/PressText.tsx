import React from "react";
import { Pressable, Text, Image, ImageSourcePropType, StyleSheet } from "react-native";
import { useUserContext } from "../Contexts/UserContext";
import Loading from "../Loading/Loading";
import { ObjectivePallete } from "../Colors";

interface PressTextProps{
  style: any,
  textStyle: any,
  text: string,
  defaultText?: string,
  defaultStyle: {itemtextfade?: any},
  hideDefaultTextBorder?: boolean,
  onPress: () => void,
  imageSource?: ImageSourcePropType,
  imageStyle?: any,
  ellipsizeMode?: "head" | "middle" | "tail" | "clip",
  numberOfLines?: number,

  isLoading?: boolean,
}

interface PressTextProps{}

const PressText = (props: PressTextProps) => {
  const { theme: t } = useUserContext();
  const { defaultStyle: o } = props;

  const s = StyleSheet.create({
    pressTextStyle: {
      
    },
    text: {
      color: t.textcolor,
      fontSize: 16,
      // width: '100%',
    },
    textDefault: {
      color: t.textcolorfade,
      // width: '100%',
      fontSize: 16,
    },
    textDefaultBorder:{
      ...props.defaultStyle,
      borderBottomWidth: 1,
      borderStyle: 'solid',
      borderColor: o.itemtextfade,
      borderRadius: 5,
    },
  });

  return (
    <Pressable style={[s.pressTextStyle, props.style]} onPress={props.onPress}>
      {props.isLoading?
        <Loading theme={t} ></Loading>
        :
        (props.imageSource && props.imageStyle && <Image style={props.imageStyle} source={props.imageSource}></Image>)
      }
      {props.text.trim() === ''?
        <Text numberOfLines={props.numberOfLines??1} ellipsizeMode={props.ellipsizeMode??"head"} style={[s.text, props.textStyle, s.textDefault, props.hideDefaultTextBorder?undefined:s.textDefaultBorder]}>{props.defaultText}</Text>
        :
        <Text numberOfLines={props.numberOfLines??1} ellipsizeMode={props.ellipsizeMode??"head"} style={[s.text, props.textStyle]}>{props.text}</Text>
      }
    </Pressable>
  )
}

export default PressText