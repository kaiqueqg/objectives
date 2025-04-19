import React from "react";
import { View, StyleSheet, Pressable, Vibration, Alert, FlatList, Text } from "react-native";
import * as ExpoLocation from 'expo-location';

import { colorPalette, getObjTheme, globalStyle as gs } from "../../Colors";

import { useUserContext } from "../../Contexts/UserContext";
import { useLogContext } from "../../Contexts/LogContext";
import { useStorageContext } from "../../Contexts/StorageContext";

import PressText from "../../PressText/PressText";
import PressImage from "../../PressImage/PressImage";
import PressInput from "../../PressInput/PressInput";

import { Item, ItemType, Note, Objective, Question, Step, Views, Wait, Location, Divider, Grocery, Pattern, MessageType, Medicine, Exercise, Weekdays, StepImportance, ItemNew, Link, Image } from "../../Types";
import { useEffect, useState } from "react";

import QuestionView, {New as QuestionNew} from "./QuestionView/QuestionView";
import StepView, {New as StepNew} from "./StepView/StepView";
import WaitView, {New as WaitNew} from "./WaitView/WaitView";
import NoteView, {New as NoteNew} from "./NoteView/NoteView";
import LocationView, {New as LocationNew} from "./LocationView/LocationView";
import DividerView, {New as DividerNew} from "./DividerView/DividerView";
import GroceryView, {New as GroceryNew} from "./GroceryView/Grocery";
import MedicineView, {New as MedicineNew} from "./MedicineView/MedicineView";
import ItemFakeView, {New as ItemFakeNew} from "./ItemFakeView/ItemFakeView";
import ExerciseView, {New as ExerciseNew} from "./ExerciseView/ExerciseView";
import LinkView, {New as LinkNew} from "./LinkView/LinkView";
import ImageView, {New as ImageNew} from "./ImageView/ImageView";

