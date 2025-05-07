import { View, StyleSheet, FlatList, Text, Vibration, BackHandler, Pressable } from "react-native";
import { ThemePalette, colorPalette, getObjTheme } from "../Colors";
import { FontPalette } from "../../fonts/Font";
import { useUserContext } from "../Contexts/UserContext";
import React, { JSX, useEffect, useState } from "react";
import { useLogContext } from "../Contexts/LogContext";
import { useStorageContext } from "../Contexts/StorageContext";

export interface TagsViewProps {
}
const TagsView = (props: TagsViewProps) => {
  const { log } = useLogContext();
  const { storage } = useStorageContext();
  const { 
    theme: t,
    fontTheme: f,
    objectives,
    user, userPrefs,
    selectedTags, putSelectedTags, removeSelectedTags,
  } = useUserContext();

  const [tags, setTags] = useState<string[]>([]);

  useEffect(()=>{
    let currentTags:string[] = [];
    for(let i = 0; i < objectives.length; i++){
      currentTags = [...currentTags, ...objectives[i].Tags];
    }
    const uniqueTags = Array.from(new Set(currentTags)).sort((a, b) => a.localeCompare(b));
    setTags(uniqueTags);
  },[]);

  useEffect(()=>{
    let currentTags:string[] = [];
    for(let i = 0; i < objectives.length; i++){
      currentTags = [...currentTags, ...objectives[i].Tags];
    }
    const uniqueTags = Array.from(new Set(currentTags)).sort((a, b) => a.localeCompare(b));
    setTags(uniqueTags);
  }, [objectives]);

  const selectUnselectedTag = (tag: string) => {
    const isSelected = selectedTags.some(obj => obj === tag);
    if(isSelected){
      removeSelectedTags([tag]);
    }
    else{
      putSelectedTags([tag]);
    }
  }

  const getTagView = (item: string):JSX.Element => {
    const isSelected = selectedTags.some(obj => obj === item);
    return <Text key={item} style={[s.tag, isSelected? s.tagSelected:undefined]} onPress={()=>selectUnselectedTag(item)}>{item}</Text>
  }

  const getTagsListView = ()=> {
    if(tags.length === 0) return <Text style={s.textEmpty}>No tags</Text>

    return (
      tags.map((item)=>{
        const isSelected = selectedTags.some(obj => obj === item);
        return <Text key={item} style={[s.tag, isSelected? s.tagSelected:undefined]} onPress={()=>selectUnselectedTag(item)}>{item}</Text>
      })
    )
  }

  const s = StyleSheet.create({
    container: {
      alignItems:"flex-end",
      justifyContent: 'flex-end',
      height: '100%',
      backgroundColor: t.backgroundcolordarker,
    },
    textEmpty:{
      flex:1,
      height: '100%',
      color: 'beige',
      textAlign: 'center',
      verticalAlign: 'middle',
    },
    containerBottom: {
      flexDirection: 'row',
      flexWrap: "wrap",
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: t.backgroundcolor,
      minHeight: 45,
      margin: 10,

      borderRadius: 5,
      borderColor: t.boxborderfade,
      borderWidth: 1,
      borderStyle: 'solid',
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
    tag: {
      flexGrow: 1,
      minHeight: 45,
      minWidth: 45,
      textAlign: 'center',
      verticalAlign: 'middle',
      color: 'grey',
      fontWeight: 'bold',
      margin: 5,
      padding: 5,

      borderColor: t.boxborderfade,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 5,
    },
    tagSelected:{
      color: 'beige',
      borderColor: t.boxborder,
      borderWidth: 1,
      borderStyle: 'solid',
    },
  });

  return (
    <View style={s.container}>
      <View
        style={s.containerBottom}
        pointerEvents="box-none">
        {getTagsListView()}
      </View>
    </View>
  );
};

export default TagsView;