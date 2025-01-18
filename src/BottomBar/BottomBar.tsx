import { View, StyleSheet, Text, Vibration, Alert } from "react-native";
import { ThemePalette, colorPalette, dark } from "../Colors";
import { FontPalette } from "../../fonts/Font";
import { Pattern, Views } from "../Types";
import PressImage from "../PressImage/PressImage";
import { useUserContext } from "../Contexts/UserContext";
import Loading from "../Loading/Loading";
import { useLogContext } from "../Contexts/LogContext";
import React, { useEffect } from "react";

export interface BottomBarProps {
  isSyncing: boolean,
  doneSync: boolean,
  failedSync: boolean,
  isServerUp: boolean,
  syncObjectivesList: () => void,
}

const BottomBar = (props: BottomBarProps) => {
  const { user, userPrefs, theme: t, fontTheme: f, currentView, writeCurrentView, availableTags, selectedTags } = useUserContext();
  const { log } = useLogContext();

  const { isSyncing, doneSync, failedSync, syncObjectivesList } = props;

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
      backgroundColor: t.backgroundcolordark,
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
      borderColor: '#00000000',
      borderTopWidth: 1,
      borderStyle: 'solid',
    },
    imageContainerSelected:{
      borderColor: 'beige',
      borderTopWidth: 1,
      borderStyle: 'solid',
    },
    bottomImage: {
      margin: 10,
      width: 30,
      height: 30,
    },
    offImage:{
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
        <PressImage pressStyle={currentView === Views.UserView? s.imageContainerSelected:s.imageContainer} style={[s.bottomImage, {tintColor: user? t.doneicontint:t.cancelicontint}]} onPress={() => onChangeToList(Views.UserView)} source={require('../../public/images/user.png')}></PressImage>
        {/* <PressImage pressStyle={currentView === Views.DevView? s.imageContainerSelected:s.imageContainer} style={[s.bottomImage, {tintColor:'beige'}]} onPress={() => onChangeToList(Views.DevView)} source={require('../../public/images/dev.png')}></PressImage> */}
        {user?
          <>
            {isSyncing?
              <Loading style={s.loadingImage} theme={dark}></Loading>
              :
              <PressImage pressStyle={s.imageContainer} style={[s.bottomImage, doneSync?{tintColor: t.doneicontint}:(failedSync?{tintColor: t.cancelicontint}:{tintColor:'beige'})]} onPress={syncObjectivesList} source={require('../../public/images/sync.png')}></PressImage>
            }
          </>
          :
          <PressImage pressStyle={s.imageContainer} style={s.bottomImage} onPress={syncObjectivesList} source={require('../../public/images/cloud-offline.png')}></PressImage>
        }
      </View>
      <View style={s.rightContainer}>
        <PressImage pressStyle={currentView === Views.ArchivedView? s.imageContainerSelected:s.imageContainer} style={[s.bottomImage]} textStyle={s.textImage} onPress={changeToArchivedView} source={require('../../public/images/archived.png')} ></PressImage>
        <PressImage pressStyle={currentView === Views.TagsView? s.imageContainerSelected:s.imageContainer} style={[s.bottomImage]} textStyle={s.textImage} onPress={changeToTagView} source={require('../../public/images/tag.png')} text={getTagImageText()}></PressImage>
        <PressImage pressStyle={currentView === Views.ListView? s.imageContainerSelected:s.imageContainer} style={s.bottomImage} onPress={changeToListView} source={require('../../public/images/list.png')}></PressImage>
      </View>
    </View>
  );
};

export default BottomBar;