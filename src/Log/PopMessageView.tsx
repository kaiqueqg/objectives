
import { View, StyleSheet, Text } from "react-native";
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
        return (<View style={[s.messageContainer]}>
          <Text style={s.messageText}>{message.text}</Text>
        </View>)
      case MessageType.Error:
        return (<View style={[s.messageContainer, s.messageError]}>
          <Text style={s.messageText}>{message.text}</Text>
        </View>)
      case MessageType.Alert:
        return (<View style={[s.messageContainer, s.messageAlert]}>
          <Text style={s.messageText}>{message.text}</Text>
        </View>)
      default:
        return <></>
    }
  }

  const s = StyleSheet.create({
    messageContainer:{
      display: 'flex',
      color: 'beige',
      height: 30, 
      maxHeight: 30,
      minHeight: 30,
      
      backgroundColor: cp.greenlight,
      justifyContent: 'center',
      alignItems: 'center',
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