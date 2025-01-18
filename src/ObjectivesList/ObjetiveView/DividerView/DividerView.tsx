import { View, StyleSheet, Text } from "react-native";
import { ObjectivePallete, ThemePalette, getObjTheme } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import { Divider, Item, ItemViewProps } from "../../../Types";
import PressImage from "../../../PressImage/PressImage";
import PressInput from "../../../PressInput/PressInput";
import { useState } from "react";
import React from "react";

export interface DividerViewProps extends ItemViewProps{
  divider: Divider,
  orderDividerItems: (divider: Item)=>void,

  addNewDivider: (pos?:number)=>{},
  addNewGrocery: (pos?:number)=>{},
  addNewLocation: (pos?:number)=>{},
  addNewNote: (pos?:number)=>{},
  addNewQuestion: (pos?:number)=>{},
  addNewStep: (pos?:number)=>{},
  addNewWait: (pos?:number)=>{},
  addNewExercise: (pos?:number)=>{},
}

const DividerView = (props: DividerViewProps) => {
  const { theme: t, fontTheme: f, putItem } = useUserContext();
  const { objTheme: o, isEditingPos, onDeleteItem, loadMyItems, divider, orderDividerItems,
    addNewDivider, addNewGrocery, addNewLocation, addNewNote, addNewQuestion, addNewStep, addNewWait, addNewExercise,
   } = props;

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

  const s = StyleSheet.create({
    dividerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      marginBottom: 4,
      marginHorizontal: 6,
      minHeight: 40,
    },
    dividerNewItemContainer:{
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
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
    imageContainer:{
      height: 40,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image:{
      height: 15,
      width: 15,
      tintColor: o.icontintcolor,
    },
    image2:{
      height: 20,
      width: 20,
      tintColor: o.icontintcolor,
    },
    imageFade: {
      height: 20,
      width: 20,
      tintColor: o.icontintcolorfade
    },
    imageMoveContainer:{
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 5,
      width: 40,
      height: 40,
    },
    imageMove:{
      height: 20,
      width: 20,
      tintColor: o.icontintcolor,
    },
  });

  return (
    <View style={s.dividerContainer}>
      <View style={[s.titleContainer, props.isSelected && s.titleContainerSelected, props.isSelected && props.isEndingPos && s.titleContainerEnding]}>
        {!isEditingTitle &&
          <>
            {divider.IsOpen?
              <PressImage pressStyle={s.imageContainer} style={s.image} onPress={() => {if(!isEditingPos)onChangeIsOpen();}} source={require('../../../../public/images/down-chevron.png')}></PressImage>
              :
              <PressImage pressStyle={s.imageContainer} style={s.image} onPress={() => {if(!isEditingPos)onChangeIsOpen();}} source={require('../../../../public/images/up-chevron.png')}></PressImage>
            }
            <View style={s.imageContainer}></View>
          </>
        }
        <PressInput 
          objTheme={o}
          text={divider.Title}
          onDelete={onDelete}
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
            <PressImage pressStyle={s.imageContainer} style={s.image2} onPress={() => {orderDividerItems(divider)}} source={require('../../../../public/images/atoz.png')}></PressImage>
            {isItemOpenLocked?
              <PressImage pressStyle={s.imageContainer} style={[s.image, {tintColor: 'red'}]} onPress={addingNewItem} source={require('../../../../public/images/add-lock.png')}></PressImage>
              :
              <PressImage pressStyle={s.imageContainer} style={s.image} onPress={addingNewItem} source={require('../../../../public/images/add.png')}></PressImage>
            }
          </>
        }
      </View>
      {isItemsOpen && 
        <View style={s.dividerNewItemContainer}>
          <PressImage pressStyle={s.imageContainer} style={s.image} onPress={()=>{if(!isItemOpenLocked)setIsItemsOpen(false); addNewWait(divider.Pos);}} source={require('../../../../public/images/wait.png')}></PressImage>
          <PressImage pressStyle={s.imageContainer} style={s.image} onPress={()=>{if(!isItemOpenLocked)setIsItemsOpen(false); addNewExercise(divider.Pos);}} source={require('../../../../public/images/exercise-filled.png')}></PressImage>
          <PressImage pressStyle={s.imageContainer} style={s.image} onPress={()=>{if(!isItemOpenLocked)setIsItemsOpen(false); addNewDivider(divider.Pos);}} source={require('../../../../public/images/minus.png')}></PressImage>
          <PressImage pressStyle={s.imageContainer} style={s.image} onPress={()=>{if(!isItemOpenLocked)setIsItemsOpen(false); addNewGrocery(divider.Pos);}} source={require('../../../../public/images/grocery-filled.png')}></PressImage>
          <PressImage pressStyle={s.imageContainer} style={s.image} onPress={()=>{if(!isItemOpenLocked)setIsItemsOpen(false); addNewLocation(divider.Pos);}} source={require('../../../../public/images/location-filled.png')}></PressImage>
          <PressImage pressStyle={s.imageContainer} style={s.image} onPress={()=>{if(!isItemOpenLocked)setIsItemsOpen(false); addNewQuestion(divider.Pos);}} source={require('../../../../public/images/questionfilled.png')}></PressImage>
          <PressImage pressStyle={s.imageContainer} style={s.image} onPress={()=>{if(!isItemOpenLocked)setIsItemsOpen(false); addNewNote(divider.Pos);}} source={require('../../../../public/images/note.png')}></PressImage>
          <PressImage pressStyle={s.imageContainer} style={s.image} onPress={()=>{if(!isItemOpenLocked)setIsItemsOpen(false); addNewStep(divider.Pos);}} source={require('../../../../public/images/step-filled.png')}></PressImage>
        </View>}
    </View>
  );
};

export default DividerView;