import { View, StyleSheet, Text, Vibration } from "react-native";
import { Pattern,  Step, ItemViewProps, StepImportance } from "../../../Types";
import { colorPalette, globalStyle as gs, ObjectivePallete, ThemePalette } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import PressImage from "../../../PressImage/PressImage";
import PressInput from "../../../PressInput/PressInput";
import { useEffect, useState } from "react";
import { useLogContext } from "../../../Contexts/LogContext";
import React from "react";

export const New = () => {
  return(
    {
      Title: '',
      Done: false,
      Importance: StepImportance.None,
    }
  )
}

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
        newImportance = StepImportance.Question;
        break;
      case StepImportance.Question:
        newImportance = StepImportance.Waiting;
        break;
      case StepImportance.Waiting:
        newImportance = StepImportance.InProgress;
        break;
      case StepImportance.InProgress:
        newImportance = StepImportance.None;
        break;
      default:
        newImportance = StepImportance.Low;
        break;
    }
    const newStep = {...step, Importance: newImportance};
    await putItem(newStep);
    loadMyItems();
  }

  const getImportanceImage = () => {
    if(!step.Done) {
      if(step.Importance === StepImportance.Low){
        return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/low.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon();}}></PressImage>;
      }
      else if(step.Importance === StepImportance.Medium){
        return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/med.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon();}}></PressImage>;
      }
      else if(step.Importance === StepImportance.High){
        return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/high.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon();}}></PressImage>;
      }
      else if(step.Importance === StepImportance.Question){
        return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/questionmark.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon();}}></PressImage>;
      }
      else if(step.Importance === StepImportance.Waiting){
        return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/wait.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon();}}></PressImage>;
      }
      else if(step.Importance === StepImportance.InProgress){
        return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/inprogress.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon();}}></PressImage>;
      }
      else{
        if(isEditingTitle){
          return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/cancel.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon();}}></PressImage>;
  
        }
        else{
          return <></>;
        }
      }
    }
    else{ return <></> }
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
    image:{
      ...gs.baseImage,
      tintColor: o.icontintcolor,
    },
    imageFade:{
      ...gs.baseImage,
      tintColor: o.icontintcolorfade,
    },
    stepDoneImage:{
      ...gs.baseImage,
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
          confirmDelete={true}
          onDone={onChangeTitle}
          uneditable={isEditingPos}
          onEditingState={onEditingTitle}
          
          textStyle={step.Done? s.titleFade : s.title}
          inputStyle={s.inputStyle}
          doneImageStyle={s.stepDoneImage}
          trashImageStyle={{tintColor: o.trashicontint}}
          >
        </PressInput>

        {!isEditingTitle && !step.Done && <PressImage pressStyle={gs.baseImageContainer} style={s.image} source={require('../../../../public/images/step-black.png')} onPress={() => {if(!isEditingPos)onChangeIsDone();}}></PressImage>}
        {!isEditingTitle && step.Done && <PressImage pressStyle={gs.baseImageContainer} style={s.imageFade} source={require('../../../../public/images/step-filled-black.png')} onPress={() => {if(!isEditingPos)onChangeIsDone();}}></PressImage>}
      </View>
    </View>
  );
};

export default StepView;