import { View, StyleSheet, Vibration } from "react-native";
import { AppPalette, colorPalette, dark, globalStyle as gs } from "../Colors";
import { Pattern, Views } from "../Types";
import PressImage from "../PressImage/PressImage";
import { useUserContext } from "../Contexts/UserContext";
import Loading from "../Loading/Loading";
import { useLogContext } from "../Contexts/LogContext";
import React, { useEffect, useState } from "react";
import Constants, { ExecutionEnvironment } from 'expo-constants';
import LoginView from "../UserView/LoginView";

export interface BottomBarProps {
}

const BottomBar = (props: BottomBarProps) => {
  const { user, userPrefs, theme: t, fontTheme: f, currentView, writeCurrentView, availableTags, selectedTags, currentObjectiveId, writeUserPrefs } = useUserContext();
  const { log } = useLogContext();

  const showLoginStuff: boolean = true;//Constants.executionEnvironment === ExecutionEnvironment.StoreClient || process.env.LOGIN_VIEW === 'true';

  useEffect(() => {}, [availableTags, selectedTags]);

  const changeToView = (newView: Views) => {
    if(currentView === newView){
      if(currentObjectiveId === ''){
        if(userPrefs.vibrate) Vibration.vibrate(Pattern.Wrong);
      }
      else{
        if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
        writeCurrentView(Views.IndividualView);
      }
    }
    else{
      if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
      writeCurrentView(newView);
    }
  }
  
  const changeTheme = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    writeUserPrefs({...userPrefs, theme: userPrefs.theme === 'dark'?'light':'dark'});
  }

  const getLeftBottomView = () => {
    return(
      <View style={s.leftContainer}>
        <PressImage 
          text={Constants.executionEnvironment === ExecutionEnvironment.StoreClient?"dev":undefined}
          onPress={() => changeToView(Views.UserView)}
          source={require('../../public/images/user.png')}
          selected={currentView === Views.UserView}
          colorSelected={user.Email===''?t.trashicontint:t.icontintselected}
          color={user.Email===''?t.trashicontint:t.icontint}/>
        <PressImage
          onPress={changeTheme}
          source={require('../../public/images/theme.png')}/>
        {showLoginStuff && <PressImage onPress={() => changeToView(Views.DevView)} source={require('../../public/images/dev.png')} selected={currentView === Views.DevView}/>}
        {showLoginStuff && <LoginView viewType="Image"/>}
      </View>
    )
  }

  const getRightBottomView = () => {
    return(
      <View style={s.rightContainer}>
        <PressImage 
          onPress={()=>{changeToView(Views.ArchivedView)}}
          source={require('../../public/images/archive.png')}
          fade={currentView === Views.ListView}
          selected={currentView === Views.ArchivedView}
          size={currentView === Views.ListView?-4:(currentView === Views.ArchivedView?6:0)}/>
        <PressImage 
          onPress={()=>{changeToView(Views.ListView)}}
          source={require('../../public/images/file.png')}
          fade={currentView === Views.ArchivedView}
          selected={currentView === Views.ListView}
          size={currentView === Views.ArchivedView?-4:-1}/>
      </View>
    )
  }

  const s = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: t.backgroundcolordarker,

      // borderColor: 'black',
      // borderTopWidth: 1,
      // borderStyle: 'solid',
    },
    leftContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '50%',
    },
    rightContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '50%',
    },
    imageContainerSelected:{
    },
    bottomImage: {
      ...gs.baseImage,
      tintColor: t.icontint,
    },
    doneImage:{
      tintColor: t.doneicontint,
    },
    cancelImage:{
      tintColor: t.cancelicontint,
    },
    trashImage:{
      tintColor: t.trashicontint,
    },
    bottomImageSelected:{
      ...gs.baseBiggerImage,
      tintColor: t.bottombariconselected,
    },
  });

  return (
    <View style={s.container}>
      {getLeftBottomView()}
      {getRightBottomView()}
    </View>
  );
};

export default BottomBar;