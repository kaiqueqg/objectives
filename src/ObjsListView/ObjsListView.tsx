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
    writeCurrentObjectiveId,
    writeCurrentView,
    user, userPrefs,
    selectedTags,
  } = useUserContext();

  const [isEditingPos, setIsEditingPos] = useState<boolean>(false);
  const [isEndingPos, setIsEndingPos] = useState<boolean>(false);
  const [objectivesSelected, setObjectivesSelected] = useState<Objective[]>([]);

  useEffect(()=>{
  }, [objectives, selectedTags]);

  const onSelectCurrentObj = async (id: string) => {
    if(!isEditingPos) {
      await writeCurrentObjectiveId(id);
      await writeCurrentView(Views.IndividualView);
    }
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
      IsShowing: true,
      IsArchived: false,
      Pos: objectives.length,
      LastModified: (new Date()).toISOString(),
      IsShowingCheckedGrocery: true,
      IsShowingCheckedStep: true,
      IsShowingCheckedExercise: true,
      IsShowingCheckedMedicine: true,
      Tags: [],
    };
    await putObjective(newObj);

    onSelectCurrentObj(newObj.ObjectiveId);
  }

  const keyExtractor = (obj: Objective) => {
    return obj.ObjectiveId;
  }

  const startEditingPos = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    setIsEditingPos(true);
  }

  const cancelEditingPos = () => {
    setObjectivesSelected([]);
    setIsEditingPos(false);
    setIsEndingPos(false);
  }

  const onEditingPosTo = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    setIsEndingPos(true);
  }

  const addRemoveToSelected = (obj: Objective) => {
    const filteredList = objectivesSelected.filter((o) => o.ObjectiveId !== obj.ObjectiveId);

    if(filteredList.length !== objectivesSelected.length){
      setObjectivesSelected(filteredList);
    }
    else{
      setObjectivesSelected([...objectivesSelected, obj]);
    }
  }

  const endChangingPos = (itemTo: Objective) => {
    const newList = objectives.filter((o: Objective) => !objectivesSelected.includes(o));
    const index = newList.indexOf(itemTo);
    const before = newList.slice(0, index+1);
    const after = newList.slice(index+1);

    let ajustedList = [...before, ...objectivesSelected, ...after];

    let finalList:Objective[] = [];
    for(let i = 0; i < ajustedList.length; i++){
      finalList.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
    }

    //setMyObjectives(finalList); test
    putObjectives(finalList);

    cancelEditingPos();
  }

  const getFakeMinusOneObjective = () => {
    const obj: Objective = {
      UserId: '',
      ObjectiveId: '' ,
      Done: false, 
      Theme: 'noTheme', 
      Title: 'Title', 
      IsShowing: true,
      IsArchived: false,
      Pos: -1,
      LastModified: (new Date()).toISOString(),
      IsShowingCheckedGrocery: true,
      IsShowingCheckedStep: true,
      Tags: [],
    }
    return obj;
  }

  const getListView = () => {
    let rtn
    // let filteredObjectives = objectives.filter((o=>o.Tags.includes()))
    return(
      <FlatList
          //containerStyle={s.list}
          data={objectives}
          keyExtractor={keyExtractor}
          renderItem={getObjectiveButton}
        />
    )
  }
  
  const getObjectiveButton = ({item}:any):JSX.Element|null => {
    const tagShow: boolean = item.Tags.length > 0 
    ? selectedTags.some((tag) => item.Tags.includes(tag)) 
    : true;

  // Skip rendering if the tag doesn't match
    if(!tagShow) return null;
    if(item.IsArchived) return null;

    const isSelected = objectivesSelected.some(obj => obj === item);
    return (
      item.Pos === 0 && isEndingPos?
      <>
      <View style={[s.objectiveButtonContainerFake]} onTouchEnd={()=>endChangingPos(getFakeMinusOneObjective())}>
        <Text style={s.objectiveButtonContainerFakeText}>click to be the first</Text>
      </View>
      <View 
        style={[s.objectiveContainer]} 
        onTouchEnd={() => {isEditingPos && (isEndingPos? endChangingPos(item) : addRemoveToSelected(item))}}>
        <PressText 
          style={[s.objectiveButtonContainer, 
            isEditingPos && isSelected? s.objectiveButtonContainerSelected:undefined,
            isEndingPos && isSelected? s.objectiveButtonContainerEnding:undefined]}
          textStyle={[s.text, {color: getObjTheme(item.Theme).objtitle}]}
          onPress={() => onSelectCurrentObj(item.ObjectiveId)}
          text={item.Title + item.Pos}></PressText>
      </View>
      </>
      :
      <View 
        style={[s.objectiveContainer]} 
        onTouchEnd={() => {isEditingPos && (isEndingPos? endChangingPos(item) : addRemoveToSelected(item))}}>
        <PressText 
          style={[s.objectiveButtonContainer, 
            isEditingPos && isSelected? s.objectiveButtonContainerSelected:undefined,
            isEndingPos && isSelected? s.objectiveButtonContainerEnding:undefined,
            {backgroundColor: getObjTheme(item.Theme).objbk}]}
          textStyle={[s.text, {color: getObjTheme(item.Theme).objtitle}]}
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
    bottomMenu: {
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
      borderWidth: 1,
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
    <>
      <View style={s.container} onTouchEnd={() => {writeCurrentView(Views.IndividualView);}}>
      </View>
      <View
        style={s.containerSide}
        pointerEvents="box-none">
        {getListView()}
        <View style={s.bottomMenu}>
          {!isEditingPos && <PressImage
            onPress={startEditingPos}
            style={s.imageUpDown}
            pressStyle={s.imageContainer}
            source={require('../../public/images/updown.png')}
          ></PressImage>}
          {isEditingPos && <PressImage pressStyle={s.imageContainer} style={s.image} onPress={cancelEditingPos} source={require('../../public/images/cancel.png')}></PressImage>}
          {isEditingPos && <PressImage pressStyle={s.imageContainer} hide={objectivesSelected.length=== 0 || objectivesSelected.length === objectives.length || isEndingPos} style={s.image} onPress={onEditingPosTo} source={require('../../public/images/arrow-right-filled.png')}></PressImage>}
          {isEditingPos ? (
            <PressImage
              onPress={() => {}}
              style={[s.image, { tintColor: t.icontintfade }]}
              pressStyle={s.imageContainer}
              source={require('../../public/images/add.png')}
            ></PressImage>
          ) : (
            <PressImage
              onPress={onAddNewObjective}
              style={s.image}
              pressStyle={s.imageContainer}
              source={require('../../public/images/add.png')}
            ></PressImage>
          )}
        </View>
      </View>
    </>
  );
};

export default ObjsListView;