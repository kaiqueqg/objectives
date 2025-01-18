import { View, StyleSheet, FlatList, Text, Vibration, BackHandler, Pressable } from "react-native";
import { ThemePalette, colorPalette, getObjTheme } from "../Colors";
import { FontPalette } from "../../fonts/Font";
import { useUserContext } from "../Contexts/UserContext";
import PressText from "../PressText/PressText";
import { Objective, Pattern, Views } from "../Types";
import PressImage from "../PressImage/PressImage";
import DragList, { DragListRenderItemInfo } from "react-native-draglist";
import React, { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES, useEffect, useState } from "react";
import { useLogContext } from "../Contexts/LogContext";
import { useStorageContext } from "../Contexts/StorageContext";

export interface ArchivedViewProps {
}
const ArchivedView = (props: ArchivedViewProps) => {
  const { log } = useLogContext();
  const { storage } = useStorageContext();
  const { 
    theme: t,
    fontTheme: f,
    objectives,
    writeCurrentView,
    writeCurrentObjectiveId,
    putObjective,
    selectedTags,
  } = useUserContext();

  useEffect(()=>{
  }, [objectives, selectedTags]);

  const keyExtractor = (obj: Objective) => {
    return obj.ObjectiveId;
  }

  const onSelectCurrentObj = async (id: string) => {
    await writeCurrentObjectiveId(id);
      await writeCurrentView(Views.IndividualView);
  }

  const unarchiveObjective = async (obj: Objective) => {
    await putObjective({...obj, IsArchived: false, LastModified: (new Date()).toISOString() });
  }

  const getArchivedList = ({item}:any):JSX.Element|null => {
    if(item.IsArchived){
      return (
      <View style={[s.objectiveContainer]} onTouchEnd={() => {}}>
        <PressImage
          onPress={()=>unarchiveObjective(item)}
          style={s.image}
          pressStyle={s.imageContainer}
          source={require('../../public/images/unarchive.png')}
          confirm={true}
        ></PressImage>
        <PressText 
          style={[s.objectiveButtonContainer, {backgroundColor: getObjTheme(item.Theme).objbk}]}
          textStyle={[s.text, {color: getObjTheme(item.Theme).objtitle}]}
          onPress={() => onSelectCurrentObj(item.ObjectiveId)}
          text={item.Title}>
        </PressText>
      </View>)
    }

    return null;
  }

  const s = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 10,
    },
    containerSide: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      width: '80%',
      margin: 10,
      borderRadius: 5,
      borderColor: t.boxborderfade,
      borderWidth: 1,
      borderStyle: 'solid',
      backgroundColor: t.backgroundcolor,
      zIndex: 10,
    },
    list:{
      flex: 1,
      width: '100%',
    },
    imageContainer:{
      width: 50,
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image:{
      width: 20,
      height: 20,
      tintColor: colorPalette.beige,
    },
    objectiveContainer:{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5,
    },
    objectiveButtonContainerFake:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',

      minHeight: 50,
      marginHorizontal: 10,
      marginVertical: 5,

      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: 'gray',
      borderRadius: 5,
    },
    objectiveButtonContainerFakeText:{
      color: 'beige',
    },
    objectiveButtonContainer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 50,
    },
    objectiveButtonContainerSelected:{
      borderStyle: 'dashed',
      borderColor: 'red',
    },
    objectiveButtonContainerEnding:{
      borderStyle: 'solid',
      borderColor: 'red',
    },
    text: {
      fontSize: 16,
    },
  });

  return (
    <>
      <View style={s.container} onTouchEnd={() => {writeCurrentView(Views.IndividualView);}}>
      </View>
      <View
        style={s.containerSide}
        pointerEvents="box-none">
        <FlatList
          data={objectives}
          keyExtractor={keyExtractor}
          renderItem={getArchivedList}
        />
      </View>
    </>
  );
};

export default ArchivedView;