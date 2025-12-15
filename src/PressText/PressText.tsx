import React from "react";
import { Pressable, Text, Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import { useUserContext } from "../Contexts/UserContext";
import Loading from "../Loading/Loading";
import { ObjectivePallete, globalStyle as gs } from "../Colors";

interface PressTextProps{
  style: any,
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

const PressText = (props: PressTextProps) => {
  const { theme: t } = useUserContext();
  const { defaultStyle: o } = props;

  const getDefautTextStyle = () => {
    return [s.text, props.textStyle, s.textDefault, props.hideDefaultTextBorder?undefined:s.textDefaultBorder];
  }

  const getTextStyle = () => {
    return [s.text, props.textStyle];
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
      borderColor: o?.itemtextfade?? t.textcolorfade,
      borderRadius: 5,
    },
    baseImage:{
      ...gs.baseImage,
      tintColor: t.icontint,
    },
  });

  return (
    <Pressable style={[s.pressTextStyle, props.style]} onPress={props.onPress}>
      {props.imageSource && 
        (props.isLoading?
          <Loading></Loading>
          :
          <Image style={[s.baseImage, props.imageStyle]} source={props.imageSource}></Image>
        )
      }
      {props.text.trim() === ''?
        <Text
          style={getDefautTextStyle()}
          numberOfLines={props.numberOfLines??undefined}
          ellipsizeMode={props.ellipsizeMode??undefined}
          >
            {props.defaultText}
        </Text>
        :
        <Text 
          style={getTextStyle()}
          numberOfLines={props.numberOfLines?? undefined}
          ellipsizeMode={props.ellipsizeMode?? undefined}
          >
            {props.text}
        </Text>
      }
    </Pressable>
  )
}

export default PressText