
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useUserContext } from "../Contexts/UserContext";
import { MessageType, PopMessage } from "../Types";
import { useEffect } from "react";
import { useLogContext } from "../Contexts/LogContext";
import { cp } from "../ColorPalette";

export interface PopMessageViewProps {
  message: PopMessage,
}
const PopMessageView = (props: PopMessageViewProps) => {
  const { removeMessage, log } = useLogContext();
  const { theme: t, fontTheme: f } = useUserContext();
  const { message } = props;

  useEffect(()=>{
    setTimeout(()=>{
      removeMessage(message.id);
    }, message.timeout);
  },[])

  const getTheme = () => {
    switch(message.type){
      case MessageType.Normal:
        return (
        <Pressable style={[s.messageContainer]} onPress={()=>{removeMessage(message.id)}}>
          <Text style={s.messageText}>{message.text}</Text>
        </Pressable>)
      case MessageType.Positive:
        return (
        <Pressable style={[s.messageContainer, s.messagePositive]} onPress={()=>{removeMessage(message.id)}}>
          <Text style={s.messageText}>{message.text}</Text>
        </Pressable>)
      case MessageType.Error:
        return (
        <Pressable style={[s.messageContainer, s.messageError]} onPress={()=>{removeMessage(message.id)}}>
          <Text style={s.messageText}>{message.text}</Text>
        </Pressable>)
      case MessageType.Alert:
        return (
        <Pressable style={[s.messageContainer, s.messageAlert]} onPress={()=>{removeMessage(message.id)}}>
          <Text style={s.messageText}>{message.text}</Text>
        </Pressable>)
      default:
        return <></>
    }
  }

  const s = StyleSheet.create({
    messageContainer:{
      alignSelf: 'flex-end',
      color: 'beige',

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
      
      backgroundColor: cp.greylighter,
      justifyContent: 'center',
      alignItems: 'center',
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
    },
  });

  return (getTheme());
};

export default PopMessageView;