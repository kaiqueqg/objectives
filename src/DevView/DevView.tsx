import { View, StyleSheet, Text, StatusBar, Vibration, BackHandler, Platform, AppState, AppStateStatus, FlatList, ScrollView  } from "react-native";
import { Item, MessageType, Objective, ObjectiveList, Pattern, PopMessage, Step, UserPrefs, Views } from "./../Types";
import { FontPalette } from "../../fonts/Font";
import { AppPalette, colorPalette, globalStyle as gs } from "./../Colors";
import { useUserContext } from "./../Contexts/UserContext";
import React, { useEffect, useState } from "react";
import PopMessageView from "./../Log/PopMessageView";
import PopMessageContainer from "./../Log/PopMessageContainer";
import Loading from "../Loading/Loading";
import { useLogContext } from "../Contexts/LogContext";
import PressImage from "../PressImage/PressImage";
import PressText from "../PressText/PressText";
export interface MainProps{
}

const DevView = (props: MainProps) => {
  const { log, consoleLogs, deleteLog } = useLogContext();
  const { writeCurrentView, theme: t } = useUserContext();

  useEffect(()=>{
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      writeCurrentView(Views.ListView);
      return true;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const clear = () => {
    deleteLog();
  }

  const s = StyleSheet.create({
    devContainer:{
      flex: 1,
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 10,
    },
    image:{
      ...gs.baseImage,
      tintColor: t.icontint,
    },
    devButtonRow:{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 50,
    },
    devButton:{
      height: 50,
      paddingHorizontal: 10,
      margin: 5,

      justifyContent: 'center',
      alignItems: 'center',

      backgroundColor: t.backgroundcolor,

      borderColor: t.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 5,
    },
    devButtonText:{
      color: t.textcolor,
      flexWrap: 'wrap',
    },
    devScrollMessages:{
      width: '100%',
      maxWidth: '100%',
      marginVertical: 5,
      marginHorizontal: 2,

      borderColor: t.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 5,
    },
    devMessages:{
      color: t.textcolor,
    },
  }); 

  return(
    <View style={s.devContainer}>
      <ScrollView style={s.devScrollMessages}>
        <Text style={s.devMessages}>{consoleLogs}</Text>
      </ScrollView>
      <View style={s.devButtonRow}>
        <PressImage style={s.image} pressStyle={gs.baseImageContainer} source={require('../../public/images/trash.png')} onPress={clear}></PressImage>
      </View>
    </View>
  )
}

export default DevView;