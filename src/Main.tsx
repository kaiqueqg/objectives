import { View, StyleSheet, StatusBar, AppStateStatus, AppState, KeyboardAvoidingView, Platform } from "react-native";
import { Objective, Themes, Views } from "./Types";
import { FontPalette } from "../fonts/Font";
import { AppPalette, colorPalette } from "./Colors";
import BottomBar from "./BottomBar/BottomBar";
import { useUserContext } from "./Contexts/UserContext";
import React, { useEffect, useRef, useState } from "react";
import ObjectiveView from "./ObjectivesList/ObjetiveView/ObjetiveView";
import PopMessageContainer from "./Log/PopMessageContainer";
import ObjsListView from "./ObjsListView/ObjsListView";
import DevView from "./DevView/DevView";
import { useLogContext } from "./Contexts/LogContext";
import { useStorageContext } from "./Contexts/StorageContext";
import ArchivedView from "./ArchivedView/ArchivedView";
import { Alert } from 'react-native';
import Constants, { ExecutionEnvironment } from "expo-constants";
import PressImage from "./PressImage/PressImage";
import * as LocalAuthentication from 'expo-local-authentication';
import { Images } from "./Images";
import { SettingsView } from "./SettingsView/SettingsView";
import { LoginView } from "./LoginView/LoginView";
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const [statusBarTheme, setStatusBarTheme] = useState<'default' | 'light-content' | 'dark-content'>('default');
  
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

  useEffect(() =>{
    const hours = (new Date()).getHours();
    const isInside = hours >= 9 && hours <= 18;

    switch(userPrefs.theme){
      case Themes.Auto:
        if(isInside){
          setStatusBarTheme("dark-content");
        }
        else{
          setStatusBarTheme("light-content");
        }
        break;
      case Themes.Dark:
        setStatusBarTheme("light-content");
        break;
      case Themes.Light:
        setStatusBarTheme("dark-content");
        break;
    }
  }, [userPrefs])

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

  const testBioAuth = async () => {
    if(await requestBiometricAuth()){
      setShowMainView(true);
    }
  }

  const onFirstOpenLock = async () => {
    const listeningUserPrefs = await storage.readUserPrefs();
    if(listeningUserPrefs && listeningUserPrefs.shouldLockOnOpen){
      await testBioAuth();
    }
    appJustLaunched = false;
  }

  const onReopenLock = async () => {
    const listeningUserPrefs = await storage.readUserPrefs();
    if(listeningUserPrefs && listeningUserPrefs.shouldLockOnReopen){
      await testBioAuth();
    }
  }

  const loadCurrentObject = () => {
    const currentObj = objectives.find((obj)=>obj.ObjectiveId === currentObjectiveId);
    if(currentObj) setCurrentObjective(currentObj);
  }

  const getCurrentView = () => {
    if(currentView === Views.LoginView){
      return <LoginView viewType="Full"/>;
    }
    else if(currentView === Views.ArchivedView){
      return <ArchivedView/>
    }
    else if(currentView === Views.ListView){
      return <ObjsListView/>
    }
    else if(currentView === Views.DevView){
      return <DevView/>
    }
    else if(currentView === Views.SettingsView){
      return <SettingsView/>
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
    lockedContainer:{
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      padding: 100,
    },
    lockImage:{
      width: 40,
      height: 40,
    },
    safeAreaContainer:{
      flex: 1,
      backgroundColor: t.backgroundcolor,
    },
  });

  return (
    <SafeAreaView style={s.safeAreaContainer}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {showMainView?
          <View style={s.container}>
            <PopMessageContainer></PopMessageContainer>
              {getCurrentView()}
            <BottomBar></BottomBar>
            <StatusBar translucent backgroundColor="transparent" barStyle={statusBarTheme}/>
          </View>
        :
        <View style={s.lockedContainer}>
          <PressImage source={Images.Lock} raw size={50} onPress={async () => await testBioAuth()}/>
        </View>
        }
      </KeyboardAvoidingView>
    </SafeAreaView>
    
  );
};



export default Main;