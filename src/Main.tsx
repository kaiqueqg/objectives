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
      console.log(1)
      if (!currentUserPrefs || !enrolled || !compatible) {
        console.log(2)
        setShowMainView(true);
        return;
      }
      console.log(3)
      if(!currentUserPrefs.shouldLockOnOpen && !currentUserPrefs.shouldLockOnReopen){
        console.log(4)
        await noFingerprintUnlockNeeded();
        return;
      }

      console.log(5, appJustLaunched)
      if(appJustLaunched){
        console.log(6)
        await onFirstOpenLock();
      }

      console.log(7)
      subscription = AppState.addEventListener('change', async (nextState) => {
        console.log(8)
        if (appState.current.match(/active/) && nextState.match(/inactive|background/)) {
          console.log(9)
          await onGoingToBackground();
        }

        if(appState.current.match(/inactive|background/) && nextState === 'active') {
          console.log(10)
          await onReopenLock();
        }
        console.log(11)
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
    console.log('dont need to test')
    setShowMainView(true);
    return;
  }

  const onGoingToBackground = async () => {
    const listeningUserPrefs = await storage.readUserPrefs();
    console.log('Indo pro background');
    
    if(listeningUserPrefs && listeningUserPrefs.shouldLockOnReopen){
      console.log('Esconde tela no app background');
      setShowMainView(false);
    }
  }

  const onFirstOpenLock = async () => {
    const listeningUserPrefs = await storage.readUserPrefs();
    console.log('Primeiro load');
    if(listeningUserPrefs && listeningUserPrefs.shouldLockOnOpen){
      console.log('Primeiro load - test auth first open');
      if(await requestBiometricAuth()){
        console.log('Primeiro load - auth');
        setShowMainView(true);
      }
      else{
        console.log('Primeiro load - no auth');
      }
    }
    appJustLaunched = false;
  }

  const onReopenLock = async () => {
    const listeningUserPrefs = await storage.readUserPrefs();
    console.log('Voltou do background (sem reiniciar)');
    if(listeningUserPrefs && listeningUserPrefs.shouldLockOnReopen){
      console.log('listeningUserPrefs.shouldLockOnReopen');
      log.r('test auth reopen');
      if(await requestBiometricAuth()){
        log.g('auth reopen');
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
    lockedContainer:{
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: "flex-start",
      alignItems: "center",
      backgroundColor: 'black',
      padding: 100,

      borderColor: 'red',
      borderWidth: 3,
      borderRadius: 5,
      borderStyle: 'solid',
    },
    lockImage:{
      width: 40,
      height: 40,
    }
  });

  return (
    showMainView?
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
      :
      <View style={s.lockedContainer}>
        <PressImage source={require('../public/images/lock.png')} style={s.lockImage}></PressImage>
      </View>
  );
};



export default Main;