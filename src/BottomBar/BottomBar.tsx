import { View, StyleSheet, Vibration } from "react-native";
import { globalStyle as gs } from "../Colors";
import { MessageType, Pattern, Themes, Views } from "../Types";
import PressImage from "../PressImage/PressImage";
import { useUserContext } from "../Contexts/UserContext";
import {Loading} from "../Loading/Loading";
import { useLogContext } from "../Contexts/LogContext";
import React, { useEffect, useState } from "react";
import Constants, { ExecutionEnvironment } from 'expo-constants';
import {LoginView} from "../LoginView/LoginView";
import { Images } from "../Images";
import SyncView from "../SyncView/SyncView";

export interface BottomBarProps {
}

enum BottomBarIcons { User = 'UserView', Settings = 'Settings', Theme = 'Theme', List = 'List', Archived = 'Archived', Dev = 'Dev', Sync = 'Sync', Alerts = 'Alerts' }

const BottomBar = (props: BottomBarProps) => {
  const { user, userPrefs, theme: t, fontTheme: f, currentView, writeCurrentView, availableTags, selectedTags, currentObjectiveId, writeUserPrefs } = useUserContext();
  const { log, popMessage } = useLogContext();

  const showLoginStuff: boolean = true;//Constants.executionEnvironment === ExecutionEnvironment.StoreClient || process.env.LOGIN_VIEW === 'true';

  useEffect(() => {}, [availableTags, selectedTags]);

  const changeToView = (newView: Views) => {
    if(currentView === newView){
      if(currentObjectiveId === '' && currentView === Views.ListView){
        if(userPrefs.vibrate) Vibration.vibrate(Pattern.Wrong);
        popMessage('No objective selected.', MessageType.Alert);
      }
      else if(currentObjectiveId !== ''){
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
    let newTheme;

    switch(userPrefs.theme){
      // case Themes.Auto:
      //   newTheme = Themes.Dark;
      //   break;
      case Themes.Dark:
        newTheme = Themes.Light;
        break;
      case Themes.Light:
        newTheme = Themes.Dark;
        break;
      default:
        newTheme = Themes.Dark;
        break;
    }

    writeUserPrefs({...userPrefs, theme: newTheme});
  }

  const getThemeBottomIcon = () => {
    switch(userPrefs.theme){
      // case Themes.Auto:
      //   return Images.Theme
      case Themes.Dark:
        return <PressImage onPress={changeTheme} source={Images.DarkMode}/>
      case Themes.Light:
        return <PressImage onPress={changeTheme} source={Images.LightMode}/>
      case Themes.Win95:
        return <PressImage onPress={changeTheme} source={Images.Win95} raw/>
      default:
        return <PressImage onPress={changeTheme} source={Images.DarkMode}/>
    }
  }

  const getBottomIcon = (icon: BottomBarIcons) => {
    switch(icon){
      case BottomBarIcons.User:
        return(
          <PressImage 
            text={Constants.executionEnvironment === ExecutionEnvironment.StoreClient?"dev":undefined}
            onPress={() => changeToView(Views.LoginView)}
            source={Images.User}
            isSelected={currentView === Views.LoginView}
            color={user.Email===''?t.trashicontint:t.icontint}/>
        )
      case BottomBarIcons.Settings:
        return(
          <PressImage
            onPress={() => changeToView(Views.SettingsView)}
            source={Images.Settings}
            isSelected={currentView === Views.SettingsView}
          />
        )
      case BottomBarIcons.Theme:
        return(
          getThemeBottomIcon()
        )
      case BottomBarIcons.List:
        return(
           <PressImage 
              onPress={()=>{changeToView(Views.ListView)}}
              source={Images.File}
              isSelected={currentView === Views.ListView}
              size={currentView === Views.ArchivedView?-4:-1}/>
        )
      case BottomBarIcons.Archived:
        return(
          <PressImage 
            onPress={()=>{changeToView(Views.ArchivedView)}}
            source={Images.Archive}
            isSelected={currentView === Views.ArchivedView}
            size={currentView === Views.ListView?-4:-1}
          />
        )
      case BottomBarIcons.Sync:
        return(<LoginView viewType="Image"/>)
      case BottomBarIcons.Dev:
        if(user.Role === 'Admin' || ExecutionEnvironment.StoreClient) return <></>;
        return(
          <PressImage
            onPress={()=>{changeToView(Views.DevView)}}
            source={Images.Dev}
            isSelected={currentView === Views.DevView}/>
        )
      case BottomBarIcons.Alerts:
        return(
          <PressImage 
            onPress={()=>{changeToView(Views.AlertsView)}}
            source={Images.Bell}
            isSelected={currentView === Views.AlertsView}/>
        )
    }
  }

  const getLeftBottomView = () => {
    return(
      <View style={s.leftContainer}>
        {userPrefs.isRightHand?
          <>
            {getBottomIcon(BottomBarIcons.User)}
            {getBottomIcon(BottomBarIcons.Settings)}
            {getBottomIcon(BottomBarIcons.Theme)}
            {getBottomIcon(BottomBarIcons.Sync)}
            {getBottomIcon(BottomBarIcons.Alerts)}
            {getBottomIcon(BottomBarIcons.Dev)}
          </>
          :
          <>
            {getBottomIcon(BottomBarIcons.Dev)}
            {getBottomIcon(BottomBarIcons.Alerts)}
            {getBottomIcon(BottomBarIcons.Sync)}
            {getBottomIcon(BottomBarIcons.Dev)}
            {getBottomIcon(BottomBarIcons.Theme)}
            {getBottomIcon(BottomBarIcons.Settings)}
            {getBottomIcon(BottomBarIcons.User)}
          </>
        }
      </View>
    )
  }

  const getRightBottomView = () => {
    return(
      <View style={s.rightContainer}>
        {userPrefs.isRightHand?
          <>
            {getBottomIcon(BottomBarIcons.Archived)}
            {getBottomIcon(BottomBarIcons.List)}
          </>
          :
          <>
            {getBottomIcon(BottomBarIcons.List)}
            {getBottomIcon(BottomBarIcons.Archived)}
          </>
        }
      </View>
    )
  }

  const s = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: t.backgroundcolordarker,

      borderColor: t.bordercolorfade,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderStyle: 'solid',
    },
    leftContainer: {
      flexDirection: 'row',
      justifyContent: userPrefs.isRightHand?'flex-start':'flex-end',
      width: '50%',
    },
    rightContainer: {
      flexDirection: 'row',
      justifyContent: userPrefs.isRightHand?'flex-end':'flex-start',
      width: '50%',
    },
  });

  return (
    <View style={s.container}>
      {userPrefs.isRightHand?getLeftBottomView():getRightBottomView()}
      {userPrefs.isRightHand?getRightBottomView():getLeftBottomView()}
    </View>
  );
};

export default BottomBar;