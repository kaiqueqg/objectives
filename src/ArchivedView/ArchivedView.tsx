import { View, StyleSheet, FlatList, Text, Vibration, BackHandler, Pressable } from "react-native";
import { AppPalette, colorPalette, getObjTheme, globalStyle as gs } from "../Colors";
import { FontPalette } from "../../fonts/Font";
import { useUserContext } from "../Contexts/UserContext";
import PressText from "../PressText/PressText";
import { Objective, Pattern, Views } from "../Types";
import PressImage from "../PressImage/PressImage";
import DragList, { DragListRenderItemInfo } from "react-native-draglist";
import React, { DO_NOT_USE_OR_YOU_WILL_BE_FIRED_CALLBACK_REF_RETURN_VALUES, JSX, useEffect, useState } from "react";
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
    currentObjectiveId,
    objectives,
    writeCurrentView,
    writeCurrentObjectiveId,
    putObjective,
    selectedTags, writeSelectedTags, putSelectedTags, removeSelectedTags,
    userPrefs,
  } = useUserContext();

  const [archivedObjectives, setArchivedObjectives] = useState<Objective[]>([]);
  const [archivedTags, setArchivedTags] = useState<string[]>([]);

  useEffect(()=>{
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if(currentObjectiveId) {
        writeCurrentView(Views.IndividualView);
      }
      else{
        if(userPrefs.vibrate) Vibration.vibrate(Pattern.Wrong);
      }
      return true;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(()=>{
    const archivedObjectives = objectives.filter(obj => obj.IsArchived);
    setArchivedObjectives(archivedObjectives);

    let archivedTags = archivedObjectives.map(obj => obj.Tags).flat();
    const uniqueArchivedTags = Array.from(new Set(['Pin', ...archivedTags]));
    setArchivedTags(uniqueArchivedTags);
  }, [objectives, selectedTags]);

  const onSelectCurrentObj = async (id: string) => {
    await writeCurrentObjectiveId(id);
      await writeCurrentView(Views.IndividualView);
  }

  const unarchiveObjective = async (obj: Objective) => {
    await putObjective({...obj, IsArchived: false, LastModified: (new Date()).toISOString() });
  }

  const selectUnselectedTag = (tag: string) => {
    const isSelected = selectedTags.some(obj => obj === tag);
    if(isSelected){
      removeSelectedTags([tag]);
    }
    else{
      putSelectedTags([tag]);
    }
  }

  const getTagButton = ({item}:any):JSX.Element|null=> {
    return(
      <PressText 
        style={[s.tagButtonContainer, selectedTags.some(tag => tag === item)? s.tagButtonContainerSelected:undefined]}
        textStyle={[s.text, selectedTags.some(tag => tag === item)? s.textSelected:undefined]}
        onPress={() => selectUnselectedTag(item)}
        text={item}></PressText>
    )
  }

  const getArchivedButton = ({item}:any):JSX.Element|null => {
    const tagShow: boolean = item.Tags.length > 0 ?
      selectedTags.some((tag) => item.Tags.includes(tag)) 
      : 
      true;
    if(!tagShow) return null;

    return (
      <View style={[s.objectiveContainer]} onTouchEnd={() => {}}>
        <PressImage
          onPress={()=>unarchiveObjective(item)}
          style={s.image}
          pressStyle={gs.baseImageContainer}
          source={require('../../public/images/unarchive.png')}
          confirm={true}
        ></PressImage>
        <PressText 
          style={[s.objectiveButtonContainer, {backgroundColor: getObjTheme(userPrefs.theme ,item.Theme).objbk}]}
          textStyle={[s.text, {color: getObjTheme(userPrefs.theme ,item.Theme).objtitle}]}
          onPress={() => onSelectCurrentObj(item.ObjectiveId)}
          text={item.Title}>
        </PressText>
      </View>
    )
  }

  const s = StyleSheet.create({
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
    },
    containerListTag:{
      flexDirection: "column",
      width: '40%',
    },
    containerListObjs:{
      flexDirection: "column",
      width: '60%',

      borderColor: colorPalette.beigedark,
      borderLeftWidth: 1,
      borderStyle: 'solid',
    },
    containerListTitle:{
      fontWeight: 'bold',
      color: t.textcolor,
      backgroundColor: t.backgroundcolordarker,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: 10,
    },
    tagsList:{
      height: '100%',
      paddingVertical: 15,
      paddingHorizontal: 15,
    },
    objectivesList:{
      height: '100%',
      paddingVertical: 15,
      paddingHorizontal: 15,
    },
    tagButtonContainer:{
      display:'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 40,
      marginBottom: 5,

      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      borderTopRightRadius: 50,
      borderBottomRightRadius: 50,
      borderColor: t.bordercolorfade,
      borderWidth: 1,
      borderStyle: 'solid',
      
    },
    tagButtonContainerSelected:{
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: t.backgroundcolordarker,
      borderColor: t.bordercolorfade,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 5,
    },
    text: {
      fontSize: 16,
      color: t.textcolor,
    },
    textSelected:{
      color: t.textcolor,
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
      tintColor: t.icontint,
    },
    objectiveContainer:{
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5,
    },
    objectiveButtonContainer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 50,

      borderColor: t.bordercolorfade,
      borderWidth: 1,
      borderStyle: 'solid',
    },
  });

  return (
    <View style={s.container}>
      <View style={s.containerListTag}>
        <Text style={s.containerListTitle}>TAGS</Text>
        <FlatList style={s.tagsList} data={archivedTags} keyExtractor={(tag:string) => 'tag'+tag} renderItem={getTagButton} ListFooterComponent={<View style={{ height: 300 }} />}/>
      </View>
      <View style={s.containerListObjs}>
        <Text style={s.containerListTitle}>ARCHIVED OBJS</Text>
        <FlatList style={s.objectivesList} data={archivedObjectives} keyExtractor={(obj: Objective)=> obj.ObjectiveId} renderItem={getArchivedButton} ListFooterComponent={<View style={{ height: 300 }}/>}/>
      </View>
    </View>
  );
};

export default ArchivedView;