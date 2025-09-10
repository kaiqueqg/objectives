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

  const getDefautTextStyle = () => {
    return [s.text, props.textStyle, s.textDefault, props.hideDefaultTextBorder?undefined:s.textDefaultBorder];
  }

  const getTextStyle = () => {
    return [s.text, props.textStyle];
  }

  const getContainerStyle = () => {
    return [s.pressTextStyle, props.style];
  }

  const s = StyleSheet.create({
    pressTextStyle: {
      minWidth: 0,
      flexShrink: 1,
      overflow: 'hidden',
    },
    text: {
      color: t.textcolor,
      fontSize: 16,
    },
    textDefault: {
      color: t.textcolorfade,
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
    <Pressable style={getContainerStyle()} onPress={props.onPress}>
      {props.isLoading?
        <Loading theme={t} ></Loading>
        :
        (props.imageSource && props.imageStyle && <Image style={props.imageStyle} source={props.imageSource}></Image>)
      }
      {props.text.trim() === ''?
        <Text
          style={getDefautTextStyle()}
          numberOfLines={props.numberOfLines?? 1}
          ellipsizeMode={props.ellipsizeMode?? "head"}>
            {props.defaultText}
        </Text>
        :
        <Text 
          style={getTextStyle()}
          numberOfLines={props.numberOfLines?? 1}
          ellipsizeMode={props.ellipsizeMode?? "head"}>
            {props.text}
        </Text>
      }
    </Pressable>
  )
}

export default PressText