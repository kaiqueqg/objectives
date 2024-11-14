import { View, StyleSheet, FlatList, Text, Vibration, BackHandler, Pressable } from "react-native";
import { ThemePalette, colorPalette, getObjTheme } from "../Colors";
import { FontPalette } from "../../fonts/Font";
import { useUserContext } from "../Contexts/UserContext";
import PressText from "../PressText/PressText";
import { Objective, Pattern, Views } from "../Types";
import PressImage from "../PressImage/PressImage";
import DragList, { DragListRenderItemInfo } from "react-native-draglist";
import React, { useEffect, useState } from "react";
import { useLogContext } from "../Contexts/LogContext";
import { useStorageContext } from "../Contexts/StorageContext";

export interface ObjsListViewProps {
}
const ObjsListView = (props: ObjsListViewProps) => {
  const { log } = useLogContext();
  const { storage } = useStorageContext();
  const { 
    theme: t,
    fontTheme: f,
    objectives,
    putObjective,
    putObjectives,
    currentObjectiveId,
    writeCurrentObjectiveId, deleteCurrentObjectiveId,
    writeCurrentView,
    user, userPrefs,
  } = useUserContext();

  const [myObjectives, setMyObjectives] = useState<Objective[]>([]);
  const [isEditingPos, setIsEditingPos] = useState<boolean>(false);

  useEffect(()=>{
    const sortedObjs = objectives.sort((a: Objective, b: Objective) => a.Pos - b.Pos);
    setMyObjectives(sortedObjs);
  }, [objectives]);

  const onSelectCurrentObj = async (id: string) => {
    await writeCurrentObjectiveId(id);
    await writeCurrentView(Views.IndividualView);
  }

  const onSelectAllObjs = async () => {
    await deleteCurrentObjectiveId();
    await writeCurrentView(Views.AllView);
  }

  const onAddNewObjective = async () => {
    if(!user){ 
      Vibration.vibrate(Pattern.Wrong);
      return log.err('No user.');
    }
    
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    const newObj: Objective = {
      UserId: user.UserId,
      ObjectiveId: storage.randomId(), 
      Done: false, 
      Theme: 'noTheme', 
      Title: 'Title', 
      IsOpen: true,
      Pos: myObjectives.length,
      LastModified: (new Date()).toISOString(),
      IsShowingCheckedGrocery: true,
      IsShowingCheckedStep: true,
    };
    await putObjective(newObj);

    writeCurrentObjectiveId(newObj.ObjectiveId);
  }

  const keyExtractor = (obj: Objective) => {
    return obj.ObjectiveId;
  }

  const onReordered = async (fromIndex: number, toIndex: number) => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    const copy = [...myObjectives];
    const [removed] = copy.splice(fromIndex, 1);

    copy.splice(toIndex, 0, removed);
    const updateObjectives = copy.map((obj, index) => ({
      ...obj,
      Pos: index,
      LastModified: (new Date()).toISOString(),
    }));
    updateObjectives.forEach((item: any)=>{
    })
    const sortedObjs = updateObjectives.sort((a: Objective, b: Objective) => a.Pos - b.Pos);
    sortedObjs.forEach((item: any)=>{
    })
    await putObjectives(sortedObjs);
  }

  const onChangePos = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    setIsEditingPos(!isEditingPos);
  }
  
  const getObjectiveButton = (info: DragListRenderItemInfo<Objective>) => {
    const {item, onDragStart, onDragEnd, isActive} = info;
    return (
      <View style={s.objectiveContainer}>
        <PressText 
          style={[s.objectiveButtonContainer, {backgroundColor: getObjTheme(item.Theme).objbk}, isActive? {borderColor: 'red'}:undefined]}
          textStyle={{color: getObjTheme(item.Theme).objtitle}}
          onPress={() => onSelectCurrentObj(item.ObjectiveId)}
          text={item.Title}></PressText>
      </View>
    )
  };

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
      width: '90%',
      backgroundColor: t.backgroundcolor,
      zIndex: 10,
    },
    list:{
      flex: 1,
      width: '100%',
    },
    topMenu: {
      width: '100%',
      height: 50,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    allTextContainer:{
      width: 100,
      height: 30,
      marginTop: 5,
      marginBottom: 5,
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'grey',
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 5,
    },
    allText:{
      color: 'white',
    },
    imageContainer:{
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image:{
      width: 20,
      height: 20,
      tintColor: colorPalette.beige,
    },
    imageUpDown:{
      width: 20,
      height: 20,
      tintColor: colorPalette.beige,
    },
    objectiveContainer:{
      flexDirection: 'row',
    },
    objectiveButtonContainer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',

      minHeight: 50,
      marginHorizontal: 10,
      marginVertical: 5,

      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 5,
      borderColor: 'black',
    },
    text: {
      color: 'red',
      fontWeight: 'bold',
    },
    textDark:{
      color: 'black',
      fontWeight: 'bold',
    },
    imageMoveContainer:{
      justifyContent: 'center',
      alignItems: 'center',
      width: 50,
      marginVertical: 5,
      marginRight: 10,
    },
    imageMove:{
      height: 20,
      width: 20,
      tintColor: t.icontint,
    },
  });

  return (
    <View style={s.container} onTouchEnd={()=>{writeCurrentView(Views.IndividualView);}}>
      <View style={s.containerSide}>
        <View style={s.topMenu}>
          <PressImage onPress={onChangePos} style={s.imageUpDown} pressStyle={s.imageContainer} source={require('../../public/images/updown.png')}></PressImage>
          {isEditingPos?
            <PressImage onPress={()=>{}} style={[s.image, {tintColor: t.icontintfade}]} pressStyle={s.imageContainer} source={require('../../public/images/add.png')}></PressImage>
            :
            <PressImage onPress={onAddNewObjective} style={s.image} pressStyle={s.imageContainer} source={require('../../public/images/add.png')}></PressImage>
          }
        </View>
        <DragList
          containerStyle={s.list}
          data={myObjectives}
          keyExtractor={keyExtractor}
          onReordered={onReordered}
          renderItem={getObjectiveButton}
        />
      </View>
    </View>
  );
};

export default ObjsListView;