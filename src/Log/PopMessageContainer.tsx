import { View, StyleSheet } from "react-native";
import { ThemePalette, getObjTheme } from "../Colors";
import { FontPalette } from "../../fonts/Font";
import { useUserContext } from "../Contexts/UserContext";
import { useEffect } from "react";
import PopMessageView from "./PopMessageView";
import { useLogContext } from "../Contexts/LogContext";

export interface PopMessageContainerProps {
}
const PopMessageContainer = (props: PopMessageContainerProps) => {
  const { theme: t, fontTheme: f } = useUserContext();
  const { log, messageList } = useLogContext();

  useEffect(()=>{
  }, [messageList]);

  const s = StyleSheet.create({
    messageList:{
    },
  });

  return (
    <View style={s.messageList}>
      {messageList.map((item, index)=>{
        return <PopMessageView key={'message'+index} message={item}></PopMessageView>
      })}
    </View>
  );
};

export default PopMessageContainer;