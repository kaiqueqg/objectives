import { View, StyleSheet, StatusBar, AppStateStatus, AppState } from "react-native";
import { Objective, Views } from "./Types";
import { FontPalette } from "../fonts/Font";
import { AppPalette, colorPalette } from "./Colors";
import BottomBar from "./BottomBar/BottomBar";
import { useUserContext } from "./Contexts/UserContext";
import React, { useEffect, useRef, useState } from "react";
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
import { Alert } from 'react-native';
import Constants, { ExecutionEnvironment } from "expo-constants";
import PressImage from "./PressImage/PressImage";
import * as LocalAuthentication from 'expo-local-authentication';

export interface MainProps{
}

let appJustLaunched = true;

const Main = (props: MainProps) => {
  const { messageList, popMessage, log } = useLogContext();
  const { storage } = useStorageContext();
  const { requestBiometricAuth } = useUserContext();
  const {
    userPrefs,
    currentView, writeCurrentView,
    theme: t, fontTheme: f,
    objectives,
    currentObjectiveId,
  } = useUserContext();

  const [currentObjective, setCurrentObjective] = useState<Objective|null>(null);
  const [showMainView, setShowMainView] = useState<boolean>(false);
  
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    let subscription: any;

    const run = async () => {
      // if(Constants.executionEnvironment !== ExecutionEnvironment.StoreClient) return;

      const compatible:boolean = await LocalAuthentication.hasHardwareAsync();
      const enrolled:boolean = await LocalAuthentication.isEnrolledAsync();
      const currentUserPrefs = await storage.readUserPrefs();
      if (!currentUserPrefs || !enrolled || !compatible) {
        setShowMainView(true);
        return;
      }
      if(!currentUserPrefs.shouldLockOnOpen && !currentUserPrefs.shouldLockOnReopen){
        await noFingerprintUnlockNeeded();
        return;
      }

      if(appJustLaunched){
        await onFirstOpenLock();
      }

      subscription = AppState.addEventListener('change', async (nextState) => {
        if (appState.current.match(/active/) && nextState.match(/inactive|background/)) {
          await onGoingToBackground();
        }

        if(appState.current.match(/inactive|background/) && nextState === 'active') {
          await onReopenLock();
        }
        appState.current = nextState;
      });

      appJustLaunched = false;
    }
    
    run();
    
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);
  
  useEffect(()=>{
    loadCurrentObject();
  }, [objectives, currentObjective, currentObjectiveId, currentView, messageList]);

  const noFingerprintUnlockNeeded = async () => {
    setShowMainView(true);
    return;
  }

  const onGoingToBackground = async () => {
    const listeningUserPrefs = await storage.readUserPrefs();
    
    if(listeningUserPrefs && listeningUserPrefs.shouldLockOnReopen){
      setShowMainView(false);
    }
  }

  const onFirstOpenLock = async () => {
    const listeningUserPrefs = await storage.readUserPrefs();
    if(listeningUserPrefs && listeningUserPrefs.shouldLockOnOpen){
      if(await requestBiometricAuth()){
        setShowMainView(true);
      }
      else{
      }
    }
    appJustLaunched = false;
  }

  const onReopenLock = async () => {
    const listeningUserPrefs = await storage.readUserPrefs();
    if(listeningUserPrefs && listeningUserPrefs.shouldLockOnReopen){
      if(await requestBiometricAuth()){
        setShowMainView(true);
      }
    }
  }

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
    else if(currentObjective){
      return <ObjectiveView obj={currentObjective}></ObjectiveView>
    }
  }

  const s = StyleSheet.create({
    safeAreaContainer:{
      flex: 1,
      backgroundColor: t.backgroundcolor,
    },
    container: {
      flex: 1,
      backgroundColor: t.backgroundcolor,
    },
    mainContent: {
      flex: 1,
    },
    lockedContainer:{
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: 'black',
      padding: 100,
    },
    lockImage:{
      width: 40,
      height: 40,
    }
  });

  return (
    showMainView?
      <SafeAreaView style={s.safeAreaContainer}>
        <View style={s.container}>
          <PopMessageContainer></PopMessageContainer>
            <View style={s.mainContent}>
              {getCurrentView()}
            </View>
          <BottomBar></BottomBar>
          <StatusBar backgroundColor={t.backgroundcolor} barStyle={getContent()}/>
        </View>
      </SafeAreaView>
      :
      <View style={s.lockedContainer}>
        <PressImage source={require('../public/images/add-lock.png')} style={s.lockImage}></PressImage>
      </View>
  );
};



export default Main;