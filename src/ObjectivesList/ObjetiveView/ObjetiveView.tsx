import { View, StyleSheet, Pressable, Vibration, Alert, FlatList, Text, Image } from "react-native";
import { useUserContext } from "../../Contexts/UserContext";
import { colorPalette, getObjTheme } from "../../Colors";
import { Item, ItemType, Note, Objective, Question, Step, Views, Wait, Location, Divider, Grocery, Pattern, MessageType } from "../../Types";
import QuestionView from "./QuestionView/QuestionView";
import PressImage from "../../PressImage/PressImage";
import { useEffect, useState } from "react";
import StepView from "./StepView/StepView";
import PressInput from "../../PressInput/PressInput";
import WaitView from "./WaitView/WaitView";
import NoteView from "./NoteView/NoteView";
import LocationView from "./LocationView/LocationView";
import DividerView from "./DividerView/DividerView";
import GroceryView from "./Grocery/Grocery";
import * as ExpoLocation from 'expo-location';
import { useLogContext } from "../../Contexts/LogContext";
import { useStorageContext } from "../../Contexts/StorageContext";

export interface ObjectiveViewProps {
  obj: Objective,
  scrollTo?: (index: number) => void,
  index?: number,
}
const ObjectiveView = (props: ObjectiveViewProps) => {
  const { log } = useLogContext();
  const { storage } = useStorageContext();
  const { theme, fontTheme, 
    user, userPrefs, 
    objectives, putObjective, deleteObjective, 
    currentObjectiveId, deleteCurrentObjectiveId, 
    writeItems, readItems, putItems, deleteItem,
    currentView, writeCurrentView } = useUserContext();
    const { obj } = props;
  const o = getObjTheme(props.obj.Theme);

  const [items, setItems] = useState<Item[]>([]);
  const [isItemsOpen, setIsItemsOpen] = useState<boolean>(false);
  const [isItemOpenLocked, setIsItemOpenLocked] = useState<boolean>(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isEditingPos, setIsEditingPos] = useState<boolean>(false);
  const [isEndingPos, setIsEndingPos] = useState<boolean>(false);
  const [itemsSelected, setItemsSelected] = useState<Item[]>([]);

  let itemsToChangePos:Item[] = [];

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

  const addNewStep = async (pos?:number) => {
    if(!user) return log.err('No user.');

    addNewItem({
      UserIdObjectiveId: user.UserId + obj.ObjectiveId,
      ItemId: await storage.randomId(),
      Type: ItemType.Step,
      Done: false,
      Title: '',
      Pos: pos?pos:items.length,
      LastModified: (new Date()).toISOString(),
    }, pos);
  }

  const addNewQuestion = async (pos?:number) => {
    if(!user) return log.err('No user.');

    addNewItem({
      UserIdObjectiveId: user.UserId + obj.ObjectiveId,
      ItemId: await storage.randomId(),
      Type: ItemType.Question,
      Statement: '',
      Answer: '',
      Pos: pos?pos:items.length,
      LastModified: (new Date()).toISOString(),
    }, pos);
  }

  const addNewWait = async (pos?:number) => {
    if(!user) return log.err('No user.');

    addNewItem({
      UserIdObjectiveId: user.UserId + obj.ObjectiveId,
      ItemId: await storage.randomId(),
      Type: ItemType.Wait,
      Title: '',
      Pos: pos?pos:items.length,
      LastModified: (new Date()).toISOString(),
    }, pos);
  }

  const addNewNote = async (pos?:number) => {
    if(!user) return log.err('No user.');

    addNewItem({
      UserIdObjectiveId: user.UserId + obj.ObjectiveId,
      ItemId: await storage.randomId(),
      Type: ItemType.Note,
      Text: '',
      Pos: pos?pos:items.length,
      LastModified: (new Date()).toISOString(),
    }, pos);
  }

  const addNewLocation = async (pos?:number) => {
    if(!user) return log.err('No user.');

    addNewItem({
      UserIdObjectiveId: user.UserId + obj.ObjectiveId,
      ItemId: await storage.randomId(),
      Type: ItemType.Location,
      Pos: pos?pos:items.length,
      LastModified: (new Date()).toISOString(),
      Title: '',
      Url: '',
    }, pos);
  }

  const addNewDivider = async (pos?:number) => {
    if(!user) return log.err('No user.');

    addNewItem({
      UserIdObjectiveId: user.UserId + obj.ObjectiveId,
      ItemId: await storage.randomId(),
      Type: ItemType.Divider,
      Pos: pos?pos:items.length,
      LastModified: (new Date()).toISOString(),
      Title: '',
      IsOpen: true,
    }, pos);
  }

  const addNewGrocery = async (pos?:number) => {
    if(!user) return log.err('No user.');

    addNewItem({
      UserIdObjectiveId: user.UserId + obj.ObjectiveId,
      ItemId: await storage.randomId(),
      Type: ItemType.Grocery,
      Pos: pos?pos:items.length,
      LastModified: (new Date()).toISOString(),
      Title: '',
      IsChecked: false,
    }, pos);
  }

  const onConfirmDelete = () => {
    Alert.alert('', 'Do you really want to delete?', [
      { text: 'NO', onPress: () => {}},
      { text: 'YES', onPress: async () => {onDeleteObjective()} }
    ]);
  }

  const onDeleteObjective = async () => {
    await deleteObjective(obj);
    deleteCurrentObjectiveId();
    writeCurrentView(Views.ListView);
  }

  const onChangeTitle = async (newText: string) => {
    await putObjective({...obj, Title: newText.trim(), LastModified: (new Date()).toISOString() });
  }

  const onChangeIsItemsOpen = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    setIsPaletteOpen(false);
    setIsEditingPos(false);
    setIsItemsOpen(!isItemsOpen);
  }

  const onChangeIsPaletteOpen = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    setIsItemsOpen(false);
    setIsEditingPos(false);
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

    setIsPaletteOpen(false);
    setIsItemsOpen(false);

    setIsEditingPos(true);
  }

  const cancelEditingPos = () => {
    setItemsSelected([]);
    itemsToChangePos = [];
    setIsEditingPos(false);
    setIsEndingPos(false);
  }

  const onEditingPosTo = () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    itemsToChangePos = itemsSelected
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

  const onChangeShowingGroceryChecked = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    await putObjective({...obj, IsShowingCheckedGrocery: !obj.IsShowingCheckedGrocery, LastModified: (new Date()).toISOString() });
  }

  const onChangeShowingStepChecked = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    await putObjective({...obj, IsShowingCheckedStep: !obj.IsShowingCheckedStep, LastModified: (new Date()).toISOString() });
  }

  //Responsable for open, close and lock icon and menu.
  const addingNewItem = async () => {
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

    if(isPaletteOpen) setIsPaletteOpen(false);
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

  const getList = () => {
    let filteredItems:Item[] = [];
    let isDividerOpen = true;
    for(let i = 0; i < items.length; i++){
      let current = items[i];
      let shouldAddStep = true;
      let shouldAddGrocery = true;

      if(current.Type === ItemType.Divider) {
        filteredItems.push(current);
        isDividerOpen = (current as Divider).IsOpen;
      }
      else{
        if(current.Type === ItemType.Step && !obj.IsShowingCheckedStep) shouldAddStep = !(current as Step).Done;
        if(current.Type === ItemType.Grocery && !obj.IsShowingCheckedGrocery) shouldAddGrocery = !(current as Grocery).IsChecked;
  
        if(isDividerOpen && shouldAddStep && shouldAddGrocery){
          filteredItems.push(current);
        }
      }
    }

    filteredItems.push({ItemId:'', LastModified: '', Pos:-1, UserIdObjectiveId: '',  Type: ItemType.Unknown})

    return <FlatList data={filteredItems} renderItem={getItemView}></FlatList>
  }

  const getItemView = ({item}:any) => {
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
        addNewDivider={addNewDivider}
        addNewGrocery={addNewGrocery}
        addNewLocation={addNewLocation}
        addNewNote={addNewNote}
        addNewQuestion={addNewQuestion}
        addNewStep={addNewStep}
        addNewWait={addNewWait}
        ></DividerView>  
    }
    else if(item.Type === ItemType.Step){
      rtnItem = <StepView key={item.ItemId} isEditingPos={isEditingPos} isEndingPos={isEndingPos} isSelected={itemSelected?true:false} loadMyItems={loadItems} objTheme={o} step={item as Step} onDeleteItem={onDeleteItem} ></StepView>
    }
    else if(item.Type === ItemType.Grocery){
      rtnItem = <GroceryView key={item.ItemId} isEditingPos={isEditingPos} isEndingPos={isEndingPos} isSelected={itemSelected?true:false} loadMyItems={loadItems} objTheme={o} grocery={item as Grocery} onDeleteItem={onDeleteItem} ></GroceryView>
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
    else{
      return <View style={{height:700}}></View>
    }

    return (
      <View style={s.itemRow} onTouchEnd={() => {isEditingPos && (isEndingPos? endChangingPos(item) : addRemoveToSelected(item))}}>
        {rtnItem}
      </View>
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
      minHeight: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 5,

      borderColor: o.bordercolor,
      borderWidth: 1,
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
    },
    bodyContainer:{
      flex: 1,
      width: '100%',
      flexDirection: 'row',
    },
    bottomContainer:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',

      borderColor: o.bordercolor,
      borderTopWidth: 1,
      borderStyle: 'solid',
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
    itemsContainer:{
      justifyContent: 'flex-end',
    },
    list:{
      flex: 1,
      width: "100%",
    },
    imageContainerShadow:{
      margin: 5,
      
      borderColor: 'lightgrey',
      borderBottomWidth: 2,
      borderRightWidth: 2,
      borderStyle: 'solid'
    },
    imageContainer: {
      height: 40,
      width: 40,
      margin: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image:{
      height: 20,
      width: 20,
      tintColor: o.objtitle,
    },
    itemRow:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    noTintImage:{
      height: 20,
      width: 20,
    },
    imageFade:{
      tintColor: o.objtitlefade,
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
          onDelete={onConfirmDelete} 
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
            <Pressable style={[s.colorPalette, {backgroundColor: '#2D9BF0'}]} onPress={() => onSelectColor('darkBlue')}></Pressable>
            <Pressable style={[s.colorPalette, {backgroundColor: '#FF5858',}]} onPress={() => onSelectColor('darkRed')}></Pressable>
            <Pressable style={[s.colorPalette, {backgroundColor: '#0CA789'}]} onPress={() => onSelectColor('darkGreen')}></Pressable>
            <Pressable style={[s.colorPalette, {backgroundColor: '#F5F5DC'}]} onPress={() => onSelectColor('darkWhite')}></Pressable>
          </View>
        }
        {getList()}
        {isItemsOpen && !isPaletteOpen &&  
        <View style={s.itemsContainer}>
          <PressImage pressStyle={s.imageContainer} style={s.image} onPress={addNewDivider} source={require('../../../public/images/minus.png')}></PressImage>
          <PressImage pressStyle={s.imageContainer} style={s.image} onPress={addNewWait} source={require('../../../public/images/wait.png')}></PressImage>
          <PressImage pressStyle={s.imageContainer} style={s.image} onPress={addNewGrocery} source={require('../../../public/images/grocery-filled.png')}></PressImage>
          <PressImage pressStyle={s.imageContainer} style={s.image} onPress={addNewLocation} source={require('../../../public/images/location-filled.png')}></PressImage>
          <PressImage pressStyle={s.imageContainer} style={s.image} onPress={addNewQuestion} source={require('../../../public/images/questionfilled.png')}></PressImage>
          <PressImage pressStyle={s.imageContainer} style={s.image} onPress={addNewNote} source={require('../../../public/images/note.png')}></PressImage>
          <PressImage pressStyle={s.imageContainer} style={s.image} onPress={addNewStep} source={require('../../../public/images/step-filled.png')}></PressImage>
        </View>}
      </View>
      <View style={s.bottomContainer}>
        <View style={s.bottomLeftContainer}>
          {!isEditingTitle && 
            <>
              <PressImage 
                pressStyle={s.imageContainer}
                style={s.image}
                disable={isEditingPos || isItemsOpen}
                disableStyle={s.imageFade}
                onPress={onChangeIsPaletteOpen}
                source={require('../../../public/images/palette.png')}></PressImage>
              <PressImage pressStyle={s.imageContainer} style={[s.image, !obj.IsShowingCheckedGrocery && s.imageFade]} onPress={onChangeShowingGroceryChecked} source={require('../../../public/images/checked.png')}></PressImage>
              <PressImage pressStyle={s.imageContainer} style={[s.image, !obj.IsShowingCheckedStep && s.imageFade]} onPress={onChangeShowingStepChecked} source={require('../../../public/images/step-filled.png')}></PressImage>
            </>
          }
        </View>
        <View style={s.bottomRightContainer}>
          <PressImage pressStyle={s.imageContainer} style={[s.image, (isEditingPos || isItemsOpen || isPaletteOpen) && s.imageFade]} onPress={orderItems} confirm={true} source={require('../../../public/images/atoz.png')}></PressImage>
          {!isEditingTitle && !isEditingPos && 
            <PressImage 
              pressStyle={s.imageContainer}
              style={[s.image,{height: 15, width: 15}]}
              disable={isEditingPos || isPaletteOpen || isItemsOpen}
              disableStyle={s.imageFade}
              onPress={startEditingPos}
              source={require('../../../public/images/updown.png')}></PressImage>
          }
          {!isEditingTitle && isEditingPos && <PressImage pressStyle={s.imageContainer} style={s.image} onPress={cancelEditingPos} source={require('../../../public/images/cancel.png')}></PressImage>}
          {!isEditingTitle && isEditingPos && <PressImage pressStyle={s.imageContainer} hide={itemsSelected.length=== 0 || itemsSelected.length === items.length || isEndingPos} style={s.image} onPress={onEditingPosTo} source={require('../../../public/images/arrow-right-filled.png')}></PressImage>}
          {!isEditingTitle && !isEditingPos &&
            (isItemOpenLocked ?
            <PressImage 
              pressStyle={s.imageContainer}
              style={s.noTintImage}
              disable={isEditingPos || isPaletteOpen}
              disableStyle={s.imageFade}
              onPress={addingNewItem}
              source={require('../../../public/images/add-lock.png')}></PressImage>
            :
            <PressImage 
              pressStyle={s.imageContainer}
              style={s.image}
              disable={isEditingPos || isPaletteOpen}
              disableStyle={s.imageFade}
              onPress={addingNewItem}
              source={require('../../../public/images/add.png')}></PressImage>
            )
          }
        </View>
      </View>
    </View>
    :
    <View style={s.objEmptyContainer}>
      <PressImage pressStyle={s.imageContainer} style={[s.image, {width: 30, height: 30}]} onPress={addNewNote} source={require('../../../public/images/list.png')}></PressImage>
      <Text style={s.objEmptyText}>NO OBJECTIVE SELECTED</Text>
    </View>
    )
  );
};


export default ObjectiveView;