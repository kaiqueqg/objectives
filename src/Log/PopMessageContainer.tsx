import { View, StyleSheet, Text } from "react-native";
import { FontPalette } from "../../fonts/Font";
import { useUserContext } from "../Contexts/UserContext";
import { useEffect, useState } from "react";
import PopMessageView from "./PopMessageView";
import { useLogContext } from "../Contexts/LogContext";
import { HandPosition, PopMessage } from "../Types";

export interface PopMessageContainerProps {
}
const PopMessageContainer = (props: PopMessageContainerProps) => {
  const { theme: t, fontTheme: f, userPrefs } = useUserContext();
  const { log, messageList, deleteMessageList } = useLogContext();

  useEffect(()=>{
  }, [messageList]);

  const s = StyleSheet.create({
    messageList:{
      position: 'absolute',
      zIndex: 1,
      right: 0,
      width: '100%',

      margin: 5,
      verticalAlign: 'middle',
    },
    deleteAllText:{
      alignSelf: userPrefs.handPosition === HandPosition.Left? 'flex-start':'flex-end',
      flexDirection: 'row',

      margin: 5,
      padding: 5,
      color: t.textcolorcontrast,
      fontWeight: 'bold',

      elevation: 5,

      backgroundColor: t.backgroundcolorcontrast,

      borderColor: 'black',
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
    },
  });

  return (
    messageList.length > 0?
      <View style={s.messageList} pointerEvents="box-none">
        {/* {messageList.length > 1 && 
          <ButtonView
            text="Delete all"
            type='neutral'
            imageSource={Images.Trash}
            onPress={deleteMessageList}
            size={-5}
          />
        } */}
        {messageList.map((item, index)=>{
          return <PopMessageView key={item.id} message={item}></PopMessageView>
        })}
      </View>
      :
      <></>
  );
};

export default PopMessageContainer;