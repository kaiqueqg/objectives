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
  syncObjectivesList: (objList?: ObjectiveList)=>void,
}

const DevView = (props: MainProps) => {
  const { log, consoleLogs, deleteLog } = useLogContext();
  const { writeCurrentView, theme: t } = useUserContext();
  const { syncObjectivesList } = props;

  const [isSyncing, setIsSyncing] = useState<boolean>(false);

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

  const testSync = async () => {
    // setIsSyncing(true);

    // let first:ObjectiveList = {
    //   Objectives: [],
    //   Items: [],
    //   DeleteObjectives: [],
    //   DeleteItems: [],
    // }

    // const data = await syncObjectivesList(first);

    // if(data){
    // }
    // else{
    // }

    // setIsSyncing(false);
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
        {/* {isSyncing?
          <Loading theme={dark}></Loading>
          :
          <PressText style={s.devButton} textStyle={s.devButtonText} onPress={testSync} text="Test async"></PressText>
        } */}
      </View>
    </View>
  )
}

export default DevView;