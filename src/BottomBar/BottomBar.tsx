import { View, StyleSheet, Vibration } from "react-native";
import { AppPalette, colorPalette, dark, globalStyle as gs } from "../Colors";
import { Pattern, Views } from "../Types";
import PressImage from "../PressImage/PressImage";
import { useUserContext } from "../Contexts/UserContext";
import Loading from "../Loading/Loading";
import { useLogContext } from "../Contexts/LogContext";
import React, { useEffect, useState } from "react";
import Constants, { ExecutionEnvironment } from 'expo-constants';

export interface BottomBarProps {
  isSyncing: boolean,
  doneSync: boolean,
  failedSync: boolean,
  isLambdaCold: boolean,
  isServerUp: boolean,
  syncObjectivesList: () => void,
}

const BottomBar = (props: BottomBarProps) => {
  const { user, userPrefs, theme: t, fontTheme: f, currentView, writeCurrentView, availableTags, selectedTags, currentObjectiveId, writeUserPrefs } = useUserContext();
  const { log } = useLogContext();
  const { isSyncing, doneSync, failedSync, isLambdaCold, syncObjectivesList } = props;

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

      borderStyle: 'solid',
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: t.bordercolorfade,
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
    bottomImageSelected:{
      ...gs.baseBiggerImage,
      tintColor: t.bottombariconselected,
    },
    textImage:{
      position: 'absolute',
      color: colorPalette.beige,
      fontSize: 12,
      fontWeight: 'bold',
    },
    loadingImage:{
    },
  });

  return (
    <View style={s.container}>
      <View style={s.leftContainer}>
        {/* <PressImage pressStyle={gs.baseImageContainer} style={[s.bottomImage, (currentView === Views.UserView)?s.bottomImageSelected:(s.cancelImage, user&&s.doneImage) ]} onPress={() => changeToView(Views.UserView)} source={require('../../public/images/user.png')}></PressImage> */}
        {user?
          (Constants.executionEnvironment === ExecutionEnvironment.StoreClient?
            <PressImage text="dev" textStyle={{color: colorPalette.red}} pressStyle={gs.baseBiggerImageContainer} style={[s.bottomImage, currentView === Views.UserView&&s.bottomImageSelected]} onPress={() => changeToView(Views.UserView)} source={require('../../public/images/user.png')}></PressImage>
            :
            <PressImage pressStyle={gs.baseBiggerImageContainer} style={[s.bottomImage, currentView === Views.UserView&&s.bottomImageSelected]} onPress={() => changeToView(Views.UserView)} source={require('../../public/images/user.png')}></PressImage>
          )
          :
          <PressImage pressStyle={gs.baseBiggerImageContainer} style={[s.bottomImage, s.cancelImage]} onPress={() => changeToView(Views.UserView)} source={require('../../public/images/user.png')}></PressImage>
        }
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={[s.bottomImage]} onPress={changeTheme} source={require('../../public/images/theme.png')}></PressImage>
        {user && user.Role !== 'Guest' && <PressImage pressStyle={currentView === Views.DevView? s.bottomImageSelected:gs.baseImageContainer} style={[s.bottomImage, currentView === Views.DevView&&s.bottomImageSelected]} onPress={() => changeToView(Views.DevView)} source={require('../../public/images/dev.png')}></PressImage>}
        {user?
          <>
            {!isSyncing && isLambdaCold && <PressImage pressStyle={gs.baseBiggerImageContainer} style={[s.bottomImage, {tintColor: colorPalette.bluelight}]} onPress={()=>{}} source={require('../../public/images/cold.png')}></PressImage>}
            {isSyncing &&  !isLambdaCold && <Loading theme={dark}></Loading>}
            {!isSyncing && !isLambdaCold && <PressImage pressStyle={gs.baseBiggerImageContainer} style={[s.bottomImage, failedSync&&s.cancelImage, doneSync&&s.doneImage]} onPress={syncObjectivesList} source={require('../../public/images/sync.png')}></PressImage>}
          </>
          :
          <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.bottomImage} onPress={syncObjectivesList} source={require('../../public/images/cloud-offline.png')}></PressImage>
        }
      </View>
      <View style={s.rightContainer}>
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={[s.bottomImage, currentView === Views.ArchivedView && s.bottomImageSelected]} textStyle={s.textImage} onPress={()=>{changeToView(Views.ArchivedView)}} source={require('../../public/images/archived.png')} ></PressImage>
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={[s.bottomImage, currentView === Views.ListView&&s.bottomImageSelected]} onPress={()=>{changeToView(Views.ListView)}} source={require('../../public/images/list.png')}></PressImage>
      </View>
    </View>
  );
};

export default BottomBar;