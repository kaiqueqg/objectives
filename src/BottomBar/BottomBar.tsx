import { View, StyleSheet, Text, Vibration, Alert } from "react-native";
import { ThemePalette, colorPalette, dark } from "../Colors";
import { FontPalette } from "../../fonts/Font";
import { Pattern, Views } from "../Types";
import PressImage from "../PressImage/PressImage";
import { useUserContext } from "../Contexts/UserContext";
import Loading from "../Loading/Loading";
import { useLogContext } from "../Contexts/LogContext";
import React, { useEffect, useState } from "react";

export interface BottomBarProps {
  isSyncing: boolean,
  doneSync: boolean,
  failedSync: boolean,
  isLambdaCold: boolean,
  isServerUp: boolean,
  syncObjectivesList: () => void,
}

const BottomBar = (props: BottomBarProps) => {
  const { user, userPrefs, theme: t, fontTheme: f, currentView, writeCurrentView, availableTags, selectedTags } = useUserContext();
  const { log } = useLogContext();
  const { isSyncing, doneSync, failedSync, isLambdaCold, syncObjectivesList } = props;

  useEffect(() => {}, [availableTags, selectedTags]);

  const onChangeToList = (view: Views) => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    writeCurrentView(view);
  }

  const changeToArchivedView = () => {
    onChangeToList(currentView === Views.IndividualView || currentView === Views.ListView || currentView === Views.TagsView? Views.ArchivedView:Views.IndividualView);
  }

  const changeToTagView = () => {
    onChangeToList(currentView === Views.IndividualView || currentView === Views.ListView || currentView === Views.ArchivedView? Views.TagsView:Views.IndividualView);
  }

  const changeToListView = () => {
    onChangeToList(currentView === Views.IndividualView || currentView === Views.TagsView || currentView === Views.ArchivedView? Views.ListView:Views.IndividualView);
  }

  const getTagImageText = () => {
    return selectedTags.length+'/'+availableTags.length;
  }

  const s = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 55,
      backgroundColor: t.backgroundcolordarker,
      borderStyle: 'solid',
      
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: t.boxborderfade,
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
    imageContainer:{
    },
    imageContainerSelected:{
      backgroundColor: colorPalette.bluedarkerdarker,
    },
    bottomImage: {
      margin: 10,
      width: 30,
      height: 30,
      tintColor: colorPalette.beigedark,
    },
    bottomImageSelected:{
      tintColor: colorPalette.bluelight,
    },
    doneImage:{
      tintColor: t.doneicontint,
    },
    cancelImage:{
      tintColor: t.cancelicontint,
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
        <PressImage pressStyle={currentView === Views.UserView? s.imageContainerSelected:s.imageContainer} style={[s.bottomImage, s.cancelImage, user&&s.doneImage]} onPress={() => onChangeToList(Views.UserView)} source={require('../../public/images/user.png')}></PressImage>
        {/* <PressImage pressStyle={currentView === Views.DevView? s.imageContainerSelected:s.imageContainer} style={[s.bottomImage, {tintColor:'beige'}]} onPress={() => onChangeToList(Views.DevView)} source={require('../../public/images/dev.png')}></PressImage> */}
        {user?
          <>
            {!isSyncing && isLambdaCold && <PressImage pressStyle={s.imageContainer} style={[s.bottomImage, s.bottomImageSelected]} onPress={()=>{}} source={require('../../public/images/cold.png')}></PressImage>}
            {isSyncing &&  !isLambdaCold && <Loading style={s.loadingImage} theme={dark}></Loading>}
            {!isSyncing && !isLambdaCold && <PressImage pressStyle={s.imageContainer} style={[s.bottomImage, failedSync&&s.cancelImage, doneSync&&s.doneImage]} onPress={syncObjectivesList} source={require('../../public/images/sync.png')}></PressImage>}
          </>
          :
          <PressImage pressStyle={s.imageContainer} style={s.bottomImage} onPress={syncObjectivesList} source={require('../../public/images/cloud-offline.png')}></PressImage>
        }
      </View>
      <View style={s.rightContainer}>
        <PressImage pressStyle={[s.imageContainer, currentView === Views.ArchivedView && s.imageContainerSelected]} style={[s.bottomImage, currentView === Views.ArchivedView && s.bottomImageSelected]} textStyle={s.textImage} onPress={changeToArchivedView} source={require('../../public/images/archived.png')} ></PressImage>
        {/* <PressImage pressStyle={currentView === Views.TagsView? s.imageContainerSelected:s.imageContainer} style={[s.bottomImage]} textStyle={s.textImage} onPress={changeToTagView} source={require('../../public/images/tag.png')} text={getTagImageText()}></PressImage> */}
        <PressImage pressStyle={[s.imageContainer, currentView === Views.ListView && s.imageContainerSelected]} style={[s.bottomImage, currentView === Views.ListView&&s.bottomImageSelected]} onPress={changeToListView} source={require('../../public/images/list.png')}></PressImage>
      </View>
    </View>
  );
};

export default BottomBar;