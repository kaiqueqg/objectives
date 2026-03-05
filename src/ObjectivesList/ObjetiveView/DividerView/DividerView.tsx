import { View, StyleSheet, Text, Keyboard, BackHandler } from "react-native";
import { colorPalette, globalStyle as gs } from "../../../Colors";
import { useUserContext } from "../../../Contexts/UserContext";
import { Divider, Item, ItemType, ItemViewProps, MessageType } from "../../../Types";
import PressImage from "../../../PressImage/PressImage";
import PressInput from "../../../PressInput/PressInput";
import { useEffect, useState } from "react";
import React from "react";
import { useLogContext } from "../../../Contexts/LogContext";
import { Images } from "../../../Images";
import { LinearGradient } from "expo-linear-gradient";

export const New = () => {
  return(
    {
      Title: '',
      IsOpen: true,
    }
  )
}

export interface DividerViewProps extends ItemViewProps{
  divider: Divider,
  orderDividerItems: (divider: Item) => void,
  choseNewItemToAdd: (type: ItemType, pos:number) => void,
  checkUncheckedDividerItems: (value: boolean, divider: Item )=> void,
}

const DividerView = (props: DividerViewProps) => {
  const { theme: t, fontTheme: f, putItem } = useUserContext();
  const { log, popMessage } = useLogContext();
  const { objTheme: o, wasJustAdded, isDisabled, isSelecting, isSelected, isLocked, onDeleteItem, loadMyItems, divider, orderDividerItems, choseNewItemToAdd, checkUncheckedDividerItems} = props;

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isItemsOpen, setIsItemsOpen] = useState<boolean>(false);
  const [isItemOpenLocked, setIsItemOpenLocked] = useState<boolean>(false);

  const [checkAll, setCheckAll] = useState<boolean>(false);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
    
  useEffect(() => {
  }, [isEditingTitle])

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
    const hide = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

    const backAction = () => {
      if (keyboardVisible) {
        Keyboard.dismiss();
        return true;
      }
      
      onEditingTitle(false);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
      show.remove();
      hide.remove();
    };
  }, [keyboardVisible]);

  const onDelete = async () => {
    onDeleteItem(divider);
  }

  const onChangeTitle = async (newText: string) => {
    const newDivider = {...divider, Title: newText.trim()};
    await putItem(newDivider);
    loadMyItems();
  }

  const onEditingTitle = async (editingState: boolean) => {
    if(editingState) props.itemsListScrollTo(divider.ItemId);
    setIsEditingTitle(editingState);
  }

  const onChangeIsOpen = async () => {
    const newDivider = {...divider, IsOpen: !divider.IsOpen};
    await putItem(newDivider);
    loadMyItems();
  }

  /// Responsable for open, close and lock icon and menu.
  const addingNewItem = async () => {
    if(isDisabled) return;
    
    if(isItemsOpen){
      if(isItemOpenLocked){ /// turn all off
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

  const addNewItem = (type: ItemType) => {
    if(!isItemOpenLocked)
      setIsItemsOpen(false); 
    
    choseNewItemToAdd(type, divider.Pos+1);
  }

  const onChangeAllCheckedUnchecked = () => {
    const newValue = !checkAll;
    checkUncheckedDividerItems(newValue, divider);
    setCheckAll(newValue);
  }

  const getDividerItemsView = () => {
    if(!isItemsOpen) return <></>;

    return(
      <View style={[s.dividerNewItemContainer]}>
        <PressImage cT={o} onPress={()=>{addNewItem(ItemType.Review);}} source={Images.Review}/>
        <PressImage cT={o} onPress={()=>{addNewItem(ItemType.House);}} source={Images.Home}/>
        <PressImage cT={o} onPress={()=>{addNewItem(ItemType.Link);}} source={Images.Link}/>
        <PressImage cT={o} onPress={()=>{addNewItem(ItemType.Exercise);}} source={Images.ExerciseFilled}/>
        <PressImage cT={o} onPress={()=>{addNewItem(ItemType.Divider);}} source={Images.Minus}/>
        <PressImage cT={o} onPress={()=>{addNewItem(ItemType.Grocery);}} source={Images.GroceryFilled}/>
        <PressImage cT={o} onPress={()=>{addNewItem(ItemType.Medicine);}} source={Images.MedicineFilled}/>
        <PressImage cT={o} onPress={()=>{addNewItem(ItemType.Location);}} source={Images.LocationFilled}/>
        <PressImage cT={o} onPress={()=>{addNewItem(ItemType.Question);}} source={Images.QuestionFilled}/>
        <PressImage cT={o} onPress={()=>{addNewItem(ItemType.Note);}} source={Images.Note}/>
        <PressImage cT={o} onPress={()=>{addNewItem(ItemType.Step);}} source={Images.StepFilled}/>
        <PressImage cT={o} onPress={()=>{popMessage('Image: Under construction...', MessageType.Error)}} source={Images.ImageFilled}/>
      </View>
    )
  }

  const getDividerMainView = () => {
    return(
      <View style={[s.titleContainer, isSelecting && s.containerSelecting, isSelected && s.containerSelected, wasJustAdded && s.containerWasJustAdded]}>
        {!isEditingTitle &&
          <>
            <PressImage cT={o} disable={isItemsOpen || isLocked || isDisabled} onPress={() => {if(!isDisabled)onChangeIsOpen();}} source={divider.IsOpen?Images.DownChevron:Images.UpChevron}/>
            <PressImage cT={o} disable={isItemsOpen || isLocked || isDisabled} confirm onPress={() => {if(!isDisabled)orderDividerItems(divider);}} source={Images.AtoZ}/>
          </>
        }
        <PressInput 
          objTheme={o}
          text={divider.Title}
          onDelete={onDelete}
          confirmDelete={true}
          onDone={onChangeTitle}
          uneditable={isDisabled || isLocked}
          onEditingState={onEditingTitle}
          >
        </PressInput>
        {!isEditingTitle &&
          <>
            <PressImage cT={o} disable={isItemsOpen || isLocked || isDisabled} onPress={onChangeAllCheckedUnchecked} source={checkAll?Images.Unchecked:Images.Checked} confirm/>
            <PressImage cT={o} disable={isLocked || isDisabled} onPress={addingNewItem} source={Images.Add} showLock={isItemOpenLocked}/>
          </>
        }
      </View>
    )
  }

  const s = StyleSheet.create({
    dividerContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: o.marginHorizontal,
      marginVertical: o.marginVertical,

      borderRadius: o.borderRadius,
    },
    linearGradient:{
      flex: 1,
      width: '100%',

      borderColor: colorPalette.transparent,//
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
    },
    dividerContainerOpen:{
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: 5,
    },
    dividerNewItemContainer:{
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    titleContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 40,
      paddingHorizontal: 5,

      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
      borderColor: colorPalette.transparent,//o.bordercolor,

      backgroundColor: o.backgroundcolordark,
    },
    containerSelecting:{
      borderStyle: 'solid',
      borderColor: o.bordercolorselecting,
    },
    containerSelected:{
      borderStyle: 'dashed',
      borderColor: o.bordercolorselected,
    },
    containerWasJustAdded:{
      borderStyle: 'solid',
      borderColor: o.bordercolorwasjustadded,
    },
    inputTextStyle:{
      textAlign: 'center',
      fontWeight: 'bold',
      color: o.innertextcolor,
    },
    inputStyle: {
      justifyContent: 'center',
      alignItems: 'center',

      color: t.textcolor,
      borderColor: o.icontint,
    },
  });

  return (
    <View style={[s.dividerContainer, isItemsOpen && s.dividerContainerOpen]} >
      {/* <LinearGradient colors={[o.backgroundcolordark??'red', o.backgroundcolordarker??'yellow']} style={s.linearGradient} start={{x: 0, y: 0}} end={{x: 1, y: 0}}> */}
        {getDividerMainView()}
        {getDividerItemsView()}
      {/* </LinearGradient> */}
    </View>
  );
};

export default DividerView;