export interface ObjectiveViewProps {
  obj: Objective,
  scrollTo?: (index: number) => void,
  index?: number,
}
const ObjectiveView = (props: ObjectiveViewProps) => {
  const { log } = useLogContext();
  const { storage, } = useStorageContext();
  const { theme, fontTheme, 
    user, userPrefs, 
    objectives, putObjective, deleteObjective, 
    currentObjectiveId, 
    writeItems, readItems, putItems, deleteItem,
    putAvailableTags, removeAvailableTags,
    putSelectedTags, removeSelectedTags,
    selectedTags, writeSelectedTags,
    currentView, writeCurrentView } = useUserContext();
    const { obj } = props;
  const o = getObjTheme(props.obj.Theme);

  const [items, setItems] = useState<Item[]>([]);
  const [isItemsOpen, setIsItemsOpen] = useState<boolean>(false);
  const [isItemOpenLocked, setIsItemOpenLocked] = useState<boolean>(false);
  const [isTagOpen, setIsTagOpen] = useState<boolean>(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [isCheckedOpen, setIsCheckedOpen] = useState<boolean>(false);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isEditingPos, setIsEditingPos] = useState<boolean>(false);
  const [isEndingPos, setIsEndingPos] = useState<boolean>(false);
  const [itemsSelected, setItemsSelected] = useState<Item[]>([]);

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
      if (status !== 'granted') log.popMessage('Permission to access location was denied', MessageType.Error, 3);

      const isEnabled = await ExpoLocation.hasServicesEnabledAsync();
      if(!isEnabled && userPrefs.allowLocation) log.popMessage('Turn on phone GPS to get distance to places!', MessageType.Alert, 5);
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
    if(!user) return log.err('No user.');
    const baseItem = {...ItemNew(user.UserId, obj.ObjectiveId, await storage.randomId(), type, pos?pos:items.length)}

    switch (type) {
      case ItemType.Divider:
        addNewItem({...baseItem, ...DividerNew()}, pos);
        break;
      case ItemType.Step:
        addNewItem({...baseItem, ...StepNew()}, pos);
        break;
      case ItemType.Question:
        addNewItem({...baseItem, ...QuestionNew()}, pos);
        break;
      case ItemType.Wait:
        addNewItem({...baseItem, ...WaitNew()}, pos);
        break;
      case ItemType.Note:
        addNewItem({...baseItem, ...NoteNew()}, pos);
        break;
      case ItemType.Location:
        addNewItem({...baseItem, ...LocationNew()}, pos);
        break;
      case ItemType.Grocery:
        addNewItem({...baseItem, ...GroceryNew()}, pos);
        break;
      case ItemType.Medicine:
        addNewItem({...baseItem, ...MedicineNew()}, pos);
        break;
      case ItemType.Exercise:
        addNewItem({...baseItem, ...ExerciseNew()}, pos);
        break;
      case ItemType.ItemFake:
        addNewItem({...baseItem, ...ItemFakeNew()}, pos);
        break;
      case ItemType.Link:
        addNewItem({...baseItem, ...LinkNew()}, pos);
        break;
      case ItemType.Image:
        addNewItem({...baseItem, ...ImageNew()}, pos);
        break;
      default:
        break;
    }
  }

  const addNewItem = async (item: any, pos?:number) => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    let sending:Item[] = [];
    if(pos !== undefined && pos !== null) {
      const newList = items.filter((i: Item) => !itemsSelected.includes(i));
      const before = newList.slice(0, pos+1);
      const after = newList.slice(pos+1);

      let ajustedList = [...before, ...[item], ...after];

      for(let i = 0; i < ajustedList.length; i++){
        sending.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
      }
    }
    else{
      sending.push(item);
    }

    await putItems(obj.ObjectiveId, sending);
    loadItems();

    if(!isItemOpenLocked) setIsItemsOpen(false);
  }

  const onDeleteObjective = async () => {
    await deleteObjective(obj);
    writeCurrentView(Views.ListView);
  }

  const onChangeTitle = async (newText: string) => {
    await putObjective({...obj, Title: newText.trim(), LastModified: (new Date()).toISOString() });
  }

  const onArchive = async () => {
    await putObjective({...obj, IsArchived: true, LastModified: (new Date()).toISOString() });
  }

  const onUnarchive = async () => {
    await putObjective({...obj, IsArchived: false, LastModified: (new Date()).toISOString() });
  }

  const onChangeIsPaletteOpen = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    setIsPaletteOpen(!isPaletteOpen);
  }

  const onChangeIsObjPrefsOpen = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    setIsPaletteOpen(false);
    setIsItemsOpen(false);
    setIsEditingPos(false);
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

  const startEditingPos = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    setIsEditingPos(true);
  }

  const cancelEditingPos = () => {
    setItemsSelected([]);
    setIsEditingPos(false);
    setIsEndingPos(false);
  }

  const onEditingPosTo = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    setIsEndingPos(true);
  }

  const addRemoveToSelected = (item: Item) => {
    const filteredList = itemsSelected.filter((i) => i.ItemId !== item.ItemId);

    if(filteredList.length !== itemsSelected.length){
      setItemsSelected(filteredList);
    }
    else{
      setItemsSelected([...itemsSelected, item]);
    }
  }

  const endChangingPos = (itemTo: Item) => {
    const newList = items.filter((i: Item) => !itemsSelected.includes(i));
    const index = newList.indexOf(itemTo);
    const before = newList.slice(0, index+1);
    const after = newList.slice(index+1);

    let ajustedList = [...before, ...itemsSelected, ...after];

    let finalList:Item[] = [];
    for(let i = 0; i < ajustedList.length; i++){
      finalList.push({...ajustedList[i], Pos: i, LastModified: (new Date()).toISOString()});
    }

    writeItems(obj.ObjectiveId, finalList);
    setItems(finalList);

    cancelEditingPos();
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

  //Responsable for open, close and lock icon and menu.
  const addingNewItem = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    if(isItemsOpen){
      if(isItemOpenLocked){ //turn all off
        setIsItemOpenLocked(false);
        setIsItemsOpen(false);
      }
      else{//adding but now lock
        setIsItemOpenLocked(true);
      }
    }
    else{//start adding item
      setIsItemsOpen(true);
    }
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

  const onChangeTags = async (tag: string) => {
    const uniqueTags = Array.from(new Set([...obj.Tags, tag.trim()]));
    await putObjective({...obj, Tags: [...uniqueTags], LastModified: (new Date()).toISOString() });
    await putAvailableTags([tag]);
    await putSelectedTags([tag]);
  }

  const removeTag = async (tag: string) => {
    await putObjective({...obj, Tags: [...obj.Tags.filter((i)=>{return i !== tag})], LastModified: (new Date()).toISOString() });
    await removeAvailableTags([tag]);
    await removeSelectedTags([tag]);
  }

  const getTagList = () => {
    let tagList = [];

    for(let i = 0; i < obj.Tags.length; i++){
      const cTag = obj.Tags[i];
      tagList.push(
        <PressText key={cTag} onPress={()=>removeTag(cTag)} style={s.tagContainer} textStyle={s.tagText} text={cTag}></PressText>
      )
    }
    if(obj.Tags.length === 0){
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

  const getList = () => {
    let filteredItems:Item[] = [];
    let partialItems:Item[] = [];

    if(isEditingPos && isEndingPos){
      const itemFake:Item = {ItemId: '-', LastModified: '', Pos: -1, Type: ItemType.ItemFake, UserIdObjectiveId: '-'}
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

      if(current.Type === ItemType.Divider) {
        isAfterDivider = true;
        if(partialItems.length > 1 && !obj.IsShowingCheckedStep){
          filteredItems.push(...partialItems);
        }
        partialItems = [];
        const divider = current as Divider;
        if(obj.IsShowingCheckedStep)
          filteredItems.push(divider);
        else
          partialItems.push(divider);
        isDividerOpen = divider.IsOpen;
      }
      else{
        if(current.Type === ItemType.Step && !obj.IsShowingCheckedStep) shouldAddStep = !(current as Step).Done;
        if(current.Type === ItemType.Grocery && !obj.IsShowingCheckedGrocery) shouldAddGrocery = !(current as Grocery).IsChecked;
        if(current.Type === ItemType.Exercise && !obj.IsShowingCheckedExercise) shouldAddExercise = !(current as Exercise).IsDone;
        if(current.Type === ItemType.Medicine && !obj.IsShowingCheckedMedicine) shouldAddMedicine = !(current as Medicine).IsChecked;
        if(isDividerOpen && shouldAddStep && shouldAddGrocery && shouldAddExercise && shouldAddMedicine){
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

    filteredItems.push({ItemId:'', LastModified: '', Pos:-1, UserIdObjectiveId: '',  Type: ItemType.Unknown})

    return <FlatList data={filteredItems} renderItem={getItemView}></FlatList>
  }

  const getItemView = ({item}:any):JSX.Element => {
    let rtnItem;
    const itemSelected = itemsSelected.find((i: Item)=>i.ItemId === item.ItemId);
    if(item.Type === ItemType.Divider){
      rtnItem = <DividerView 
        key={item.ItemId}
        loadMyItems={loadItems}
        isEditingPos={isEditingPos}
        isEndingPos={isEndingPos}
        isSelected={itemSelected?true:false}
        objTheme={o}
        divider={item as Divider}
        orderDividerItems={orderDividerItems}
        onDeleteItem={onDeleteItem} 
        choseNewItemToAdd={(type: ItemType, pos?:number) => {choseNewItemToAdd(type, pos)}}
        ></DividerView>  
    }
    else if(item.Type === ItemType.Step){
      rtnItem = <StepView key={item.ItemId} isEditingPos={isEditingPos} isEndingPos={isEndingPos} isSelected={itemSelected?true:false} loadMyItems={loadItems} objTheme={o} step={item as Step} onDeleteItem={onDeleteItem} ></StepView>
    }
    else if(item.Type === ItemType.Grocery){
      rtnItem = <GroceryView key={item.ItemId} isEditingPos={isEditingPos} isEndingPos={isEndingPos} isSelected={itemSelected?true:false} loadMyItems={loadItems} objTheme={o} grocery={item as Grocery} onDeleteItem={onDeleteItem} ></GroceryView>
    }
    else if(item.Type === ItemType.Medicine){
      rtnItem = <MedicineView key={item.ItemId} isEditingPos={isEditingPos} isEndingPos={isEndingPos} isSelected={itemSelected?true:false} loadMyItems={loadItems} objTheme={o} medicine={item as Medicine} onDeleteItem={onDeleteItem} ></MedicineView>
    }
    else if(item.Type === ItemType.Exercise){
      rtnItem = <ExerciseView key={item.ItemId} isEditingPos={isEditingPos} isEndingPos={isEndingPos} isSelected={itemSelected?true:false} loadMyItems={loadItems} objTheme={o} exercise={item as Exercise} onDeleteItem={onDeleteItem} ></ExerciseView>
    }
    else if(item.Type === ItemType.Location){
      rtnItem = <LocationView key={item.ItemId} isEditingPos={isEditingPos} isEndingPos={isEndingPos} isSelected={itemSelected?true:false} loadMyItems={loadItems} objTheme={o} location={item as Location} onDeleteItem={onDeleteItem} ></LocationView>
    }
    else if(item.Type === ItemType.Note){
      rtnItem = <NoteView key={item.ItemId} isEditingPos={isEditingPos} isEndingPos={isEndingPos} isSelected={itemSelected?true:false} loadMyItems={loadItems} objTheme={o} note={item as Note} onDeleteItem={onDeleteItem} ></NoteView>
    }
    else if(item.Type === ItemType.Question){
      rtnItem = <QuestionView key={item.ItemId} isEditingPos={isEditingPos} isEndingPos={isEndingPos} isSelected={itemSelected?true:false} loadMyItems={loadItems} objTheme={o} question={item as Question} onDeleteItem={onDeleteItem} ></QuestionView>
    }
    else if(item.Type === ItemType.Wait){
      rtnItem = <WaitView key={item.ItemId} isEditingPos={isEditingPos} isEndingPos={isEndingPos} isSelected={itemSelected?true:false} loadMyItems={loadItems} objTheme={o} wait={item as Wait} onDeleteItem={onDeleteItem} ></WaitView>
    }
    else if(item.Type === ItemType.Link){
      rtnItem = <LinkView key={item.ItemId} isEditingPos={isEditingPos} isEndingPos={isEndingPos} isSelected={itemSelected?true:false} loadMyItems={loadItems} objTheme={o} link={item as Link} onDeleteItem={onDeleteItem} ></LinkView>
    }
    else if(item.Type === ItemType.Image){
      rtnItem = <ImageView key={item.ItemId} isEditingPos={isEditingPos} isEndingPos={isEndingPos} isSelected={itemSelected?true:false} loadMyItems={loadItems} objTheme={o} image={item as Image} onDeleteItem={onDeleteItem} ></ImageView>
    }
    else if(item.Type === ItemType.ItemFake){
      rtnItem = <ItemFakeView objTheme={o}></ItemFakeView>
    }
    else{
      return <View style={{height:700}}></View>
    }

    return (
      <View 
        style={s.itemRow}
        onTouchEnd={() => {isEditingPos && (isEndingPos? endChangingPos(item) : addRemoveToSelected(item))}}>
        {rtnItem}
      </View>
    )
  }

  const showBottomItem = (icon: BottomIcons) => {
    setIsPaletteOpen(false);
    setIsTagOpen(false);
    if(icon !== BottomIcons.Pos) setIsEditingPos(false);
    if(icon !== BottomIcons.Pos) setIsEndingPos(false);
    if(icon !== BottomIcons.Add) setIsItemsOpen(false);
    if(icon !== BottomIcons.Add) setIsItemOpenLocked(false);

    switch (icon) {
      case BottomIcons.Archive:
        onArchive();
        break;
      case BottomIcons.Unarchive:
        onUnarchive();
        break;
      case BottomIcons.Palette:
        onChangeIsPaletteOpen();
        break;
      case BottomIcons.Checked:
        onChangeShowingItemsMenuOpen();
        break;
      case BottomIcons.Tags:
        onOpenTagList();
        break;
      case BottomIcons.Sorted:
        orderItems();
        break;
      case BottomIcons.Pos:
        startEditingPos();
        break;
      case BottomIcons.Add:
        addingNewItem();
        break;
      default:
        break;
    }
  }

  const shouldDisable = (icon: BottomIcons) => {
    switch (icon) {
      case BottomIcons.Archive:
        return isPaletteOpen || isTagOpen || isEditingPos || isEndingPos || isItemsOpen || isItemOpenLocked || isCheckedOpen;
      case BottomIcons.Unarchive:
        return isPaletteOpen || isTagOpen || isEditingPos || isEndingPos || isItemsOpen || isItemOpenLocked || isCheckedOpen;
      case BottomIcons.Palette:
        return isTagOpen || isEditingPos || isEndingPos || isItemsOpen || isItemOpenLocked || isCheckedOpen;
      case BottomIcons.Checked:
        return isPaletteOpen || isTagOpen || isEditingPos || isEndingPos || isItemsOpen || isItemOpenLocked;
      case BottomIcons.Tags:
        return isPaletteOpen || isEditingPos || isEndingPos || isItemsOpen || isItemOpenLocked || isCheckedOpen;
      case BottomIcons.Sorted:
        return isPaletteOpen || isTagOpen || isEditingPos || isEndingPos || isItemsOpen || isItemOpenLocked || isCheckedOpen;
      case BottomIcons.Pos:
        return isPaletteOpen || isTagOpen || isItemsOpen || isItemOpenLocked || items.length < 2 || isCheckedOpen;
      case BottomIcons.Add:
        return isPaletteOpen || isTagOpen || isEditingPos || isEndingPos || isCheckedOpen;
      default:
        return false;
    }
  }

  enum BottomIcons {Archive, Unarchive, Palette, Checked, Tags, Sorted, Pos, Add};

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
      minHeight: 50,
      alignItems: 'center',
      justifyContent: 'center',
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
    bodyContainer:{
      flex: 1,
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'flex-end', 

      borderColor: o.bordercolor,
      borderBottomWidth: 1,
      borderStyle: 'solid',
    },
    bottomContainer:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    bottomLeftContainer:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '50%',
    },
    bottomRightContainer:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      width: '50%',
    },
    tagEditingContainer:{
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',

      borderColor: o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 5,
      marginTop: 5,
      marginBottom: 0,
      marginHorizontal: 5,
    },
    tagListContainer:{
      flexWrap: "wrap",
      flexDirection: "row",
      padding: 5,
    },
    tagInputContainerStyle:{
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 50,
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
    tagContainer:{
      margin: 5,
      borderColor: o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 5,
    },
    tagText:{
      marginVertical: 10,
      marginHorizontal: 15,
      color: o.objtitle
    },
    itemsContainer:{
      justifyContent: 'flex-end',
      borderColor: o.bordercolor,
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
      margin: 5,
    },
    list:{
      flex: 1,
      width: "100%",
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
    inputStyle: {
      textAlign: 'center',
      color: o.objtitle,
      fontWeight: 'bold',
      borderColor: o.objtitle,
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
    emptyImageContainer:{
      height: 40,
      width: 40,
      margin: 5,
    },
  });

  return (
    (currentObjectiveId !== ''?
    <View style={s.container}>
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
          trashImageStyle={{tintColor: o.trashicontint}}>
        </PressInput>
      </View>
      <View style={s.bodyContainer}>
        {isPaletteOpen && 
          <View style={s.itemsContainer}>
            <Pressable style={[s.colorPalette, {backgroundColor: colorPalette.bluedark}]} onPress={() => onSelectColor('noTheme')}></Pressable>
            <Pressable style={[s.colorPalette, {backgroundColor: colorPalette.objBlue}]} onPress={() => onSelectColor('darkBlue')}></Pressable>
            <Pressable style={[s.colorPalette, {backgroundColor: colorPalette.objRed}]} onPress={() => onSelectColor('darkRed')}></Pressable>
            <Pressable style={[s.colorPalette, {backgroundColor: colorPalette.objGreen}]} onPress={() => onSelectColor('darkGreen')}></Pressable>
            <Pressable style={[s.colorPalette, {backgroundColor: colorPalette.objWhite}]} onPress={() => onSelectColor('darkWhite')}></Pressable>
            <Pressable style={[s.colorPalette, {backgroundColor: colorPalette.objCyan}]} onPress={() => onSelectColor('darkCyan')}></Pressable>
            <Pressable style={[s.colorPalette, {backgroundColor: colorPalette.objPink}]} onPress={() => onSelectColor('darkPink')}></Pressable>
          </View>
        }
        {getList()}
        {isCheckedOpen &&
          <View style={s.itemsContainer}>
            <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={() => {selectUnselectAllItems(true)}} source={require('../../../public/images/checkedunchecked.png')}></PressImage>
            <PressImage pressStyle={gs.baseImageContainer} style={s.imageFade} onPress={() => {selectUnselectAllItems(false)}} source={require('../../../public/images/checkedunchecked.png')}></PressImage>
          </View>
        }
        {isItemsOpen &&  
        <View style={s.itemsContainer}>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Wait)}} source={require('../../../public/images/wait.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Link)}} source={require('../../../public/images/link.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Exercise)}} source={require('../../../public/images/exercise-filled-black.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Divider)}} source={require('../../../public/images/minus.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Grocery)}} source={require('../../../public/images/grocery-filled-black.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.imageBig} onPress={() => {choseNewItemToAdd(ItemType.Medicine)}} source={require('../../../public/images/medicine-filled-black.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Location)}} source={require('../../../public/images/location-filled.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Question)}} source={require('../../../public/images/questionfilled.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Note)}} source={require('../../../public/images/note.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Step)}} source={require('../../../public/images/step-filled.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={() => {choseNewItemToAdd(ItemType.Image)}} source={require('../../../public/images/image-filled.png')}></PressImage>
        </View>}
      </View>
      {isTagOpen && 
      <View style={s.tagEditingContainer}>
        <View style={s.tagListContainer}>
          <PressInput
            text={''}
            objTheme={o} 
            onDone={onChangeTags}
            onEditingState={onIsEditingTitle}
            containerStyle={s.tagInputContainerStyle}
            inputStyle={s.tagInputContainer}
            textStyle={s.tagInputText}
            defaultText={'click to insert tag'}
            defaultStyle={{color: o.objtitle}}
            trashImageStyle={{tintColor: o.trashicontint}}>
          </PressInput>
        </View>
        {getTagList()}
      </View>}
      <View style={s.bottomContainer}>
        <View style={s.bottomLeftContainer}>
          {obj.IsArchived?
          <PressImage 
            pressStyle={gs.baseImageContainer}
            style={s.image}
            disable={shouldDisable(BottomIcons.Unarchive)}
            disableStyle={s.imageFade}
            onPress={()=>showBottomItem(BottomIcons.Unarchive)}
            source={require('../../../public/images/unarchive.png')}></PressImage>
          :
          <PressImage 
            pressStyle={gs.baseImageContainer}
            style={s.image}
            disable={shouldDisable(BottomIcons.Archive)}
            disableStyle={s.imageFade}
            onPress={()=>showBottomItem(BottomIcons.Archive)}
            source={require('../../../public/images/archive.png')}></PressImage>}
          <PressImage 
            pressStyle={gs.baseImageContainer}
            style={s.image}
            disable={shouldDisable(BottomIcons.Palette)}
            disableStyle={s.imageFade}
            onPress={()=>showBottomItem(BottomIcons.Palette)}
            source={require('../../../public/images/palette.png')}></PressImage>
          <PressImage
            style={[s.image]}
            disable={shouldDisable(BottomIcons.Tags)}
            disableStyle={s.imageFade}
            pressStyle={gs.baseImageContainer}
            onPress={()=>showBottomItem(BottomIcons.Tags)}
            source={require('../../../public/images/tag.png')}></PressImage>
        </View>
        <View style={s.bottomRightContainer}>
          <PressImage
            style={s.image}
            disable={shouldDisable(BottomIcons.Sorted)}
            disableStyle={s.imageFade}
            pressStyle={gs.baseImageContainer}
            onPress={()=>showBottomItem(BottomIcons.Sorted)}
            confirm={true}
            confirmStyle={[s.image, s.greenImageColor]}
            source={require('../../../public/images/atoz.png')}></PressImage>
          <PressImage
            style={[s.image, !obj.IsShowingCheckedGrocery && s.imageFade]}
            disable={shouldDisable(BottomIcons.Checked)}
            disableStyle={s.imageFade}
            pressStyle={gs.baseImageContainer}
            onPress={onChangeShowingItems}
            onLongPress={()=>showBottomItem(BottomIcons.Checked)}
            source={require('../../../public/images/checked.png')}></PressImage>
          {!isEditingPos && <PressImage 
              style={s.image}
              disable={shouldDisable(BottomIcons.Pos)}
              disableStyle={s.imageFade}
              pressStyle={[gs.baseImageContainer]}
              onPress={()=>showBottomItem(BottomIcons.Pos)}
              source={require('../../../public/images/change.png')}></PressImage>}
          {isEditingPos && <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.redImageColor]} onPress={cancelEditingPos} source={require('../../../public/images/cancel.png')}></PressImage>}
          {isEditingPos && <PressImage 
            style={[s.imageSmall, s.greenImageColor]}
            pressStyle={gs.baseImageContainer}
            hide={itemsSelected.length=== 0 || itemsSelected.length === items.length || isEndingPos}
            onPress={onEditingPosTo}
            source={require('../../../public/images/arrow-right-filled.png')}></PressImage>}
          {isItemOpenLocked ?
            <PressImage 
              style={[s.image, s.redImageColor]}
              disable={shouldDisable(BottomIcons.Add)}
              disableStyle={s.imageFade}
              pressStyle={gs.baseImageContainer}
              onPress={addingNewItem}
              source={require('../../../public/images/add-lock.png')}></PressImage>
            :
            <PressImage 
              pressStyle={gs.baseImageContainer}
              style={s.image}
              disable={shouldDisable(BottomIcons.Add)}
              disableStyle={s.imageFade}
              onPress={()=>showBottomItem(BottomIcons.Add)}
              source={require('../../../public/images/add.png')}></PressImage>
          }
        </View>
      </View>
    </View>
    :
    <View style={s.objEmptyContainer}>
      <PressImage pressStyle={gs.baseImageContainer} style={[s.image, {width: 30, height: 30}]} onPress={()=>{}} source={require('../../../public/images/list.png')}></PressImage>
      <Text style={s.objEmptyText}>NO OBJECTIVE SELECTED</Text>
    </View>
    )
  );
};


export default ObjectiveView;