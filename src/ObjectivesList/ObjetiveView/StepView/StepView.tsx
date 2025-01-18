import { View, StyleSheet, Text, Vibration } from "react-native";
import { Pattern,  Step, ItemViewProps, StepImportance } from "../../../Types";
import { colorPalette, ObjectivePallete, ThemePalette } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import PressImage from "../../../PressImage/PressImage";
import PressInput from "../../../PressInput/PressInput";
import { useEffect, useState } from "react";
import { useLogContext } from "../../../Contexts/LogContext";
import React from "react";

export interface StepViewProps extends ItemViewProps {
  step: Step,
}
const StepView = (props: StepViewProps) => {
  const { userPrefs, theme: t, fontTheme: f, putItem } = useUserContext();
  const { log } = useLogContext();
  const { objTheme: o, isEditingPos, onDeleteItem, loadMyItems, step} = props;

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

  const onDelete = async () => {
    await onDeleteItem(step);
  }

  const onChangeTitle = async (newText: string) => {
    const newStep = {...step, Title: newText.trim()};
    await putItem(newStep);
    loadMyItems();
  }

  const onChangeIsDone = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    const newStep = {...step, Done: !step.Done};
    await putItem(newStep);
    loadMyItems();
  }

  const onEditingTitle = (editingState: boolean) => {
    setIsEditingTitle(editingState);
  }

  const onChangeImportanceIcon = async () => {
    let newImportance: StepImportance;
    switch(step.Importance){
      case StepImportance.Low:
        newImportance = StepImportance.Medium;
        break;
      case StepImportance.Medium:
        newImportance = StepImportance.High;
        break;
      case StepImportance.High:
        newImportance = StepImportance.None;
        break;
      case StepImportance.None:
        newImportance = StepImportance.Low;
        break;
      default:
        newImportance = StepImportance.None;
        break;
    }
    const newStep = {...step, Importance: newImportance};
    await putItem(newStep);
    loadMyItems();
  }

  const getImportanceImage = () => {
    if(step.Importance === StepImportance.Low){
      return <PressImage pressStyle={s.imageContainer} style={s.imageNoTint} source={require('../../../../public/images/low.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon();}}></PressImage>;
    }
    else if(step.Importance === StepImportance.Medium){
      return <PressImage pressStyle={s.imageContainer} style={s.imageNoTint} source={require('../../../../public/images/med.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon();}}></PressImage>;
    }
    else if(step.Importance === StepImportance.High){
      return <PressImage pressStyle={s.imageContainer} style={s.imageNoTint} source={require('../../../../public/images/high.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon();}}></PressImage>;
    }
    else{
      if(isEditingTitle){
        return <PressImage pressStyle={s.imageContainer} style={s.imageNoTint} source={require('../../../../public/images/questionmark.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon();}}></PressImage>;

      }
      else{
        return <></>;
      }
    }
  }

  const s = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
      marginHorizontal: 6,
    },
    titleContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: step.Done? o.objbk:o.itembk,
      
      borderRadius: 5,
      borderColor: step.Done?colorPalette.transparent:o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    titleContainerSelected:{
      borderStyle: 'dashed',
      borderColor: o.bordercolorselected,
    },
    titleContainerEnding:{
      borderStyle: 'solid',
      borderColor: o.bordercolorselected,
    },
    title:{
      color: o.itemtext,
    },
    titleFade:{
      color: o.itemtextfade,
    },
    inputStyle: {
      color: o.itemtext,
      borderColor: o.itemtext,
    },
    imageContainer:{
      height: 40,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image:{
      height: 20,
      width: 20,
      tintColor: o.icontintcolor,
    },
    imageNoTint:{
      height: 20,
      width: 20,
    },
    imageFade:{
      height: 20,
      width: 20,
      tintColor: o.itemtextfade,
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
    stepDoneImage:{
      tintColor: o.doneicontint,
    },
  });

  return (
    <View style={s.container}>
      <View style={[s.titleContainer, props.isSelected && s.titleContainerSelected, props.isSelected && props.isEndingPos && s.titleContainerEnding]}>
        {getImportanceImage()}
        <PressInput 
          objTheme={o}
          text={step.Title}
          onDelete={onDelete}
          onDone={onChangeTitle}
          uneditable={isEditingPos}
          onEditingState={onEditingTitle}
          
          textStyle={step.Done? s.titleFade : s.title}
          inputStyle={s.inputStyle}
          doneImageStyle={s.stepDoneImage}
          trashImageStyle={{tintColor: o.trashicontint}}
          >
        </PressInput>

        {!isEditingTitle && !step.Done && <PressImage pressStyle={s.imageContainer} style={s.image} source={require('../../../../public/images/step-black.png')} onPress={() => {if(!isEditingPos)onChangeIsDone();}}></PressImage>}
        {!isEditingTitle && step.Done && <PressImage pressStyle={s.imageContainer} style={s.imageFade} source={require('../../../../public/images/step-filled-black.png')} onPress={() => {if(!isEditingPos)onChangeIsDone();}}></PressImage>}
      </View>
    </View>
  );
};

export default StepView;