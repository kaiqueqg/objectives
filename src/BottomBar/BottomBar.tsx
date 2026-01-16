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
    textImage:{
      position: 'absolute',
      bottom: 5,
      left: 5,
      color: colorPalette.beige,
      fontSize: 5,
      fontWeight: 'bold',
    },
    loadingImage:{
    },
  });

  return (
    <View style={s.container}>
      <View style={s.leftContainer}>
        {user?
          (Constants.executionEnvironment === ExecutionEnvironment.StoreClient?
            <PressImage text="dev" textStyle={{color: colorPalette.red}} pressStyle={gs.baseBiggerImageContainer} style={[s.bottomImage, currentView === Views.UserView&&s.bottomImageSelected]} onPress={() => changeToView(Views.UserView)} source={require('../../public/images/user.png')}></PressImage>
            :
            <PressImage pressStyle={gs.baseBiggerImageContainer} style={[s.bottomImage, currentView === Views.UserView&&s.bottomImageSelected]} onPress={() => changeToView(Views.UserView)} source={require('../../public/images/user.png')}></PressImage>
          )
          :
          <PressImage pressStyle={gs.baseBiggerImageContainer} style={[s.bottomImage, s.trashImage]} onPress={() => changeToView(Views.UserView)} source={require('../../public/images/user.png')}></PressImage>
        }
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={[s.bottomImage]} onPress={changeTheme} source={require('../../public/images/theme.png')}></PressImage>
        {showLoginStuff && <PressImage pressStyle={currentView === Views.DevView? s.bottomImageSelected:gs.baseImageContainer} style={[s.bottomImage, currentView === Views.DevView&&s.bottomImageSelected]} onPress={() => changeToView(Views.DevView)} source={require('../../public/images/dev.png')}></PressImage>}
        {showLoginStuff && <LoginView viewType="Image"></LoginView>}
      </View>
      <View style={s.rightContainer}>
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={[s.bottomImage, currentView === Views.ArchivedView && s.bottomImageSelected]} textStyle={s.textImage} onPress={()=>{changeToView(Views.ArchivedView)}} source={require('../../public/images/archived.png')} ></PressImage>
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={[s.bottomImage, currentView === Views.ListView&&s.bottomImageSelected]} onPress={()=>{changeToView(Views.ListView)}} source={require('../../public/images/list.png')}></PressImage>
      </View>
    </View>
  );
};

export default BottomBar;