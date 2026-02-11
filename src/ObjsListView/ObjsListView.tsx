import { View, StyleSheet, FlatList, Text, Vibration, BackHandler, Pressable, TextInput, Image } from "react-native";
import { AppPalette, colorPalette, getObjTheme, globalStyle as gs } from "../Colors";
import { FontPalette } from "../../fonts/Font";
import { useUserContext } from "../Contexts/UserContext";
import PressText from "../PressText/PressText";
import { MessageType, Objective, Pattern, Views } from "../Types";
import PressImage from "../PressImage/PressImage";
import React, { JSX, useEffect, useRef, useState } from "react";
import { useLogContext } from "../Contexts/LogContext";
import { useStorageContext } from "../Contexts/StorageContext";

export interface ObjsListViewProps {
}
const ObjsListView = (props: ObjsListViewProps) => {
  const { log, popMessage, messageList } = useLogContext();
  const { storage } = useStorageContext();
  const { 
    theme: t,
    fontTheme: f,
    currentObjectiveId,
    objectives,
    putObjective,
    putObjectives,
    writeCurrentObjectiveId,
    writeCurrentView,
    availableTags, selectedTags, putSelectedTags, removeSelectedTags, writeSelectedTags,
    user, userPrefs, writeUserPrefs,
  } = useUserContext();

  const [isEditingPos, setIsEditingPos] = useState<boolean>(false);
  const [isEndingPos, setIsEndingPos] = useState<boolean>(false);
  const [objectivesSelected, setObjectivesSelected] = useState<Objective[]>([]);
  const [unarchivedObjectives, setUnarchivedObjectives] = useState<Objective[]>([]);
  const [unarchivedTags, setUnarchivedTags] = useState<string[]>([]);

  const [isTagsListFolded, setIsTagsListFolded] = useState<boolean>(false);
  const [isObjectiveListFolded, setIsObjectiveListFolded] = useState<boolean>(false);

  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [objsSearchToShow, setObjsSearchToShow] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [searchNoItemFound, setSearchNoItemFound] = useState<boolean>(false);

  const [isSortMenuOpen, setIsSortMenuOpen] = useState<boolean>(false);

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

  useEffect(() => {

  }, [messageList])

  useEffect(()=>{
    const unarchivedObjectives = objectives.filter(obj => !obj.IsArchived);
    setUnarchivedObjectives(unarchivedObjectives);

    let unarchivedTags = unarchivedObjectives.map(obj => obj.Tags).flat();
    const uniqueUnarchivedTags = Array.from(new Set(['Pin', ...unarchivedTags]));
    setUnarchivedTags(uniqueUnarchivedTags);
  }, [objectives, availableTags, selectedTags]);

  const onSelectCurrentObj = async (id: string) => { 
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    if(!isEditingPos) {
      await writeCurrentObjectiveId(id);
      await writeCurrentView(Views.IndividualView);
    }
  }

  const onAddNewObjective = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    const newObj: Objective = {
      UserId: user? user.UserId:'fakeuseridfakeuseridfakeuseridfakeuserid',
      ObjectiveId: storage.randomId(),
      Done: false,
      Theme: 'noTheme',
      Title: 'Title',
      IsShowing: true,
      IsArchived: false,
      IsLocked: false,
      Pos: objectives.length,
      LastModified: (new Date()).toISOString(),
      CreatedAt: (new Date()).toISOString(),
      IsShowingCheckedGrocery: true,
      IsShowingCheckedStep: true,
      IsShowingCheckedExercise: true,
      IsShowingCheckedMedicine: true,
      Tags: [],
    };
    await putObjective(newObj);

    onSelectCurrentObj(newObj.ObjectiveId);
  }

  const objKeyExtractor = (obj: Objective) => {
    return obj.ObjectiveId;
  }

  const startEditingPos = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    setIsEditingPos(true);
  }

  const cancelEditingPos = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

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
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    
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
      IsLocked: false,
      Pos: -1,
      LastModified: (new Date()).toISOString(),
      CreatedAt: (new Date()).toISOString(),
      IsShowingCheckedGrocery: true,
      IsShowingCheckedStep: true,
      Tags: [],
    }
    return obj;
  }

  const selectUnselectedTag = (tag: string) => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    if(tag.trim() !== 'Pin') {
      if(userPrefs.singleTagSelected) {
        writeSelectedTags([tag]);
      }
      else{
        const isSelected = selectedTags.some(obj => obj === tag);
        if(isSelected){
          removeSelectedTags([tag]);
        }
        else{
          putSelectedTags([tag]);
        }
      }
    }
    else{
      if(userPrefs.vibrate) Vibration.vibrate(Pattern.Wrong);
      popMessage(`You can't unselect "Pin" tag.`, MessageType.Error, 3);
    }
  }

  const selectAllTags = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    writeSelectedTags(availableTags);
  }

  const unselectAllTags = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    
    writeSelectedTags(['Pin']);
  }

  const getObjectiveButton = ({item}:any):JSX.Element|null => {
    const tagShow: boolean = item.Tags.length > 0 
    ? selectedTags.some((tag) => item.Tags.includes(tag)) 
    : true;

    const matchingTags = selectedTags.filter(tag => item.Tags.includes(tag));
    const shouldShowTag =  matchingTags.length === 1 && matchingTags[0] === 'Pin';

    if(!tagShow) return null;
    if(item.IsArchived) return null;

    const isSelected = objectivesSelected.some(obj => obj === item);

    const objTheme = getObjTheme(userPrefs.theme, item.Theme)
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
            textStyle={[s.text]}
            onPress={() => onSelectCurrentObj(item.ObjectiveId)}
            text={item.Title}
            defaultStyle={objTheme}></PressText>
        </View>
      </>
      :
      <View style={[s.objectiveContainer]} onTouchEnd={() => {isEditingPos && (isEndingPos? endChangingPos(item) : addRemoveToSelected(item))}}>
        {shouldShowTag && <Image style={[s.objectivePin]} source={require('../../public/images/pin.png')} />}
        <PressText 
          style={[s.objectiveButtonContainer, 
            isEditingPos && isSelected? s.objectiveButtonContainerSelected:undefined, 
            isEndingPos && isSelected? s.objectiveButtonContainerEnding:undefined, 
            {backgroundColor: objTheme.objbk}]}
          textStyle={[s.text, {color: objTheme.objtitle}]}
          onPress={() => onSelectCurrentObj(item.ObjectiveId)}
          defaultStyle={objTheme}
          defaultText="?"
          hideDefaultTextBorder={true}
          ellipsizeMode={"middle"}
          text={item.Title}></PressText>
      </View>
    )
  };

  const changeSingleTag = () => {
    writeUserPrefs({...userPrefs, singleTagSelected: !userPrefs.singleTagSelected})
  }

  const getObjectivesTitle = () => {
    return (
      <View style={s.containerListTagsTitle}>
        <View style={gs.baseImageContainer}></View>
        <Text style={s.containerObjectiveTitleText}>{'OBJECTIVES'}</Text>
        {isObjectiveListFolded?
          <PressImage onPress={()=>{setIsObjectiveListFolded(false)}} disable={isEditingPos} source={require('../../public/images/up-chevron.png')}></PressImage>
          :
          <PressImage onPress={()=>{setIsObjectiveListFolded(true)}} disable={isEditingPos} source={require('../../public/images/down-chevron.png')}></PressImage>
        }
      </View>
    )
  }

  const getObjectivesList = () => {
    if(isObjectiveListFolded) return <></>;

    let displayList: Objective[] = [];
    unarchivedObjectives.forEach((o:Objective) => {
      let shouldAddIsInSearch = true
      if(objsSearchToShow.length && !objsSearchToShow.includes(o.ObjectiveId)) shouldAddIsInSearch = false;
      
      if(shouldAddIsInSearch) displayList.push(o);
    });

    return (
      <FlatList style={s.objectivesList} data={displayList} keyExtractor={objKeyExtractor} renderItem={getObjectiveButton} ListFooterComponent={<View style={{ height: 300 }}/>}/>
    )
  }

  const getTagsList = () => {
    if(isTagsListFolded) return <></>;

    let listOfTags: JSX.Element[] = [
      <Text key={storage.randomId()} style={[s.tag, s.tagSpecial]} onPress={() => {selectAllTags()}}>{'All'}</Text>,
      <Text key={storage.randomId()} style={[s.tag, s.tagSpecial]} onPress={() => {unselectAllTags()}}>{'None'}</Text>,
      <Text key={'Pin'} style={[s.tag, s.tagSelected]} onPress={() => {selectUnselectedTag('Pin')}}>{'Pin'}</Text>,
    ];
    
    const availableTagsSorted = availableTags.sort((a, b) => {
      if (a === "Pin") return -1;
      if (b === "Pin") return 1;
      return a.localeCompare(b);
    });

    for(let i = 0; i < availableTagsSorted.length; i++){
      if(availableTagsSorted[i] !== 'Pin'){
        const isSelected = selectedTags.some(obj => obj === availableTagsSorted[i]);
        listOfTags.push(
          <Text key={availableTagsSorted[i]} style={[s.tag, isSelected? s.tagSelected:undefined]} onPress={()=>selectUnselectedTag(availableTagsSorted[i])}>{availableTagsSorted[i]}</Text>
        )
      }
    }
    return (
      <View style={s.tagList}>
        {listOfTags}
      </View>
    )
  }

  const getTagsTitle = () => {
    return (
      <View style={s.containerListTagsTitle}>
        <View style={gs.baseImageContainer}></View>
        <Text style={[s.containerTagTitleText]}>{'TAGS'}</Text>
        {isTagsListFolded?
          <PressImage disable={isEditingPos} source={require('../../public/images/up-chevron.png')} onPress={()=>{setIsTagsListFolded(false)}}/>
          :
          <PressImage disable={isEditingPos} source={require('../../public/images/down-chevron.png')} onPress={()=>{setIsTagsListFolded(false)}}/>
        }
      </View>
    )
  }

  const getMoveIcons = () => {
    return(
      <>
        {!isEditingPos && 
        <PressImage
          onPress={startEditingPos}
          disable={objectives.length < 2}
          colorDisabled={t.icontintfade}
          source={require('../../public/images/change.png')}
        ></PressImage>}
        {isEditingPos && <PressImage onPress={cancelEditingPos} source={require('../../public/images/cancel.png')} color={t.cancelicontint}></PressImage>}
        {isEditingPos && <PressImage hide={objectivesSelected.length=== 0 || isEndingPos} onPress={onEditingPosTo} source={require('../../public/images/next.png')}></PressImage>}
      </>
    )
  }

  const onSearchTextChange = (value: string) => {
    setSearchText(value);
    doSearchText(value.trim());
  }
  
  const onEraseSearch = () => {
    if(searchText.trim() === '' && userPrefs.vibrate) {
      Vibration.vibrate(Pattern.Wrong);
    } 
    else{
      if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
      setSearchText('');
      setObjsSearchToShow([]);
    }
  }

  const doSearchText = (search: string) => {
    let newList: string[] = [];
    objectives.forEach((o: Objective)=>{
      if(searchTextIgnoreCase(o.Title, search)) newList.push(o.ObjectiveId);
    });

    setSearchNoItemFound(newList.length === 0);

    setObjsSearchToShow(newList);
  }

  const searchTextIgnoreCase = (text: string, search: string):boolean => {
    return text.trim().toLowerCase().includes(search.trim().toLowerCase());
  }

  const getSearchBarView = () => {
    if(!isSearchOpen) return<></>;

    return(
      <View style={s.searchContainer}>
        <Text style={s.searchTitle}>Search</Text>
        <View  style={s.searchBottomRow}>
          <TextInput 
            defaultValue={searchText}
            style={s.inputStyle}
            placeholderTextColor={t.textcolorfade}
            placeholder="Title that includes..."
            onChangeText={onSearchTextChange}
            submitBehavior="submit"
            onSubmitEditing={()=>{popMessage('on')}}
            autoFocus>
          </TextInput>
          <PressImage onPress={onEraseSearch} source={require('../../public/images/eraser.png')}></PressImage>
        </View>
      </View>
    )
  }

  const orderByTitle = async () => {
    setIsSortMenuOpen(false);

    let objsOrdered: Objective[] = objectives.sort((a, b) => {
      return a.Title.localeCompare(b.Title)
    });

    let sorted:Objective[] = [];

    for(let i = 0; i < objsOrdered.length; i++){
      sorted.push({...objsOrdered[i], Pos: i, LastModified: (new Date()).toISOString()});
    }

    await putObjectives(sorted);
  }

  const orderByColor = async () => {
    setIsSortMenuOpen(false);
    const ORDER: Record<string, number> = {
      noTheme: 0,
      blue: 1,
      red: 2,
      green: 3,
      white: 4,
      pink: 5,
      cyan: 6,
    };

    let objsOrdered: Objective[] = objectives.sort(
      (a, b) => (ORDER[a.Theme] ?? Number.MAX_SAFE_INTEGER)
              - (ORDER[b.Theme] ?? Number.MAX_SAFE_INTEGER)
    );

    let sorted:Objective[] = [];

    for(let i = 0; i < objsOrdered.length; i++){
      sorted.push({...objsOrdered[i], Pos: i, LastModified: (new Date()).toISOString()});
    }

    await putObjectives(sorted);
  }

  const getSortMenuView = () => {
    if(!isSortMenuOpen) return;

    return(
      <View style={s.sortMenu}>
        <PressImage onPress={orderByTitle} disable={isEditingPos} source={require('../../public/images/atoz.png')}></PressImage>
        <PressImage onPress={orderByColor} disable={isEditingPos} source={require('../../public/images/theme.png')}></PressImage>
      </View>
    )
  }

  const getBottomMenuView = () => {
    return(
      <View style={s.bottomMenu}>
        <View style={s.leftBottomMenu}>
          {userPrefs.singleTagSelected?
            <PressImage onPress={changeSingleTag} disable={isEditingPos} source={require('../../public/images/tagsingle.png')}></PressImage>
            :
            <PressImage onPress={changeSingleTag} disable={isEditingPos} source={require('../../public/images/tag.png')} ></PressImage>
          }
        </View>
        <View style={s.rightBottomMenu}>
          <PressImage onPress={()=>{setIsSortMenuOpen(!isSortMenuOpen)}} disable={isEditingPos} source={require('../../public/images/sort.png')}  selected={isSortMenuOpen}></PressImage>
          {getMoveIcons()}
          <PressImage onPress={()=>{setIsSearchOpen(!isSearchOpen)}} disable={isEditingPos} source={require('../../public/images/search.png')} selected={isSearchOpen}></PressImage>
          <PressImage onPress={onAddNewObjective} disable={isEditingPos} source={require('../../public/images/newfile.png')}></PressImage>
        </View>
      </View>
    )
  }

  const s = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    containerList: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',

      backgroundColor: 'black',
    },
    containerListTag:{
      flexDirection: "column",
      width: '100%',
      backgroundColor: t.backgroundcolordark,
    },
    containerListTagsTitle:{
      flexDirection: "row",
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      minHeight: 40,

      color: t.textcolor,
      backgroundColor: t.backgroundcolordark,
      textAlign: 'center',
    },
    containerTagTitleText:{
      flex: 1,
      color: isTagsListFolded ? t.textcolorfade:t.textcolor,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    containerObjectiveTitleText:{
      flex: 1,
      color: isObjectiveListFolded ? t.textcolorfade:t.textcolor,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    containerListObjs:{
      flex: 1,
      flexDirection: "column",
      width: '100%',
      backgroundColor: t.backgroundcolordark,
    },
    containerObjectivesListTitle:{
      fontWeight: 'bold',
      color: t.textcolor,
      backgroundColor: t.backgroundcolordarker,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: 10,
      width: '100%',
    },
    tagList: {
      flexWrap: "wrap",
      flexDirection: 'row',
      padding: 10,

      backgroundColor: t.backgroundcolor,
    },
    tag: {
      textAlign: 'center',
      verticalAlign: 'middle',
      color: t.textTag,
      fontWeight: 'bold',
      fontSize: 14,
      margin: 2,
      paddingVertical: 3,
      paddingHorizontal: 10,
      // minWidth: 50,
      maxHeight: 30,

      // backgroundColor: t.backgroundTag,

      borderColor: t.backgroundcolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 15,
    },
    tagSelected:{
      backgroundColor: t.backgroundTagSelected,
      color: t.textTagSelected,
      
      borderColor: t.textcolorcontrast,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    tagSpecial:{
      backgroundColor: t.backgroundTagSpecial,
      color: t.textTagSpecial,

      borderColor: t.textcolorcontrast,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    tagsList:{
      paddingTop: 10,
      paddingBottom: 15,
      paddingHorizontal: 15,
    },
    objectivesList:{
      flex: 1,
      paddingVertical: 15,
      paddingHorizontal: 5,
      backgroundColor: t.backgroundcolor,
    },
    bottomMenu: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: t.backgroundcolordark,
    },
    leftBottomMenu:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    rightBottomMenu:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    sortMenu: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: '#00000018',
    },
    searchContainer:{
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: t.backgroundcolordarker,
      margin: 5,
      minHeight: 60,
      paddingHorizontal: 10,
      paddingVertical: 5,
      
      borderColor: t.bordercolorfade,
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
    },
    searchTitle:{
      verticalAlign: 'middle',
      textAlign: 'center',
      width: '100%',
      color: t.textcolor,
      fontWeight: 'bold',
      fontSize: 25,
    },
    searchBottomRow:{
      flexDirection: "row",
    },
    inputStyle: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',

      color: searchNoItemFound?t.trashicontint:t.textcolor,
      
      borderColor: t.bordercolorfade,
      borderBottomWidth: 1,
      borderStyle: 'solid',
    },
    allTextContainer:{
      width: 100,
      height: 30,
      marginTop: 5,
      marginBottom: 5,
      marginRight: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: t.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 5,
    },
    allText:{
      color: t.textcolor,
    },
    imageContainerSelected:{
      ...gs.baseImageContainer,
      backgroundColor: t.backgroundcolordarker,
    },
    imageNoTint:{
      ...gs.baseSmallImage,
    },
    image:{
      ...gs.baseSmallImage,
      tintColor: t.icontint,
    },
    imageCancel:{
      ...gs.baseSmallImage,
      tintColor: t.cancelicontint,
    },
    imageNewFile:{
      ...gs.baseImage,
      tintColor: t.icontint,
    },
    imageUpDown:{
      ...gs.baseSmallImage,
      tintColor: t.icontint,
    },
    redImageColor:{
      tintColor: t.trashicontint,
    },
    greenImageColor:{
      tintColor: t.doneicontint,
    },
    imageFade:{
      tintColor: t.icontintfade,
    },
    objectiveContainer:{
      flexDirection: 'row',
      marginBottom: 5,
      width: '100%',
    },
    objectivePin:{
      position: 'absolute',
      top: 0,
      left: 0,
      width: 17,
      height: 17,
      zIndex: 9999,
      transform: [{ translateX: -5 }, { translateY: -5 }],
    },
    objectiveButtonContainerFake:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',

      minHeight: 45,
      marginVertical: 5,

      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: t.bordercolor,
      borderRadius: 5,
    },
    objectiveButtonContainerFakeText:{
      color: 'beige',
    },
    objectiveButtonContainer:{
      flex: 1,

      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 40,

      borderColor: t.backgroundcolordarker,
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
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
    tagButtonContainer:{
      display:'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 40,
      marginBottom: 5,

      borderRadius: 30,
      borderColor: t.bordercolorfade,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    tagButtonContainerSelected:{
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: t.bordercolor,
      backgroundColor: t.backgroundcolordarker,
    },
    allNoneTagContainer:{
      display:'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 40,
      marginTop: 10,
      marginHorizontal: 15,

      borderRadius: 30,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: t.bordercolor,
      backgroundColor: t.backgroundcolorcontrast,
    },
    allNoneTagText:{
      fontSize: 16,
      padding: 10,
      color: t.textcolorcontrast,
    },
    text: {
      padding: 10,
      fontSize: 16,
      color: t.textcolor,
      textAlign: "center",
    },
    textSelected:{
      color: t.textcolor,
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
    <View style={s.container}>
      {getSearchBarView()}
      <View style={s.containerList}>
        <View style={s.containerListTag}>
          {getTagsTitle()}
          {getTagsList()}
        </View>
        <View style={s.containerListObjs}>
          {getObjectivesTitle()}
          {getObjectivesList()}
        </View>
      </View>
      {getSortMenuView()}
      {getBottomMenuView()}
    </View>
  );
};

export default ObjsListView;