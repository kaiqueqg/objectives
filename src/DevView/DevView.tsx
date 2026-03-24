import { View, StyleSheet, Text, BackHandler, ScrollView  } from "react-native";
import { Views } from "./../Types";
import { useUserContext } from "./../Contexts/UserContext";
import React, { useEffect } from "react";
import SyncView from "../SyncView/SyncView";
export interface MainProps{
}

const DevView = (props: MainProps) => {
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

  const s = StyleSheet.create({
    devContainer:{
      flex: 1,
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 10,
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
      <SyncView/>
    </View>
  )
}

export default DevView;