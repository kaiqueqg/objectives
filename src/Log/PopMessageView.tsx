
import { View, StyleSheet, Text, Pressable, Animated } from "react-native";
import { useUserContext } from "../Contexts/UserContext";
import { MessageType, PopMessage } from "../Types";
import { useEffect, useState } from "react";
import { useLogContext } from "../Contexts/LogContext";
import { cp } from "../ColorPalette";

export interface PopMessageViewProps {
  message: PopMessage,
}
const PopMessageView = (props: PopMessageViewProps) => {
  const { removeMessage, log } = useLogContext();
  const { theme: t, fontTheme: f } = useUserContext();
  const { message } = props;

  const [scale, setScale] = useState<number>(1);


  useEffect(()=>{
    setTimeout(()=>{
      removeMessage(message.id);
    }, message.timeout);

    const id = setInterval(() => {
      setScale((prev) => {
        const newValue = prev - 0.001;

        if(newValue < 0) clearInterval(id);

        return newValue;
      });
    }, 16);

    return () => clearInterval(id);
  },[]);

  const getTheme = () => {
    let styleToAdd;
    switch(message.type){
      case MessageType.Normal:
        break;
      case MessageType.Positive:
        styleToAdd = s.messagePositive;
        break;
      case MessageType.Error:
        styleToAdd = s.messageError;
        break;
      case MessageType.Alert:
        styleToAdd = s.messageAlert;
        break;
    }

    return(
      <Pressable style={[s.messageContainer, styleToAdd]} onPress={()=>{removeMessage(message.id)}}>
        <Text style={s.messageText}>{message.text}</Text>
      </Pressable>
    )
  }

  const s = StyleSheet.create({
    messageContainer:{
      opacity: scale,
      alignSelf: 'flex-end',
      color: 'beige',
      flexDirection: 'column',

      borderColor: 'black',
      borderWidth: 1,
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15,
      borderTopRightRadius: 15,
      borderBottomRightRadius: 0,
      borderStyle: 'solid',

      marginVertical: 3,
      marginHorizontal: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,

      elevation: 5,
      
      backgroundColor: cp.beige,
    },
    messagePositive:{
      backgroundColor: cp.greenlight,
    },
    messageError:{
      backgroundColor: cp.redlight,
    },
    messageAlert:{
      backgroundColor: cp.yellow,
    },
    messageText:{
      color: cp.black,
      fontSize: 15,
      fontWeight: 'bold',
    },
  });

  return (getTheme());
};

export default PopMessageView;