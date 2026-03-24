import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLogContext } from '../Contexts/LogContext';
import ButtonView from '../ButtonView/ButtonView';
import { useUserContext } from '../Contexts/UserContext';
import { MessageType } from '../Types';
import PressImage from '../PressImage/PressImage';
import { Images } from '../Images';

interface AlertsViewProps {
}

const AlertsView: React.FC<AlertsViewProps> = (props: AlertsViewProps) => {
  const { log, consoleLogs, popMessage, deleteConsoleLog } = useLogContext();
  const { theme } = useUserContext();
  
  const s = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      verticalAlign: 'middle',
      flexDirection: 'column',
    },
    buttonsView: {
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
      verticalAlign: 'middle',
      textAlign: 'center',
      
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 10,
      paddingVertical: 5,

      backgroundColor: theme.backgroundcolordarker,
    },
    scrollView: {
      flex: 1,
      width: '100%',
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
      // borderRadius: 5,
      borderStyle: 'solid',
    },
  });

  return (
    <View style={s.container}>
      <ScrollView style={s.scrollView}>
        {
          consoleLogs.map((t: string, i: number) => {
            return <Text key={i} style={s.text}>{t}</Text>
          })
        }
        
      </ScrollView>
      <View style={s.buttonsView}>
        <ButtonView text='Error' type='reset' onPress={() => {popMessage('Error', MessageType.Error)}} />
        <ButtonView text='Alert' type='backward' onPress={() => {popMessage('Alert', MessageType.Alert)}}/>
        <ButtonView text='Positive' type='positive' onPress={() => {popMessage('Possqdqsdqsdqsdqsitive', MessageType.Positive)}}/>
        <ButtonView text='Normal' type='foward' onPress={() => {popMessage('Normal')}}/>
        <ButtonView text='Console' type='neutral' onPress={() => {log.w('Console')}}/>
        <PressImage source={Images.Trash} onPress={deleteConsoleLog}/>
      </View>
    </View>
  );
};

export default AlertsView;