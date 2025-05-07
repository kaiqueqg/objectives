import { View, StyleSheet, Text } from "react-native";
import { colorPalette, globalStyle as gs } from "../../../Colors";
import { useUserContext } from "../../../Contexts/UserContext";
import { Divider, Item, ItemType, ItemViewProps } from "../../../Types";
import PressImage from "../../../PressImage/PressImage";
import PressInput from "../../../PressInput/PressInput";
import { useState } from "react";
import React from "react";

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
  orderDividerItems: (divider: Item)=>void,
  choseNewItemToAdd: (type: ItemType, pos?:number)=>void,
}

const DividerView = (props: DividerViewProps) => {
  const { theme: t, fontTheme: f, putItem } = useUserContext();
  const { objTheme: o, isEditingPos, onDeleteItem, loadMyItems, divider, orderDividerItems, choseNewItemToAdd, } = props;

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [isItemsOpen, setIsItemsOpen] = useState<boolean>(false);
  const [isItemOpenLocked, setIsItemOpenLocked] = useState<boolean>(false);

  const onDelete = async () => {
    onDeleteItem(divider);
  }

  const onChangeTitle = async (newText: string) => {
    const newDivider = {...divider, Title: newText.trim()};
    await putItem(newDivider);
    loadMyItems();
  }

  const onEditingTitle = async (editingState: boolean) => {
    setIsEditingTitle(editingState);
  }

  const onChangeIsOpen = async () => {
    const newDivider = {...divider, IsOpen: !divider.IsOpen};
    await putItem(newDivider);
    loadMyItems();
  }

  //Responsable for open, close and lock icon and menu.
  const addingNewItem = async () => {
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

  const addNewItem = (type: ItemType) => {
    if(!isItemOpenLocked)setIsItemsOpen(false); choseNewItemToAdd(type, divider.Pos);
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
    dividerContainerOpen:{
      borderColor: colorPalette.beigedark,
      borderWidth: 1,
      borderStyle: 'solid',
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

      borderRadius: 5,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: o.objbk,
    },
    titleContainerSelected:{
      borderStyle: 'dashed',
      borderColor: o.bordercolorselected,
    },
    titleContainerEnding:{
      borderStyle: 'solid',
      borderColor: o.bordercolorselected,
    },
    inputTextStyle:{
      textAlign: 'center',
      fontWeight: 'bold',
      color: o.itemtext,
    },
    inputStyle: {
      justifyContent: 'center',
      alignItems: 'center',

      color: t.textcolor,
      borderColor: o.itemtext,
    },
    image:{
      ...gs.baseSmallImage,
      tintColor: o.icontintcolor,
    },
    imageFade: {
      ...gs.baseImage,
      tintColor: o.icontintcolorfade
    },
  });

  return (
    <View style={[s.dividerContainer, isItemsOpen && s.dividerContainerOpen]} >
      <View style={[s.titleContainer, props.isSelected && s.titleContainerSelected, props.isSelected && props.isEndingPos && s.titleContainerEnding]}>
        {!isEditingTitle &&
          <>
            {divider.IsOpen?
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, isItemsOpen&&s.imageFade]} disable={isItemsOpen} onPress={() => {if(!isEditingPos)onChangeIsOpen();}} source={require('../../../../public/images/down-chevron.png')}></PressImage>
              :
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, isItemsOpen&&s.imageFade]} disable={isItemsOpen} onPress={() => {if(!isEditingPos)onChangeIsOpen();}} source={require('../../../../public/images/up-chevron.png')}></PressImage>
            }
            <View style={gs.baseImageContainer}></View>
          </>
        }
        <PressInput 
          objTheme={o}
          text={divider.Title}
          onDelete={onDelete}
          confirmDelete={true}
          onDone={onChangeTitle}
          uneditable={isEditingPos}
          onEditingState={onEditingTitle}

          textStyle={s.inputTextStyle}
          inputStyle={s.inputStyle}
          trashImageStyle={{tintColor: o.trashicontint}}
          >
        </PressInput>
        {!isEditingTitle &&
          <>
            <PressImage pressStyle={gs.baseImageContainer} style={[s.image, isItemsOpen&&s.imageFade]} disable={isItemsOpen} onPress={() => {orderDividerItems(divider)}} source={require('../../../../public/images/atoz.png')}></PressImage>
            {isItemOpenLocked?
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, {tintColor: 'red'}]} onPress={addingNewItem} source={require('../../../../public/images/add-lock.png')}></PressImage>
              :
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image]} onPress={addingNewItem} source={require('../../../../public/images/add.png')}></PressImage>
            }
          </>
        }
      </View>
      {isItemsOpen && 
        <View style={[s.dividerNewItemContainer]}>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={()=>{addNewItem(ItemType.Wait);}} source={require('../../../../public/images/wait.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={()=>{addNewItem(ItemType.Link);}} source={require('../../../../public/images/link.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={()=>{addNewItem(ItemType.Exercise);}} source={require('../../../../public/images/exercise-filled.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={()=>{addNewItem(ItemType.Divider);}} source={require('../../../../public/images/minus.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={()=>{addNewItem(ItemType.Grocery);}} source={require('../../../../public/images/grocery-filled.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={()=>{addNewItem(ItemType.Medicine);}} source={require('../../../../public/images/medicine-filled.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={()=>{addNewItem(ItemType.Location);}} source={require('../../../../public/images/location-filled.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={()=>{addNewItem(ItemType.Question);}} source={require('../../../../public/images/questionfilled.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={()=>{addNewItem(ItemType.Note);}} source={require('../../../../public/images/note.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={()=>{addNewItem(ItemType.Step);}} source={require('../../../../public/images/step-filled.png')}></PressImage>
          <PressImage pressStyle={gs.baseImageContainer} style={s.image} onPress={()=>{addNewItem(ItemType.Image);}} source={require('../../../../public/images/image-filled.png')}></PressImage>
        </View>}
    </View>
  );
};

export default DividerView;