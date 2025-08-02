import React from "react";
import { Pressable, TextStyle, Text } from "react-native";

interface P{
  style: any,
  textStyle: any,
  text: string,
  onPress: () => void,
  ellipsizeMode?: "head" | "middle" | "tail" | "clip",
}

interface S{}

class PressImage extends React.Component<P, S>{
  constructor(props: P){
    super(props);

    this.state = {
    }
  }

  render(): React.ReactNode {
    const { style, textStyle, text, onPress, ellipsizeMode } = this.props;
    const numberOfLines = ellipsizeMode ? 1 : undefined;

    return(
      <Pressable style={style} onPress={onPress}>
        <Text
          numberOfLines={numberOfLines}
          ellipsizeMode={ellipsizeMode}
          style={textStyle}
        >
          {text}
        </Text>
      </Pressable>
    )
  }
}

export default PressImage