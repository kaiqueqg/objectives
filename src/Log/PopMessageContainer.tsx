import { View, StyleSheet, Text } from "react-native";
import { FontPalette } from "../../fonts/Font";
import { useUserContext } from "../Contexts/UserContext";
import { useEffect } from "react";
import PopMessageView from "./PopMessageView";
import { useLogContext } from "../Contexts/LogContext";
import ButtonView from "../ButtonView/ButtonView";

export interface PopMessageContainerProps {
}
const PopMessageContainer = (props: PopMessageContainerProps) => {
  const { theme: t, fontTheme: f } = useUserContext();
  const { log, messageList, deleteMessageList } = useLogContext();

  useEffect(()=>{
  }, [messageList]);

  const s = StyleSheet.create({
    messageList:{
      position: 'absolute',
      zIndex: 1,
      right: 0,

      margin: 5,
    },
    deleteAllText:{
      alignSelf: 'flex-end',
      textAlign: 'center',
      flexDirection: 'row',

      margin: 5,
      padding: 5,
      color: t.textcolorcontrast,

      backgroundColor: t.backgroundcolorcontrast,

      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
    },
  });

  return (
    <View style={s.messageList}>
      {messageList.length > 1 && <Text style={s.deleteAllText} onPress={deleteMessageList}>{'Delete All'}</Text>}
      {messageList.map((item, index)=>{
        return <PopMessageView key={'message'+index} message={item}></PopMessageView>
      })}
    </View>
  );
};

export default PopMessageContainer;