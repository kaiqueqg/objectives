import { View, StyleSheet, Text, StatusBar, Vibration, BackHandler, Platform, AppState, AppStateStatus, FlatList  } from "react-native";
import { Item, MessageType, Objective, ObjectiveList, Pattern, PopMessage, Step, UserPrefs, Views } from "./Types";
import { FontPalette } from "../fonts/Font";
import { AppPalette, colorPalette } from "./Colors";
import BottomBar from "./BottomBar/BottomBar";
import { useUserContext } from "./Contexts/UserContext";
import React, { useEffect, useState } from "react";
import ObjectiveView from "./ObjectivesList/ObjetiveView/ObjetiveView";
import UserView from "./UserView/UserView";
import PopMessageContainer from "./Log/PopMessageContainer";
import ObjsListView from "./ObjsListView/ObjsListView";
import DevView from "./DevView/DevView";
import { useLogContext } from "./Contexts/LogContext";
import { useStorageContext } from "./Contexts/StorageContext";
import TagsView from "./TagsView/TagsView";
import ArchivedView from "./ArchivedView/ArchivedView";
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Updates from 'expo-updates';

export interface MainProps{
}

const Main = (props: MainProps) => {
  const { messageList, popMessage, log } = useLogContext();
  const { storage } = useStorageContext();

  const {
    userPrefs, 
    currentView, writeCurrentView,
    theme: t, fontTheme: f,
    objectives,
    currentObjectiveId,
  } = useUserContext();

  const [currentObjective, setCurrentObjective] = useState<Objective|null>(null);

  useEffect(() => {
  }, []);
  
  useEffect(()=>{
    loadCurrentObject();
  }, [objectives, currentObjective, currentObjectiveId, currentView, messageList]);


  const loadCurrentObject = () => {
    const currentObj = objectives.find((obj)=>obj.ObjectiveId === currentObjectiveId);
    if(currentObj) setCurrentObjective(currentObj);
  }

  const getContent = (): 'default' | 'light-content' | 'dark-content' => {
    if(userPrefs.theme === 'dark') return 'light-content';
    if(userPrefs.theme === 'white') return 'dark-content';
    if(userPrefs.theme === 'paper') return 'dark-content';

    return 'dark-content';
  }

  const getCurrentView = () => {
    if(currentView === Views.UserView){
      return <UserView></UserView>;
    }
    else if(currentView === Views.ArchivedView){
      return <ArchivedView></ArchivedView>
    }
    else if(currentView === Views.ListView){
      return <ObjsListView></ObjsListView>
    }
    else if(currentView === Views.DevView){
      return <DevView></DevView>
    }
    else if(currentView === Views.TagsView){
      return <TagsView></TagsView>
    }
    else if(currentObjective){
      return <ObjectiveView obj={currentObjective}></ObjectiveView>
    }
  }

  const s = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.backgroundcolor,
    },
    mainContent: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.backgroundcolor }}>
      <View style={s.container}>
        <PopMessageContainer></PopMessageContainer>
        <View style={s.mainContent}>
          {getCurrentView()}
        </View>
        <BottomBar></BottomBar>
        <StatusBar backgroundColor={t.backgroundcolor} barStyle={getContent()}/>
      </View>
    </SafeAreaView>
  );
};



export default Main;