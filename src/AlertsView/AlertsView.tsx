import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLogContext } from '../Contexts/LogContext';
import ButtonView from '../ButtonView/ButtonView';
import { useUserContext } from '../Contexts/UserContext';
import { HandPosition, MessageType, PopMessage } from '../Types';
import PressImage from '../PressImage/PressImage';
import { Images } from '../Images';
import { ExecutionEnvironment } from 'expo-constants';
import PopMessageView from '../Log/PopMessageView';

interface AlertsViewProps {
}

const AlertsView: React.FC<AlertsViewProps> = (props: AlertsViewProps) => {
  const { log, messageListLogs, popMessage, deleteMessageListLogs } = useLogContext();
  const { theme, user, userPrefs } = useUserContext();
  
  const s = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
    },
    buttonsView: {
      width: '100%',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      verticalAlign: 'middle',
      textAlign: 'center',
      
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 10,
      paddingVertical: 5,

      backgroundColor: theme.backgroundcolordarker,

      borderTopColor: theme.bordercolor,
      borderTopWidth: 1,
      borderStyle: 'solid',
    },
    scrollView: {
    },
    text:{
      flex: 1,
      color: theme.textcolor,
      paddingVertical: 2,
      paddingHorizontal: 5,
      marginVertical: 1,
      marginHorizontal: 2,
      backgroundColor: theme.backgroundcolordarker,

      borderColor: theme.bordercolorfade,
      borderWidth: 1,
      borderStyle: 'solid',
    },
  });

  return (
    <View style={s.container}>
      <ScrollView style={s.scrollView}>
        {
          messageListLogs.map((t: PopMessage, i: number) => {
            return <PopMessageView key={i.toString()} message={{id: i.toString(), text: t.text, timeout: Infinity, type: t.type, createdAt: t.createdAt, options:{ShowTimeSince: true}}}/>
          })
        }
      </ScrollView>
      {(user.Role === 'Admin' || ExecutionEnvironment.StoreClient) && 
       <View style={s.buttonsView}>
        <ButtonView text='Error' type='reset' onPress={() => {popMessage('Error', {Type: MessageType.Error})}} size={-10}/>
        <ButtonView text='Alert' type='backward' onPress={() => {popMessage('Alert', {Type: MessageType.Alert})}} size={-10}/>
        <ButtonView text='Positive' type='positive' onPress={() => {popMessage('Positive', {Type: MessageType.Positive})}} size={-10}/>
        <ButtonView text='Normal' type='neutral' onPress={() => {popMessage('Normal')}} size={-10}/>
        <ButtonView text='Question' type='foward' onPress={() => {popMessage('Question', {Type: MessageType.Question})}} size={-10}/>
        <ButtonView text='Console' type='neutral' onPress={() => {log.w('Console')}} size={-10}/>
        <PressImage source={Images.Trash} onPress={deleteMessageListLogs}/>
      </View>}
    </View>
  );
};

export default AlertsView;