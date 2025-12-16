import React, { JSX, useRef } from "react";
import { View, StyleSheet, Pressable, Vibration, Alert, FlatList, Text, BackHandler, KeyboardAvoidingView, Platform, TextInput, ScrollView } from "react-native";
import * as ExpoLocation from 'expo-location';

import { colorPalette, getObjTheme, globalStyle as gs, lightBlue, noTheme, lightNoTheme, darkBlue } from "../../Colors";

import { useUserContext } from "../../Contexts/UserContext";
import { useLogContext } from "../../Contexts/LogContext";
import { useStorageContext } from "../../Contexts/StorageContext";

import PressText from "../../PressText/PressText";
import PressImage from "../../PressImage/PressImage";
import PressInput from "../../PressInput/PressInput";

import { Item, ItemType, Note, Objective, Question, Step, Views, Wait, Location, Divider, Grocery, Pattern, MessageType, Medicine, Exercise, Weekdays, StepImportance, ItemNew, Link, Image, House, GenericItem, ObjBottomIcons, MultiSelectAction, MultiSelectType } from "../../Types";
import { useEffect, useState } from "react";

import QuestionView, {New as QuestionNew} from "./QuestionView/QuestionView";
import StepView, {New as StepNew} from "./StepView/StepView";
import WaitView, {New as WaitNew} from "./WaitView/WaitView";
import NoteView, {New as NoteNew} from "./NoteView/NoteView";
import LocationView, {New as LocationNew} from "./LocationView/LocationView";
import DividerView, {New as DividerNew} from "./DividerView/DividerView";
import GroceryView, {New as GroceryNew} from "./GroceryView/Grocery";
import MedicineView, {New as MedicineNew} from "./MedicineView/MedicineView";
import ExerciseView, {New as ExerciseNew} from "./ExerciseView/ExerciseView";
import LinkView, {New as LinkNew} from "./LinkView/LinkView";
import ImageView, {New as ImageNew} from "./ImageView/ImageView";
import { HouseView, New as HouseNew } from "./HouseView/HouseView";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ObjectiveViewProps {
  obj: Objective,
  scrollTo?: (index: number) => void,
  index?: number,
}
const ObjectiveView = (props: ObjectiveViewProps) => {
  const { log, popMessage } = useLogContext();
  const { storage, } = useStorageContext();
  const { theme, fontTheme, 
    user, userPrefs, 
    objectives, putObjective, deleteObjective, 
    currentObjectiveId, 
    writeItems, readItems, putItems, deleteItem, deleteItems,
    availableTags, putAvailableTags, removeAvailableTagsIfUnique, putSelectedTags,
    multiSelectAction, setMultiSelectAction,
    currentView, writeCurrentView } = useUserContext();
    const { obj } = props;
  const o = getObjTheme(userPrefs.theme, props.obj.Theme);
  let hiddenItems = 0;

  const [items, setItems] = useState<Item[]>([]);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

  ///Temp
  let tempFilteredItems:Item[] = [];

  ///Menus 
  const [isMenuIconOpen, setIsMenuIconOpen] = useState<boolean>(false);
  const [isItemsOpen, setIsItemsOpen] = useState<boolean>(false);
  const [isItemOpenLocked, setIsItemOpenLocked] = useState<boolean>(false);
  const [newItemsMultiplier, setNewItemsMultiplier] = useState<number>(1);
  const [isTagOpen, setIsTagOpen] = useState<boolean>(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [isCheckedOpen, setIsCheckedOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMultiSelectOpen, setIsMultiSelectOpen] = useState<boolean>(false);
  const [alertLock, setAlertLock] = useState<boolean>(false);

  //Multi select
  const [selectingItems, setSelectingItems] = useState<Item[]>([]);
  const [isSelectingPastePos, setIsSelectingPastePos] = useState<any>(false);
  const [isSelectingAll, setIsSelectingAll] = useState<boolean>(false);

  //Search
  const [itemSearchToShow, setItemSearchToShow] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [searchNoItemFound, setSearchNoItemFound] = useState<boolean>(false);

  const [newTag, setNewTag] = useState<string>('');

  const [devItemNumber, setDevItemNumber] = useState<boolean>(false);

  const [openAll, setOpenAll] = useState<boolean>(false);

  const listRef = useRef<FlatList<Item>>(null);
  const [isListGoingUp, setIsListGoingUp] = useState<boolean>(false);

  /// testing, to delete maybe later
  const [justAddedItemId, setJustAddedItemId] = useState<string[]>([]);

  useEffect(()=>{
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      writeCurrentView(Views.ListView);
      return true;
    });


    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    load();
    
  }, [objectives, currentView]);

  const load = async () => {
    const sorted = await loadItems();
    if(userPrefs.allowLocation) doesNeedToAskGPS(sorted);
  }

  const doesNeedToAskGPS = async (list: Item[]) => {
    const hasLocation = list.some(obj => obj.Type === ItemType.Location);
    if(hasLocation){
      let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status !== 'granted') popMessage('Permission to access location was denied', MessageType.Error, 3);

      const isEnabled = await ExpoLocation.hasServicesEnabledAsync();
      if(!isEnabled && userPrefs.allowLocation && userPrefs.warmLocationOff) popMessage('Turn on phone GPS to get distance to places!', MessageType.Alert, 5);
    }
  }
  
  const loadItems = async () => {
    const dbItems = await readItems(obj.ObjectiveId);
    const sorted = dbItems.sort((a, b)=> a.Pos-b.Pos);
    setItems(sorted);
    return sorted;
  }

  const onDeleteItem = async (item: Item) => {
    await deleteItem(item);
    loadItems();
  }

  const choseNewItemToAdd = async (type: ItemType, pos?:number) => {
    const baseItem = {...ItemNew(user?user.UserId:'fakeuseridfakeuseridfakeuseridfakeuserid', obj.ObjectiveId, await storage.randomId(), type, pos?pos:items.length, '')}

    let typeItem:any = {};
    switch (type) {
      case ItemType.Divider:
        typeItem = {...baseItem, ...DividerNew()};
        break;
      case ItemType.Step:
        typeItem = {...baseItem, ...StepNew()};
        break;
      case ItemType.Question:
        typeItem = {...baseItem, ...QuestionNew()};
        break;
      case ItemType.Wait:
        typeItem = {...baseItem, ...WaitNew()};
        break;
      case ItemType.Note:
        typeItem = {...baseItem, ...NoteNew()};
        break;
      case ItemType.Location:
        typeItem = {...baseItem, ...LocationNew()};
        break;
      case ItemType.Grocery:
        typeItem = {...baseItem, ...GroceryNew()};
        break;
      case ItemType.Medicine:
        typeItem = {...baseItem, ...MedicineNew()};
        break;
      case ItemType.Exercise:
        typeItem = {...baseItem, ...ExerciseNew()};
        break;
      // case ItemType.:
      //   typeItem = {...baseItem, ...ItemFakeNew()};
      //   break;
      case ItemType.Link:
        typeItem = {...baseItem, ...LinkNew()};
        break;
      case ItemType.Image:
        typeItem = {...baseItem, ...ImageNew()};
        break;
      case ItemType.House:
        typeItem = {...baseItem, ...HouseNew()};
        break;
      default:
        break;
    }

    let itemList:Item[] = [];
    for (let i = 0; i < newItemsMultiplier; i++) {
      itemList.push({
        ...typeItem,
        ItemId: await storage.randomId(),
        LastModified: new Date().toISOString(),
      });
    }

    await addNewItems(itemList, pos);
  }

  const addNewItems = async (toAddItems: Item[], pos?:number) => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    let sending:Item[] = [];
    if(pos !== null && pos !== undefined) {
      const newList = items.filter((i: Item) => !items.includes(i));
      const before = newList.slice(0, pos+1);
      const after = newList.slice(pos+1);

      let ajustedList = [...before, ...toAddItems, ...after];

      for(let i = 0; i < ajustedList.length; i++){
        sending.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
      }
    }
    else{
      sending.push(...toAddItems);
    }

    const justAdded = toAddItems.map((item:Item) => {
      return item.ItemId;
    })

    setJustAddedItemId(justAdded);
    // log.arrg('justAdded', justAdded)
    setTimeout(() => {
      setJustAddedItemId([]);
    }, 3000);

    await putItems(obj.ObjectiveId, sending);
    await loadItems();
    itemsListScrollTo(items[items.length-2].ItemId);

    if(!isItemOpenLocked) setIsItemsOpen(false);
  }

  const onDeleteObjective = async () => {
    await deleteObjective(obj);
    writeCurrentView(Views.ListView);
  }

  const onChangeTitle = async (newText: string) => {
    await putObjective({...obj, Title: newText.trim(), LastModified: (new Date()).toISOString() });
    setIsEditingTitle(false);
  }

  const onArchive = async () => {
    await putObjective({...obj, IsArchived: true, LastModified: (new Date()).toISOString() });
  }

  const onUnarchive = async () => {
    await putObjective({...obj, IsArchived: false, LastModified: (new Date()).toISOString() });
  }

  const onLock = async () => {
    await putObjective({...obj, IsLocked: !obj.IsLocked, LastModified: (new Date()).toISOString() });
  }

  const lockAlertCallback = () => {
    setAlertLock(false);
  }

  const onChangeIsMenuOpen = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    setIsMenuIconOpen(!isMenuIconOpen);
  }

  const onChangeIsPaletteOpen = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    setIsPaletteOpen(!isPaletteOpen);
  }

  const onChangeIsObjPrefsOpen = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    setIsPaletteOpen(false);
    setIsItemsOpen(false);
  }

  const onSelectColor = (color: string) => {
    putObjective({...obj, Theme: color, LastModified: (new Date()).toISOString()});
    setIsItemsOpen(false);
    setIsPaletteOpen(false);
  }

  const onIsEditingTitle = (editingState: boolean) => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    setIsEditingTitle(editingState);
  }

  const onChangeMultiSelectOpen = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    if(isMultiSelectOpen){
      setSelectingItems([]);
      setIsSelectingPastePos(false);
      setIsMultiSelectOpen(false);
      setIsSelectingAll(false);
    }
    else{
      setIsMultiSelectOpen(true);
    }
  }

  const multiSelectSelectAll = (v: boolean) => {
    if(v){
      setSelectingItems([...items]);
      setIsSelectingAll(v);
    }
    else{
      setSelectingItems([]);
      setIsSelectingAll(v);
    }
  }

  const eraseItems = () => {
    setMultiSelectAction(null);
    setIsSelectingPastePos(false);
    setIsSelectingAll(false);
  }

  const moveItems = () => {
    setMultiSelectAction({
      originObjectiveId: obj.ObjectiveId,
      type: MultiSelectType.MOVE,
      items: selectingItems
    });

    setIsSelectingPastePos(true); 
    setSelectingItems([]);

    popMessage('Items selected to move.');
  }

  const copyItems = () => {
    setMultiSelectAction({
      originObjectiveId: obj.ObjectiveId,
      type: MultiSelectType.COPY,
      items: selectingItems
    });

    setIsSelectingPastePos(true);
    setSelectingItems([]);

    popMessage('Item copied.');
  }

  const addRemoveToSelected = (item: Item) => {
    const existItem:Item|undefined = selectingItems.find((i) => i.ItemId === item.ItemId);

    if(existItem !== undefined){
      setSelectingItems(selectingItems.filter((i) => {return i.ItemId !== item.ItemId}));
    }
    else{
      setSelectingItems([...selectingItems, item]);
    }
  }

  const resetMultiSelectStates = () => {
    setMultiSelectAction(null);
    setIsSelectingPastePos(false);
    setIsMultiSelectOpen(false);
    setSelectingItems([]);
    setIsSelectingAll(false);
  }

  const pasteItems = async (itemTo: Item) => {
    if(!multiSelectAction){
      return;
    }

    const { items: actionItems } = multiSelectAction;

    ///Get the list without items to move
    const itemsFiltered = items.filter((i: Item) => {
      return !actionItems.some(a => a.ItemId === i.ItemId);
    })

    ///inserting items in the position
    const index = itemsFiltered.indexOf(itemTo);
    const before = itemsFiltered.slice(0, index+1);
    const after = itemsFiltered.slice(index+1);

    /// If it's comming from another objetive, ajust the objective id
    let ajustedActionList: Item[] = [...actionItems];
    if(multiSelectAction.originObjectiveId !== obj.ObjectiveId){
      ajustedActionList = ajustedActionList.map((i: Item) => {
        return {...i, UserIdObjectiveId: user.UserId + obj.ObjectiveId }
      });
    }

    /// If it's a copy, change the item id
    if(multiSelectAction.type === MultiSelectType.COPY){
      ajustedActionList = ajustedActionList.map((i: Item) => {
        return {...i, ItemId: storage.randomId() };
      });
    }

    const fullList = [...before, ...ajustedActionList, ...after];

    ///Update items pos&
    let finalList:Item[] = fullList.map((item: Item, i: number) => {
      return {...item, Pos: i, LastModified: (new Date()).toISOString()}
    });

    ///Replace items
    await putItems(obj.ObjectiveId, finalList);
    
    if(multiSelectAction.type === MultiSelectType.MOVE && multiSelectAction.originObjectiveId !== obj.ObjectiveId){
      await deleteItems(multiSelectAction.originObjectiveId, multiSelectAction.items);
    }
    
    await loadItems();
    resetMultiSelectStates();
  }

  const multiSelectDeleteItems = async () => {
    await deleteItems(obj.ObjectiveId, selectingItems);

    await loadItems();
    resetMultiSelectStates();
  }

  const onChangeShowingItems = async () => {
    await putObjective(
      {
        ...obj, 
        IsShowingCheckedGrocery: !obj.IsShowingCheckedGrocery, 
        IsShowingCheckedExercise: !obj.IsShowingCheckedGrocery,
        IsShowingCheckedStep: !obj.IsShowingCheckedGrocery,
        IsShowingCheckedMedicine: !obj.IsShowingCheckedGrocery,
        LastModified: (new Date()).toISOString() 
      }
    );
  }

  const selectUnselectAllItems = async (v: boolean) => {
    let rtnItems: Item[] = [];
    items.forEach((item: Item)=>{
      if(item.Type === ItemType.Exercise){
        const newItem = (item as Exercise);
        newItem.IsDone = v;
        rtnItems = [...rtnItems, newItem];
      }
      else if(item.Type === ItemType.Grocery){
        const newItem = (item as Grocery);
        newItem.IsChecked = v;
        rtnItems = [...rtnItems, newItem];
      }
      else if(item.Type === ItemType.Step){
        const newItem = (item as Step);
        newItem.Done = v;
        rtnItems = [...rtnItems, newItem];
      }
      else if(item.Type === ItemType.Medicine){
        const newItem = (item as Medicine);
        newItem.IsChecked = v;
        rtnItems = [...rtnItems, newItem];
      }
    });

    await putItems(obj.ObjectiveId, rtnItems);
    await loadItems();
  }

  const onChangeShowingItemsMenuOpen = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    setIsCheckedOpen(!isCheckedOpen);
  }

  /// Responsable for open, close and locking icon and menu.
  const addingNewItem = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    if(isItemsOpen){
      /// turn all off
      if(isItemOpenLocked){
        setNewItemsMultiplier(1);
        setIsItemOpenLocked(false);
        setIsItemsOpen(false);
      }
      else{/// adding but now lock
        setIsItemOpenLocked(true);
      }
    }
    else{/// start adding item
      setIsItemsOpen(true);
    }
  }

  const onOpenSearch = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    if(!isCheckedOpen) {
      setItemSearchToShow([]);
      setSearchText('');
    }
    setIsSearchOpen(!isSearchOpen);
    itemsListScrollTo();
  }

  const sortItemsAlphabetically = (items: Item[]): Item[] => {
    return items.sort((a, b) => {
        const titleA = getSortableText(a);
        const titleB = getSortableText(b);

        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
        return 0;
    });
  }

  const getSortableText = (item: Item): string => {
    if (item.Type === ItemType.Step) {
        return (item as Step).Title.toLowerCase();
    }
    if (item.Type === ItemType.Wait) {
      return (item as Wait).Title.toLowerCase();
    }
    if (item.Type === ItemType.Grocery) {
      return (item as Grocery).Title.toLowerCase();
    }
    if (item.Type === ItemType.Divider) {
      return (item as Divider).Title.toLowerCase();
    }
    if (item.Type === ItemType.Location) {
      return (item as Location).Title.toLowerCase();
    }
    if (item.Type === ItemType.Question) {
      return (item as Question).Statement.toLowerCase();
    }
    if (item.Type === ItemType.Note) {
      return (item as Note).Text.toLowerCase();
    }
    return "";
  }

  const orderItems = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    let itemsOrdered:Item[] = sortItemsAlphabetically(items);
    
    let finalList:Item[] = [];
    for(let i = 0; i < itemsOrdered.length; i++){
      finalList.push({...itemsOrdered[i], Pos: i, LastModified: (new Date()).toISOString()});
    }

    writeItems(obj.ObjectiveId, finalList);
    setItems(finalList);
  }

  const foldUnfoldAllDividers = async (v: boolean) => {
    let newValues = [];
    for (let i  = 0; i < items.length; i++) {
      if(items[i].Type === ItemType.Divider){
        const divider = items[i] as Divider;
        newValues.push({...divider, IsOpen: v});
      }
    }
    await putItems(obj.ObjectiveId, newValues);
    loadItems();

    setOpenAll(!v);
  }

  const orderDividerItems = async (divider: Item) => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    let start = false;
    let itemsToOrder = [];
    for(let i = 0; i < items.length; i++){
      if(start && items[i].Type === ItemType.Divider) break;

      if(start) itemsToOrder.push(items[i]);

      if(items[i] === divider){ 
        start = true; 
      }
    }

    let itemsOrdered:Item[] = sortItemsAlphabetically(itemsToOrder);

    let finalList:Item[] = [];
    const newList = items.filter((i: Item) => !itemsOrdered.includes(i));
    const before = newList.slice(0, divider.Pos+1);
    const after = newList.slice(divider.Pos+1);

    let ajustedList = [...before, ...itemsOrdered, ...after];

    for(let i = 0; i < ajustedList.length; i++){
      finalList.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
    }

    writeItems(obj.ObjectiveId, finalList);
    setItems(finalList);
  }

  const onOpenTagList = () => {
    setIsTagOpen(!isTagOpen);
  }

  const onHandleSubmit = (event: any) => {
    onAddNewTag(event.nativeEvent.text);
  }

  const onAddNewTag = async (tag: string) => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    if(tag.length > 100) {
      popMessage(`That's one big tag...`, MessageType.Alert);
    }
    if(tag.trim() === '') {
      if(tag.length > 0){
        popMessage('Clever girl!', MessageType.Alert);
        setNewTag('');
      }
      else{
        popMessage('Type something for the tag...', MessageType.Alert);
        if(userPrefs.vibrate) Vibration.vibrate(Pattern.Wrong);
      }

      return;
    }

    const tagToAdd = tag.trim();

    if(tagToAdd.toLowerCase() === 'all' || tagToAdd.toLowerCase() === 'none'){
      popMessage('All and None are protected tags', MessageType.Error);
      return;
    }

    const sortedTags = [...obj.Tags].sort((a, b) => a.localeCompare(b));

    let uniqueTags = [];
    if(sortedTags.includes('Pin'))
      uniqueTags = Array.from(new Set(['Pin', ...sortedTags, tagToAdd]));
    else
      uniqueTags = Array.from(new Set([...sortedTags, tagToAdd]));

    await putObjective({...obj, Tags: [...uniqueTags], LastModified: (new Date()).toISOString() });
    await putAvailableTags([tagToAdd]);
    await putSelectedTags([tagToAdd]);
    setNewTag('');
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
      setItemSearchToShow([]);
    }
  }

  const onEraseNewTag = () => {
    if(newTag.trim() === '' && userPrefs.vibrate) {
      Vibration.vibrate(Pattern.Wrong);
    }
    else{
      if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
      setNewTag('');
    }
  }

  const doSearchText = (search: string) => {
    let newList: string[] = [];
    items.forEach((item: Item)=>{
      if(item.Type === ItemType.Step){
        if(searchTextIgnoreCase((item as Step).Title, search)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Question){
        if(searchTextIgnoreCase((item as Question).Statement, search)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Wait){
        if(searchTextIgnoreCase((item as Wait).Title, search)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Note){
        if(searchTextIgnoreCase((item as Note).Text, search)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Location){
        if(searchTextIgnoreCase((item as Location).Title, search)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Divider){
        if(searchTextIgnoreCase((item as Divider).Title, search)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Grocery){
        if(searchTextIgnoreCase((item as Grocery).Title, search)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Medicine){
        if(searchTextIgnoreCase((item as Medicine).Title, search)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Exercise){
        if(searchTextIgnoreCase((item as Exercise).Title, search)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Link){
        if(searchTextIgnoreCase((item as Link).Title, search)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.Image){
        if(searchTextIgnoreCase((item as Image).Title, search)) newList.push(item.ItemId);
      }
      else if(item.Type === ItemType.House){
        if(searchTextIgnoreCase((item as House).Title, search)) newList.push(item.ItemId);
      }
      else{
      }
    });

    if(newList.length === 0) {
      setSearchNoItemFound(true);
    }
    setItemSearchToShow(newList);
  }

  const searchTextIgnoreCase = (text: string, search: string):boolean => {
    return text.trim().toLowerCase().includes(search.trim().toLowerCase());
  }

  const removeTag = async (tag: string) => {
    const updatedTags = obj.Tags.filter((i) => i !== tag);
    await putObjective({
      ...obj,
      Tags: updatedTags,
      LastModified: new Date().toISOString(),
    });

    await removeAvailableTagsIfUnique([tag]);
  }

  const getTagList = () => {
    let tagList = [];

    obj.Tags.sort((a, b) => {
      if (a === "Pin") return -1;
      if (b === "Pin") return 1;
      return a.localeCompare(b);
    });

    for(let i = 0; i < obj.Tags.length; i++){
      const cTag = obj.Tags[i];
      tagList.push(
        <PressText 
          key={cTag}
          onPress={()=>removeTag(cTag)}
          style={[s.tagContainer, cTag === 'Pin'?s.tagContainerPin:undefined]}
          textStyle={[s.tagText, cTag === 'Pin'?s.tagTextPin:undefined]}
          text={cTag}
          defaultStyle={o}>
        </PressText>
      )
    }
    if(obj.Tags.length === 0){
      return <Text style={s.noObjectiveTag}>NO TAGS</Text>
    }
    else{
      return (
        <View style={s.tagListContainer}>
          {tagList}
        </View>
      )
    }
  }

  const getAvailableTagList = () => {
    let tagList = [];

    const availableTagsSorted = availableTags.sort((a, b) => {
      if (a === "Pin") return -1;
      if (b === "Pin") return 1;
      return a.localeCompare(b);
    });

    for(let i = 0; i < availableTagsSorted.length; i++){
      const cTag = availableTagsSorted[i];
      // if(obj.Tags.includes(cTag)) break;

      tagList.push(
        <PressText 
          key={cTag}
          onPress={()=>onAddNewTag(cTag)}
          style={[s.tagContainer, cTag === 'Pin'?s.tagContainerPin:undefined]}
          textStyle={[s.tagText, cTag === 'Pin'?s.tagTextPin:undefined]}
          text={cTag}
          defaultStyle={o}>
        </PressText>
      )
    }
    if(availableTags.length === 0){
      return<></>;
    }
    else{
      return (
        <View style={s.tagListContainer}>
          {tagList}
        </View>
      )
    }
  }

  const getUncheckedCheckedView = () => {
    if(!isCheckedOpen) return <></>;

    return(
      <View style={s.itemsContainer}>
        <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={() => {selectUnselectAllItems(true)}} source={require('../../../public/images/checkedunchecked.png')}></PressImage>
        <PressImage pressStyle={gs.baseImageContainer} style={s.imageFade} onPress={() => {selectUnselectAllItems(false)}} source={require('../../../public/images/checkedunchecked.png')}></PressImage>
      </View>
    )
  }

  const increaseNewItemMultiplier = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    let newValue = newItemsMultiplier+1;
    if(newValue > 10) newValue = 1;
    setNewItemsMultiplier(newValue);
  }

  const getSearchView = () => {
    if(!isSearchOpen) return <></>;

    return(
      <View style={s.searchContainer}>
        <Text style={s.searchTitle}>Search</Text>
        <View  style={s.searchBottomRow}>
          <TextInput 
            defaultValue={searchText}
            style={s.inputStyle}
            placeholderTextColor={o.itemtextfade}
            placeholder="item that includes..."
            onChangeText={onSearchTextChange}
            submitBehavior="submit"
            autoFocus>
          </TextInput>
          <PressImage pressStyle={[s.imagePress]} style={[s.cancelImage]} onPress={onEraseSearch} source={require('../../../public/images/eraser.png')}></PressImage>
        </View>
      </View>
    )
  }

  const getButtonIconViews = (icon: ObjBottomIcons, invert: boolean = false) => {
    switch (icon) {
      case ObjBottomIcons.Unarchive:
        if (!obj.IsArchived || !shouldShowBottomIcon(ObjBottomIcons.Unarchive, invert)) return null;
        return (
          <PressImage
            pressStyle={gs.baseBiggerImageContainer}
            style={s.image}
            disable={shouldDisable(ObjBottomIcons.Unarchive)}
            disableStyle={s.imageFade}
            confirm
            onPress={() => showButtomItem(ObjBottomIcons.Unarchive)}
            source={require("../../../public/images/unarchive.png")}
          />
        );
      case ObjBottomIcons.Archive:
        if (obj.IsArchived || !shouldShowBottomIcon(ObjBottomIcons.Archive, invert)) return null;
        return (
          <PressImage
            pressStyle={gs.baseBiggerImageContainer}
            style={s.image}
            disable={shouldDisable(ObjBottomIcons.Archive)}
            disableStyle={s.imageFade}
            confirm
            onPress={() => showButtomItem(ObjBottomIcons.Archive)}
            source={require("../../../public/images/archive.png")}
          />
        );
      case ObjBottomIcons.Palette:
        if (!shouldShowBottomIcon(ObjBottomIcons.Palette, invert)) return null;
        return (
          <PressImage
            pressStyle={[gs.baseBiggerImageContainer]}
            style={s.image}
            disable={shouldDisable(ObjBottomIcons.Palette)}
            disableStyle={s.imageFade}
            selected={isPaletteOpen}
            selectedStyle={s.bottomContainerSelected}
            onPress={() => showButtomItem(ObjBottomIcons.Palette)}
            source={require("../../../public/images/palette.png")}
          />
        );
      case ObjBottomIcons.Tags:
        if (!shouldShowBottomIcon(ObjBottomIcons.Tags, invert)) return null;
        return (
          <PressImage
            style={s.image}
            disable={shouldDisable(ObjBottomIcons.Tags)}
            disableStyle={s.imageFade}
            selected={isTagOpen}
            selectedStyle={s.bottomContainerSelected}
            pressStyle={gs.baseBiggerImageContainer}
            onPress={() => showButtomItem(ObjBottomIcons.Tags)}
            source={require("../../../public/images/tag.png")}
          />
        );
      case ObjBottomIcons.Search:
        if(!shouldShowBottomIcon(ObjBottomIcons.Search, invert)) return null;
        return(
          <PressImage 
          style={s.image}
          disable={shouldDisable(ObjBottomIcons.Search)}
          disableStyle={s.imageFade}
          selected={isSearchOpen}
          selectedStyle={s.bottomContainerSelected}
          pressStyle={[gs.baseBiggerImageContainer]}
          onPress={()=>showButtomItem(ObjBottomIcons.Search)}
          source={require('../../../public/images/search.png')}></PressImage>
        );
      case ObjBottomIcons.Sorted:
        if (!shouldShowBottomIcon(ObjBottomIcons.Sorted, invert)) return null;
        return (
          <PressImage
            style={s.image}
            disable={shouldDisable(ObjBottomIcons.Sorted)}
            disableStyle={s.imageFade}
            pressStyle={gs.baseBiggerImageContainer}
            confirm
            confirmStyle={[s.image, s.greenImageColor]}
            onPress={() => showButtomItem(ObjBottomIcons.Sorted)}
            source={require("../../../public/images/atoz.png")}
          />
        );
      case ObjBottomIcons.Pos:
        if (!shouldShowBottomIcon(ObjBottomIcons.Pos, invert)) return null;
        return (
          <PressImage
            style={s.image}
            disable={shouldDisable(ObjBottomIcons.Pos)}
            disableStyle={s.imageFade}
            selected={isMultiSelectOpen}
            selectedStyle={s.bottomContainerSelected}
            pressStyle={[gs.baseBiggerImageContainer]}
            onPress={() => showButtomItem(ObjBottomIcons.Pos)}
            source={require("../../../public/images/change.png")}
          />
        );
      case ObjBottomIcons.IsLocked:
        if (!shouldShowBottomIcon(ObjBottomIcons.IsLocked, invert)) return null;
        return (
          <PressImage
            pressStyle={gs.baseBiggerImageContainer}
            disable={shouldDisable(ObjBottomIcons.IsLocked)}
            disableStyle={s.imageFade}
            style={[s.image, obj.IsLocked ? s.imageLock : s.imageFade]}
            onPress={onLock}
            confirm={obj.IsLocked}
            confirmStyle={[s.image, s.greenImageColor]}
            source={require("../../../public/images/add-lock.png")}
          />
        );
      case ObjBottomIcons.Checked:
        if (!shouldShowBottomIcon(ObjBottomIcons.Checked, invert)) return null;
        return (
          <PressImage
            style={s.image}
            disable={shouldDisable(ObjBottomIcons.Checked)}
            disableStyle={s.imageFade}
            pressStyle={gs.baseBiggerImageContainer}
            onPress={onChangeShowingItems}
            onLongPress={() => showButtomItem(ObjBottomIcons.Checked)}
            source={
              obj.IsShowingCheckedGrocery
                ? require("../../../public/images/checked.png")
                : require("../../../public/images/checked-off.png")
            }
          />
        );
      case ObjBottomIcons.Add:
        if (!shouldShowBottomIcon(ObjBottomIcons.Add, invert)) return null;
        return isItemOpenLocked ? (
          <PressImage
            style={[s.image, s.redImageColor]}
            disable={shouldDisable(ObjBottomIcons.Add)}
            disableStyle={s.imageFade}
            selected={isItemsOpen}
            selectedStyle={s.bottomContainerSelected}
            pressStyle={gs.baseBiggerImageContainer}
            onPress={addingNewItem}
            source={require("../../../public/images/add-lock.png")}
          />
        ) : (
          <PressImage
            pressStyle={gs.baseBiggerImageContainer}
            style={s.image}
            disable={shouldDisable(ObjBottomIcons.Add)}
            disableStyle={s.imageFade}
            selected={isItemsOpen}
            selectedStyle={s.bottomContainerSelected}
            onPress={() => showButtomItem(ObjBottomIcons.Add)}
            source={require("../../../public/images/add.png")}
          />
        );
      case ObjBottomIcons.FoldUnfoldAll:
        if (!shouldShowBottomIcon(ObjBottomIcons.FoldUnfoldAll, invert)) return null;
        return(openAll?
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={() => {foldUnfoldAllDividers(true)}} source={require('../../../public/images/doubleup-chevron.png')}></PressImage>
          :
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={() => {foldUnfoldAllDividers(false)}} source={require('../../../public/images/doubledown-chevron.png')}></PressImage>
        );
      case ObjBottomIcons.GoingTopDown:
        if (!shouldShowBottomIcon(ObjBottomIcons.GoingTopDown, invert)) return null;
        return(isListGoingUp?
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={()=>{setIsListGoingUp(false); itemsListScrollTo()}} source={require('../../../public/images/to-top.png')}></PressImage>
          :
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={()=>{setIsListGoingUp(true); itemsListScrollTo(tempFilteredItems[tempFilteredItems.length-1].ItemId)}} source={require('../../../public/images/to-bottom.png')}></PressImage>
        );
      default:
        return null;
    }
  }

  const itemTouchEndFunc = (item: Item) => {
    if(isSelectingPastePos){
      pasteItems(item);
    }
    else{
      addRemoveToSelected(item);
    }
  }

  const getItemView = ({item}:any):JSX.Element => {
    let rtnItem;
    const isSelectingItem = selectingItems.some((i: Item)=>i.ItemId === item.ItemId);

    let itemIsSelected:boolean = false;
    if(multiSelectAction) {
      itemIsSelected = multiSelectAction.items.some((i:Item) => {return i.ItemId === item.ItemId});
    }

    const wasJustAdded = justAddedItemId.includes((item as Item).ItemId);
    if(item.Type === ItemType.Divider){
      rtnItem = <DividerView 
        key={item.ItemId}
        loadMyItems={loadItems}
        isSelecting={isSelectingItem} 
        isSelected={itemIsSelected}
        wasJustAdded={wasJustAdded}
        isDisabled={isMultiSelectOpen}
        isLocked={obj.IsLocked}
        objTheme={o}
        divider={item as Divider}
        orderDividerItems={orderDividerItems}
        onDeleteItem={onDeleteItem}
        choseNewItemToAdd={(type: ItemType, pos?:number) => {choseNewItemToAdd(type, pos)}}
        itemsListScrollTo={itemsListScrollTo}
        ></DividerView>  
    }
    else  if(item.Type === ItemType.Step){
      rtnItem = <StepView 
        key={item.ItemId}
        isSelecting={isSelectingItem}
        isSelected={itemIsSelected}
        wasJustAdded={wasJustAdded}
        isDisabled={isMultiSelectOpen}
        isLocked={obj.IsLocked}
        loadMyItems={loadItems}
        objTheme={o} step={item as Step}
        onDeleteItem={onDeleteItem}
        itemsListScrollTo={itemsListScrollTo}
      ></StepView>
    }
    else if(item.Type === ItemType.Grocery){
      rtnItem = <GroceryView key={item.ItemId} isSelecting={isSelectingItem} isSelected={itemIsSelected} wasJustAdded={wasJustAdded} isDisabled={isMultiSelectOpen} isLocked={obj.IsLocked} loadMyItems={loadItems} objTheme={o} grocery={item as Grocery} onDeleteItem={onDeleteItem} itemsListScrollTo={itemsListScrollTo} ></GroceryView>
    }
    else if(item.Type === ItemType.Medicine){
      rtnItem = <MedicineView key={item.ItemId} isSelecting={isSelectingItem} isSelected={itemIsSelected} wasJustAdded={wasJustAdded} isDisabled={isMultiSelectOpen} isLocked={obj.IsLocked} loadMyItems={loadItems} objTheme={o} medicine={item as Medicine} onDeleteItem={onDeleteItem} itemsListScrollTo={itemsListScrollTo}></MedicineView>
    }
    else if(item.Type === ItemType.Exercise){
      rtnItem = <ExerciseView key={item.ItemId} isSelecting={isSelectingItem} isSelected={itemIsSelected} wasJustAdded={wasJustAdded} isDisabled={isMultiSelectOpen} isLocked={obj.IsLocked} loadMyItems={loadItems} objTheme={o} exercise={item as Exercise} onDeleteItem={onDeleteItem} itemsListScrollTo={itemsListScrollTo}></ExerciseView>
    }
    else if(item.Type === ItemType.Location){
      rtnItem = <LocationView key={item.ItemId} isSelecting={isSelectingItem} isSelected={itemIsSelected} wasJustAdded={wasJustAdded} isDisabled={isMultiSelectOpen} isLocked={obj.IsLocked} loadMyItems={loadItems} objTheme={o} location={item as Location} onDeleteItem={onDeleteItem} itemsListScrollTo={itemsListScrollTo}></LocationView>
    }
    else if(item.Type === ItemType.Note){
      rtnItem = <NoteView key={item.ItemId} isSelecting={isSelectingItem} isSelected={itemIsSelected} wasJustAdded={wasJustAdded} isDisabled={isMultiSelectOpen} isLocked={obj.IsLocked} loadMyItems={loadItems} objTheme={o} note={item as Note} onDeleteItem={onDeleteItem} itemsListScrollTo={itemsListScrollTo}></NoteView>
    }
    else if(item.Type === ItemType.Question){
      rtnItem = <QuestionView key={item.ItemId} isSelecting={isSelectingItem} isSelected={itemIsSelected} wasJustAdded={wasJustAdded} isDisabled={isMultiSelectOpen} isLocked={obj.IsLocked} loadMyItems={loadItems} objTheme={o} question={item as Question} onDeleteItem={onDeleteItem} itemsListScrollTo={itemsListScrollTo}></QuestionView>
    }
    else if(item.Type === ItemType.Wait){
      rtnItem = <WaitView key={item.ItemId} isSelecting={isSelectingItem} isSelected={itemIsSelected} wasJustAdded={wasJustAdded} isDisabled={isMultiSelectOpen} isLocked={obj.IsLocked} loadMyItems={loadItems} objTheme={o} wait={item as Wait} onDeleteItem={onDeleteItem} itemsListScrollTo={itemsListScrollTo}></WaitView>
    }
    else if(item.Type === ItemType.Link){
      rtnItem = <LinkView key={item.ItemId} isSelecting={isSelectingItem} isSelected={itemIsSelected} wasJustAdded={wasJustAdded} isDisabled={isMultiSelectOpen} isLocked={obj.IsLocked} loadMyItems={loadItems} objTheme={o} link={item as Link} onDeleteItem={onDeleteItem} itemsListScrollTo={itemsListScrollTo}></LinkView>
    }
    else if(item.Type === ItemType.Image){
      rtnItem = <ImageView key={item.ItemId} isSelecting={isSelectingItem} isSelected={itemIsSelected} wasJustAdded={wasJustAdded} isDisabled={isMultiSelectOpen} isLocked={obj.IsLocked} loadMyItems={loadItems} objTheme={o} image={item as Image} onDeleteItem={onDeleteItem} itemsListScrollTo={itemsListScrollTo}></ImageView>
    }
    else if(item.Type === ItemType.House){
      rtnItem = <HouseView key={item.ItemId} isSelecting={isSelectingItem} isSelected={itemIsSelected} wasJustAdded={wasJustAdded} isDisabled={isMultiSelectOpen} isLocked={obj.IsLocked} loadMyItems={loadItems} objTheme={o} house={item as House} onDeleteItem={onDeleteItem} itemsListScrollTo={itemsListScrollTo}></HouseView>
    }
    else if(item.Type === ItemType.StartPlaceholder){
      rtnItem = (
        <View style={[s.itemRow]}>
          <View style={s.startPlaceholderContainer}>
            <Text style={s.startplaceholderText}>{item.Title}</Text>
          </View>
        </View>
        )
    }
    else if(item.Type === ItemType.HiddenItemText){
      return(
        <View style={s.hiddenTextContainer}>
          <Text style={s.hiddenTextText}>{item.Title}</Text>
        </View>
      )
    }
    else if(item.Type === ItemType.Separator){
      return <View style={s.bodyListSpacer}></View>
    }
    return (
      <View style={[s.itemRow]}
        onTouchEnd={() => {if(isMultiSelectOpen) itemTouchEndFunc(item)}}>
        {isMultiSelectOpen && !isSelectingPastePos && (isSelectingItem?
          <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={()=>{if(isMultiSelectOpen) addRemoveToSelected(item)}} source={require('../../../public/images/checked.png')}></PressImage>
          :
          <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={()=>{if(isMultiSelectOpen) addRemoveToSelected(item)}} source={require('../../../public/images/unchecked.png')}></PressImage>)
        }
        {devItemNumber && <Text style={s.devItemRowNumber}>{item.Pos}</Text>}
        {rtnItem}
      </View>
    )
  }

  const showButtomItem = (icon: ObjBottomIcons) => {
    setIsMenuIconOpen(false);
    setIsPaletteOpen(false);
    setIsTagOpen(false);
    setIsSearchOpen(false);
    if(icon !== ObjBottomIcons.Pos) setIsMultiSelectOpen(false);
    if(icon !== ObjBottomIcons.Pos) setIsSelectingPastePos(false);
    if(icon !== ObjBottomIcons.Add) setIsItemsOpen(false);
    if(icon !== ObjBottomIcons.Add) setIsItemOpenLocked(false);

    switch (icon) {
      case ObjBottomIcons.Menu:
        onChangeIsMenuOpen();
        break;
      case ObjBottomIcons.Archive:
        onArchive();
        break;
      case ObjBottomIcons.Unarchive:
        onUnarchive();
        break;
      case ObjBottomIcons.Palette:
        onChangeIsPaletteOpen();
        break;
      case ObjBottomIcons.Checked:
        onChangeShowingItemsMenuOpen();
        break;
      case ObjBottomIcons.Tags:
        onOpenTagList();
        break;
      case ObjBottomIcons.Sorted:
        orderItems();
        break;
      case ObjBottomIcons.Pos:
        onChangeMultiSelectOpen();
        break;
      case ObjBottomIcons.Add:
        addingNewItem();
        break;
      case ObjBottomIcons.Search:
        onOpenSearch();
        break;
      default:
        break;
    }
  }

  //! bad solution
  const shouldDisable = (icon: ObjBottomIcons) => {
    return false;

    const hasCheckItem = items.find((item) => item.Type === ItemType.Grocery || item.Type === ItemType.Medicine || item.Type === ItemType.Exercise || item.Type === ItemType.Step || item.Type === ItemType.House);

    switch (icon) {
      case ObjBottomIcons.Archive:
        return isPaletteOpen || isTagOpen || isMultiSelectOpen || isSelectingPastePos || isItemsOpen || isItemOpenLocked || isCheckedOpen || isSearchOpen;
      case ObjBottomIcons.Unarchive:
        return isPaletteOpen || isTagOpen || isMultiSelectOpen || isSelectingPastePos || isItemsOpen || isItemOpenLocked || isCheckedOpen || isSearchOpen;
      case ObjBottomIcons.Palette:
        return isTagOpen || isMultiSelectOpen || isSelectingPastePos || isItemsOpen || isItemOpenLocked || isCheckedOpen || isSearchOpen;
      case ObjBottomIcons.Checked:
        return isPaletteOpen || isTagOpen || isMultiSelectOpen || isSelectingPastePos || isItemsOpen || isItemOpenLocked || isSearchOpen || !hasCheckItem;
      case ObjBottomIcons.Tags:
        return isPaletteOpen || isMultiSelectOpen || isSelectingPastePos || isItemsOpen || isItemOpenLocked || isCheckedOpen || isSearchOpen;
      case ObjBottomIcons.Sorted:
        return isPaletteOpen || isTagOpen || isMultiSelectOpen || isSelectingPastePos || isItemsOpen || isItemOpenLocked || isCheckedOpen || isSearchOpen || items.length < 2;
      case ObjBottomIcons.Pos:
        return isPaletteOpen || isTagOpen || isItemsOpen || isItemOpenLocked || isCheckedOpen || isSearchOpen;
      case ObjBottomIcons.Add:
        return isPaletteOpen || isTagOpen || isMultiSelectOpen || isSelectingPastePos || isCheckedOpen || isSearchOpen;
      case ObjBottomIcons.Search:
        return isPaletteOpen || isTagOpen || isMultiSelectOpen || isSelectingPastePos || isCheckedOpen || isItemsOpen || isItemOpenLocked || items.length < 2;
      case ObjBottomIcons.IsLocked:
        return isPaletteOpen || isTagOpen || isMultiSelectOpen || isSelectingPastePos || isCheckedOpen || isSearchOpen;
      case ObjBottomIcons.Menu:
        return isPaletteOpen || isTagOpen || isMultiSelectOpen || isSelectingPastePos || isCheckedOpen || isSearchOpen;
      default:
        return false;
    }
  }

  //Test if should be showed in the side hidden menu or in the main bottom bar
  const shouldShowBottomIcon = (icon: ObjBottomIcons, invert: boolean = false) => {
    if(invert) return !userPrefs.ObjectivesPrefs.iconsToDisplay.includes(ObjBottomIcons[icon]);
    return userPrefs.ObjectivesPrefs.iconsToDisplay.includes(ObjBottomIcons[icon]);
  }

  const getBottomMenuView = () => {
    const showMenu: boolean = userPrefs.ObjectivesPrefs.iconsToDisplay.length < 12;

    return(
      <View style={s.bottomContainer}>
        {showMenu && 
          <PressImage 
            pressStyle={gs.baseBiggerImageContainer}
            style={s.image}
            disable={shouldDisable(ObjBottomIcons.Menu)}
            disableStyle={s.imageFade}
            selected={isMenuIconOpen}
            selectedStyle={s.bottomContainerSelected}
            onPress={()=>showButtomItem(ObjBottomIcons.Menu)}
            source={require('../../../public/images/menu.png')}></PressImage>
        }
        {getButtonIconViews(ObjBottomIcons.Unarchive, false)}
        {getButtonIconViews(ObjBottomIcons.Archive, false)}
        {getButtonIconViews(ObjBottomIcons.Palette, false)}
        {getButtonIconViews(ObjBottomIcons.Tags, false)}
        {getButtonIconViews(ObjBottomIcons.Sorted, false)}
        {getButtonIconViews(ObjBottomIcons.Search, false)}
        {getButtonIconViews(ObjBottomIcons.Pos, false)}
        {getButtonIconViews(ObjBottomIcons.FoldUnfoldAll, false)}
        {getButtonIconViews(ObjBottomIcons.GoingTopDown, false)}
        {getButtonIconViews(ObjBottomIcons.IsLocked, false)}
        {getButtonIconViews(ObjBottomIcons.Checked, false)}
        {getButtonIconViews(ObjBottomIcons.Add, false)}
      </View>
    )
  }

  const onChangeDev = () => {
    setDevItemNumber(!devItemNumber);
  }

  const itemsListScrollTo = (itemId?: string) => {
    if(itemId === undefined){
      listRef.current?.scrollToIndex({ index: 0, animated: true })
      return;
    }

    const newTo = tempFilteredItems.findIndex((e: Item)=>{
      return e.ItemId === itemId;
    });

    if(listRef){
      try {
        listRef.current?.scrollToIndex({ index: newTo, animated: true })
      } catch (err) {}
    }
    else{
      log.r(`itemsListScrollTo to ${newTo} and length is ${tempFilteredItems}`);
    }
  }

  const getTitleView = () => {
    return (
      <View style={s.titleContainer}>
        <PressInput 
          text={obj.Title}
          objTheme={o} 
          onDone={onChangeTitle}
          confirmDelete={true}
          onDelete={onDeleteObjective} 
          onEditingState={onIsEditingTitle}
          textStyle={s.titleTextStyle}
          inputStyle={s.inputStyle}
          containerStyle={s.titleContainerStyle}
          trashImageStyle={{tintColor: o.trashicontint}}
          onLongPress={onChangeDev}>
        </PressInput>
      </View>
    )
  }

  ///All items view
  const getListView = () => {
    let filteredItems:Item[] = [];
    let partialItems:Item[] = [];

    ///Item in the beggining to put moving items from the start "click to be the first"
    if(isSelectingPastePos){ 
      const itemFake: GenericItem = {ItemId: '-', LastModified: '', Pos: -1, Title: 'click to be the first',Type: ItemType.StartPlaceholder, UserIdObjectiveId: '-'}
      filteredItems.push(itemFake)
    }

    let isAfterDivider = false;
    let isDividerOpen = true;
    for(let i = 0; i < items.length; i++){
      let current = items[i];
      let shouldAddStep = true;
      let shouldAddGrocery = true;
      let shouldAddExercise = true;
      let shouldAddMedicine = true;
      let shouldAddHouse = true;
      let shouldAddIsInSearch = true;

      if(itemSearchToShow.length && !itemSearchToShow.includes(current.ItemId)) shouldAddIsInSearch = false;

      if(current.Type === ItemType.Divider) {
        isAfterDivider = true;
        if(partialItems.length > 1 && !obj.IsShowingCheckedStep){
          filteredItems.push(...partialItems);
        }
        partialItems = [];
        const divider = current as Divider;
        if(obj.IsShowingCheckedStep && shouldAddIsInSearch)
          filteredItems.push(divider);
        else if(shouldAddIsInSearch)
          partialItems.push(divider);
        isDividerOpen = divider.IsOpen;
      }
      else{
        if(current.Type === ItemType.Step && !obj.IsShowingCheckedStep) shouldAddStep = !(current as Step).Done;
        if(current.Type === ItemType.Grocery && !obj.IsShowingCheckedGrocery) shouldAddGrocery = !(current as Grocery).IsChecked;
        if(current.Type === ItemType.Exercise && !obj.IsShowingCheckedExercise) shouldAddExercise = !(current as Exercise).IsDone;
        if(current.Type === ItemType.Medicine && !obj.IsShowingCheckedMedicine) shouldAddMedicine = !(current as Medicine).IsChecked;
        if(current.Type === ItemType.House && !obj.IsShowingCheckedStep) shouldAddHouse = !(current as House).WasContacted;
        if(isDividerOpen && shouldAddStep && shouldAddGrocery && shouldAddExercise && shouldAddMedicine && shouldAddHouse && shouldAddIsInSearch){
          if(isAfterDivider && !obj.IsShowingCheckedStep)
            partialItems.push(current);
          else
            filteredItems.push(current);
        }
        else{
        }
      }
    }

    if(partialItems.length > 1 && !obj.IsShowingCheckedStep){
      filteredItems.push(...partialItems);
    }

    /// Hidden items text
    hiddenItems = (items.length - filteredItems.length);
    const hiddenItemsText = hiddenItems.toString() + ' hidden item' + (hiddenItems > 1?'s.':'.');
    if(hiddenItems > 0) filteredItems.push({ItemId:'', LastModified: '', Pos:-1, UserIdObjectiveId: '',  Type: ItemType.HiddenItemText, Title: hiddenItemsText, Fade: true } as GenericItem);

    tempFilteredItems = filteredItems;

    /// End of list separator
    filteredItems.push({ItemId:'', LastModified: '', Pos:-1, UserIdObjectiveId: '',  Type: ItemType.Separator, Title: '', Fade: false} as GenericItem)
    return <FlatList ref={listRef} data={filteredItems} renderItem={getItemView}></FlatList>
  }

  const getMenuIconView = () => {
    if(!isMenuIconOpen) return;

    return(
      <View style={s.itemsContainer}>
        {getButtonIconViews(ObjBottomIcons.Unarchive, true)}
        {getButtonIconViews(ObjBottomIcons.Archive, true)}
        {getButtonIconViews(ObjBottomIcons.Palette, true)}
        {getButtonIconViews(ObjBottomIcons.Tags, true)}
        {getButtonIconViews(ObjBottomIcons.Sorted, true)}
        {getButtonIconViews(ObjBottomIcons.Search, true)}
        {getButtonIconViews(ObjBottomIcons.Pos, true)}
        {getButtonIconViews(ObjBottomIcons.IsLocked, true)}
        {getButtonIconViews(ObjBottomIcons.Checked, true)}
        {getButtonIconViews(ObjBottomIcons.Add, true)}
        {getButtonIconViews(ObjBottomIcons.FoldUnfoldAll, true)}
        {getButtonIconViews(ObjBottomIcons.GoingTopDown, true)}
      </View>
    )
  }

  const getPaletteView = () => {
    if(!isPaletteOpen) return;

    return(
      <View style={s.itemsContainer}>
        <Pressable style={[s.colorPalette, s.colorPaletteNoTheme]} onPress={() => onSelectColor('noTheme')}></Pressable>
        <Pressable style={[s.colorPalette, s.colorPaletteBlue]} onPress={() => onSelectColor('blue')}></Pressable>
        <Pressable style={[s.colorPalette, s.colorPaletteRed]} onPress={() => onSelectColor('red')}></Pressable>
        <Pressable style={[s.colorPalette, s.colorPaletteGreen]} onPress={() => onSelectColor('green')}></Pressable>
        <Pressable style={[s.colorPalette, s.colorPaletteWhite]} onPress={() => onSelectColor('white')}></Pressable>
        <Pressable style={[s.colorPalette, s.colorPaletteCyan]} onPress={() => onSelectColor('cyan')}></Pressable>
        <Pressable style={[s.colorPalette, s.colorPalettePink]} onPress={() => onSelectColor('pink')}></Pressable>
      </View>
    )
  }

  const getEditTagView = ():JSX.Element => {
    if(!isTagOpen) return <></>;

    return(
      <View style={s.tagEditingContainer}>
        <Text style={s.tagEditTagTitle}>AVAILABLE</Text>
        {getAvailableTagList()}
        <Text style={s.tagEditTagTitle}>TAGS</Text>
        {getTagList()}
        <Text style={s.tagEditTagTitle}>NEW</Text>
        <View style={s.tagListContainer}>
          <PressImage pressStyle={[s.imagePress]} style={[s.cancelImage]} onPress={onEraseNewTag} source={require('../../../public/images/eraser.png')}></PressImage>
          <TextInput
            style={s.inputStyle}
            value={newTag}
            onChangeText={setNewTag}
            placeholderTextColor={o.itemtextfade}
            placeholder="press enter to insert tag"
            submitBehavior="submit"
            onSubmitEditing={onHandleSubmit}
            autoFocus>
          </TextInput>
          <PressImage pressStyle={[s.imagePress]} style={[s.doneImage]} onPress={() => {setIsTagOpen(false)}} source={require('../../../public/images/done.png')}></PressImage>
        </View>
      </View>
    )
  }

  const getItemsView = () => {
    if(!isItemsOpen) return <></>;

    return(
      <View style={s.itemsContainer}>
        {/* <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Wait)}} source={require('../../../public/images/wait.png')}></PressImage> */}
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.House)}} source={require('../../../public/images/home.png')}></PressImage>
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Link)}} source={require('../../../public/images/link.png')}></PressImage>
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Exercise)}} source={require('../../../public/images/exercise-filled.png')}></PressImage>
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Divider)}} source={require('../../../public/images/minus.png')}></PressImage>
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Grocery)}} source={require('../../../public/images/grocery-filled.png')}></PressImage>
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.imageBig} onPress={() => {choseNewItemToAdd(ItemType.Medicine)}} source={require('../../../public/images/medicine-filled.png')}></PressImage>
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Location)}} source={require('../../../public/images/location-filled.png')}></PressImage>
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Question)}} source={require('../../../public/images/questionfilled.png')}></PressImage>
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Note)}} source={require('../../../public/images/note.png')}></PressImage>
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Step)}} source={require('../../../public/images/step-filled.png')}></PressImage>
        <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={()=>{popMessage('Image: Under construction...', MessageType.Error)}} source={require('../../../public/images/image-filled.png')}></PressImage>
        <PressText style={gs.baseBiggerImageContainer} text={newItemsMultiplier.toString() + 'x'} onPress={increaseNewItemMultiplier} textStyle={[s.image, {fontWeight: 'bold', color: o.itemtext}]}></PressText>
      </View>
    )
  }

  const getMultiSelectView = () => {
    if(!isMultiSelectOpen) return <></>;
    return(
      <View style={s.multiSelectContainer}>
        {!isSelectingPastePos && isSelectingAll?
          <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={() => {multiSelectSelectAll(false)}} source={require('../../../public/images/checked.png')}></PressImage>
          :
          <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={() => {multiSelectSelectAll(true)}} source={require('../../../public/images/unchecked.png')}></PressImage>
        }
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={() => {eraseItems()}} source={require('../../../public/images/eraser.png')} disable={multiSelectAction===null} disableStyle={s.imageFade} confirm></PressImage>
        {!isSelectingPastePos && <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={() => {moveItems()}} source={require('../../../public/images/next.png')} disable={selectingItems.length===0} disableStyle={s.imageFade}></PressImage>}
        {!isSelectingPastePos && <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={() => {copyItems()}} source={require('../../../public/images/copy.png')} disable={selectingItems.length===0} disableStyle={s.imageFade}></PressImage>}
        <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={() => {setIsSelectingPastePos(true); popMessage('Select place to move after.')}} source={require('../../../public/images/insert.png')} disable={multiSelectAction===null} disableStyle={s.imageFade}></PressImage>
        {!isSelectingPastePos && <PressImage pressStyle={gs.baseBiggerImageContainer} style={s.image} onPress={multiSelectDeleteItems} source={require('../../../public/images/trash.png')} disable={selectingItems.length===0} disableStyle={s.imageFade} confirm></PressImage>}
      </View>
    )
  }

  const getSideMenus = () => {
    return(
      <>
        {getItemsView()}
        {getPaletteView()}
        {getMenuIconView()}
        {getMultiSelectView()}
        {getUncheckedCheckedView()}
      </>
    )
  }

  const s = StyleSheet.create(
  {
    objEmptyContainer:{
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      height: '100%',
      color: 'beige',
    },
    objEmptyText:{
      fontSize: 15,
      color: 'beige',
    },
    container: {
      flex: 1,
      backgroundColor: o.objbk,
    },
    titleContainer:{
      flexDirection: 'row',
      minHeight: 45,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: o.itembkdark,
      marginBottom: 2,

      borderColor: o.bordercolor,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderStyle: 'solid',
    },
    titleContainerStyle: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleTextStyle: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
      color: o.objtitle,
      width: '100%',
    },
    bodyListSpacer:{
      height: 700,
    },
    startPlaceholderContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: o.marginHorizontal,
      marginVertical: o.marginVertical,

      minHeight: 45,
      borderColor: o.itemtext,
      borderWidth: 1,
      borderStyle: 'dashed',
      borderRadius: 5,
    },
    startplaceholderText:{
      color: o.itemtext,
      fontWeight: 'bold',
    },
    hiddenTextContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: o.marginHorizontal,
      marginVertical: o.marginVertical,
      minHeight: 45,
    },
    hiddenTextText:{
      color: o.itemtextfade,
      fontWeight: 'bold',
    },
    bodyContainer:{
      flex: 1,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    bottomContainer:{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: o.itembk,

      // borderColor: o.bordercolor,
      // borderTopWidth: 1,
      // borderStyle: 'solid',
    },
    tagEditingContainer:{
      justifyContent: 'center',
      flexWrap: 'wrap',
      backgroundColor: o.itembkdark,
      marginBottom: 10,
      
      borderColor: o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    tagListContainerScroll:{
      marginVertical: 5,

      borderColor: o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    tagListContainer:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      margin: 5,
    },
    tagInputContainerStyle:{
      justifyContent: 'center',
      alignItems: 'center',
    },
    tagInputContainer:{
      color: o.objtitle,
      fontWeight: 'bold',
      borderColor: o.objtitle,
    },
    tagInputText:{
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 20,
      color: o.objtitle,
    },
    tagEditTagTitle:{
      width: '100%',
      verticalAlign: 'middle',
      paddingTop: 2,
      paddingHorizontal: 10,

      fontSize: 15,
      fontWeight: 'bold',
      color: o.objtitle,
    },
    tagContainer:{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minWidth: 50,
      margin: 2,
      padding: 5,
      backgroundColor: o.objbk,
      
      borderColor: o.bordercolor,
      borderWidth: 1,
      borderRadius: 30,
      borderStyle: 'solid',
    },
    tagText:{
      color: o.objtitle,
    },
    tagContainerPin:{
      backgroundColor: o.objtitle,
    },
    tagTextPin:{
      color: o.objbk,
    },
    noObjectiveTag:{
      width: '100%',
      verticalAlign: 'middle',
      paddingVertical: 5,
      paddingHorizontal: 10,
      lineHeight: 37,

      fontSize: 10,
      color: o.itemtextfade,
    },
    searchContainer:{
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: o.itembkdark,
      marginBottom: 5,
      minHeight: 60,
      paddingHorizontal: 10,
      paddingVertical: 5,
      
      borderColor: o.bordercolor,
      borderBottomWidth: 1,
      borderTopWidth: 1,
      borderStyle: 'solid',
    },
    searchTitle:{
      verticalAlign: 'middle',
      textAlign: 'center',
      width: '100%',
      color: o.itemtext,
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

      color: theme.textcolor,
      
      borderColor: o.itemtextfade,
      borderBottomWidth: 1,
      borderStyle: 'solid',
    },
    imagePress:{
      minHeight: 30,
      minWidth: 30,
      marginLeft: 10,
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelImage:{
      ...gs.baseImage,
      tintColor: o.cancelicontint,
    },
    doneImage:{
      ...gs.baseImage,
      tintColor: o.doneicontint,
    },
    itemsContainer:{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: "flex-end",
      borderColor: o.bordercolor,
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
      backgroundColor: o.itembk,
      margin: 5,
    },
    list:{
      flex: 1,
      width: "100%",
    },
    bottomContainerSelected:{
      backgroundColor: theme.backgroundcolordarker,
    },
    imageSmall:{
      ...gs.baseVerySmallImage,
      tintColor: o.icontintcolor,
    },
    image:{
      ...gs.baseSmallImage,
      tintColor: o.icontintcolor,
    },
    imageBig:{
      ...gs.baseImage,
      tintColor: o.icontintcolor,
    },
    itemRow:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    devItemRowNumber:{
      verticalAlign: 'middle',
      textAlign: 'center',
      color: o.itemtext,
      marginLeft: 5,
      minWidth: 20,
    },
    redImageColor:{
      tintColor: o.trashicontint,
    },
    greenImageColor:{
      tintColor: o.doneicontint,
    },
    imageFade:{
      ...gs.baseSmallImage,
      tintColor: o.icontintcolorfade,
    },
    imageLock: {
      ...gs.baseSmallImage,
      tintColor: o.trashicontint,
    },
    colorPalette: {
      width: 40,
      height: 40,
      borderRadius: 20,
      margin: 5,

      borderColor: 'black',
      borderWidth: 1,
      borderStyle: 'solid',
    },
    colorPaletteNoTheme:{
      backgroundColor: userPrefs.theme === 'dark'? colorPalette.objNoTheme:colorPalette.objNoThemeLight
    },
    colorPaletteBlue:{
      backgroundColor: userPrefs.theme === 'dark'? colorPalette.objBlue:colorPalette.objBlueLight
    },
    colorPaletteRed:{
      backgroundColor: userPrefs.theme === 'dark'? colorPalette.objRed:colorPalette.objRedLight
    },
    colorPaletteGreen:{
      backgroundColor: userPrefs.theme === 'dark'? colorPalette.objGreen:colorPalette.objGreenLight
    },
    colorPaletteWhite:{
      backgroundColor: userPrefs.theme === 'dark'? colorPalette.objWhite:colorPalette.objWhiteLight
    },
    colorPaletteCyan:{
      backgroundColor: userPrefs.theme === 'dark'? colorPalette.objCyan:colorPalette.objCyanLight
    },
    colorPalettePink:{
      backgroundColor: userPrefs.theme === 'dark'? colorPalette.objPink:colorPalette.objPinkLight
    },
    emptyImageContainer:{
      height: 40,
      width: 40,
      margin: 5,
    },
    multiSelectContainer:{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: "flex-end",
      borderColor: o.bordercolor,
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
      backgroundColor: o.itembk,
      margin: 5,
    },
  });

  return (
    (currentObjectiveId !== ''?
    <View style={s.container}>
      {getTitleView()}
      {getEditTagView()}
      {getSearchView()}
      <View style={s.bodyContainer}>
        {userPrefs.isRightHand?
        <>
          {getListView()}
          {getSideMenus()}
        </>
        :
        <>
          {getSideMenus()}
          {getListView()}
        </>
      }
      </View>
      {getBottomMenuView()}
    </View>
    :
    <View style={s.objEmptyContainer}>
      <Text style={s.objEmptyText}>NO OBJECTIVE SELECTED</Text>
    </View>
    )
  );
};


export default ObjectiveView;
