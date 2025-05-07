import { View, StyleSheet, Text, Vibration, TextInput } from "react-native";
import { Pattern,  Step, ItemViewProps, StepImportance } from "../../../Types";
import { colorPalette, globalStyle as gs, ObjectivePallete, ThemePalette } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import PressImage from "../../../PressImage/PressImage";
import PressInput from "../../../PressInput/PressInput";
import { useEffect, useState } from "react";
import { useLogContext } from "../../../Contexts/LogContext";
import React from "react";
import PressText from "../../../PressText/PressText";

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

  const [isEditingStep, setIsEditingStep] = useState<boolean>(false);
  const [tempStep, setTempStep] = useState<Step>(step);

  const onDelete = async () => {
    await onDeleteItem(step);
  }

  const onDoneStep = async () => {
    const newStep = {...tempStep};
    newStep.Title = newStep.Title.trim();
    await putItem(newStep);
    setIsEditingStep(false);
    loadMyItems();
  }

  const onCancelStep = async () => {
    setIsEditingStep(false);
  }

  const onChangeIsDone = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    const newStep = {...step, Done: !step.Done};
    await putItem(newStep);
    loadMyItems();
  }

  const onChangeImportanceIcon = async (newImportance: StepImportance) => {
    const newStep = {...tempStep, Importance: newImportance};
    setTempStep(newStep);
  }

  const getImportanceImage = () => {
    if(tempStep.Importance === StepImportance.Low){
      return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/low.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon(StepImportance.Low);}}></PressImage>;
    }
    else if(tempStep.Importance === StepImportance.Medium){
      return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/med.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon(StepImportance.Medium);}}></PressImage>;
    }
    else if(tempStep.Importance === StepImportance.High){
      return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/high.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon(StepImportance.High);}}></PressImage>;
    }
    else if(tempStep.Importance === StepImportance.Ladybug){
      return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/ladybug.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon(StepImportance.Ladybug);}}></PressImage>;
    }
    else if(tempStep.Importance === StepImportance.Question){
      return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/questionmark.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon(StepImportance.Question);}}></PressImage>;
    }
    else if(tempStep.Importance === StepImportance.Waiting){
      return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/wait.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon(StepImportance.Waiting);}}></PressImage>;
    }
    else if(tempStep.Importance === StepImportance.InProgress){
      return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/inprogress.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon(StepImportance.InProgress);}}></PressImage>;
    }
    else{
      if(isEditingStep){
        return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/cancel.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon(StepImportance.None);}}></PressImage>;

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
      marginHorizontal: o.marginHorizontal,
      marginVertical: o.marginVertical,
    },
    stepContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: step.Done? o.objbk:o.itembk,
      
      borderColor: step.Done?colorPalette.transparent:o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: o.borderRadius,
    },
    titleContainer:{
      flex: 1,
      justifyContent: 'center',

      minHeight: 40,
      margin: 2,
      paddingLeft: step.Importance===StepImportance.None?10:0,
      color: 'beige',
    },
    titleRowContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    importanceIconContainer:{
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',

      borderRadius: 5,
      borderColor: o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      marginBottom: 5,
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
    inputContainer:{
      flex: 1,
      flexDirection: 'row',
    },
    inputStyle: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',

      width: '100%',
      minHeight: 40,
      margin: 5,
      paddingLeft: 10,
      color: o.itemtext,

      borderRadius: 5,
      borderColor: o.bordercolor,
      borderBottomWidth: 1,
      borderStyle: 'solid',
    },
    inputsLeft:{
      width: '15%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputsCenter:{
      width: '70%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputsRight:{
      width: '15%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    image:{
      ...gs.baseImage,
      tintColor: o.icontintcolor,
    },
    imageFade:{
      ...gs.baseImage,
      tintColor: o.icontintcolorfade,
    },
    imageDone:{
      tintColor: o.doneicontint,
    },
    imageCancel:{
      tintColor: o.cancelicontint,
    },
    imageDelete:{
      tintColor: o.trashicontint,
    },
    stepDoneImage:{
      ...gs.baseImage,
      tintColor: o.doneicontint,
    },
  });

  return (
    <View style={s.container}>
      <View style={
        [s.stepContainer, 
          props.isSelected && s.titleContainerSelected, 
          props.isSelected && props.isEndingPos && 
          s.titleContainerEnding]}>
        {!isEditingStep && getImportanceImage()}
        {!isEditingPos && isEditingStep?
          <View style={s.inputContainer}>
            <View style={s.inputsLeft}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDelete]} confirm={true} source={require('../../../../public/images/trash.png')} onPress={onDelete}></PressImage>
            </View>
            <View style={s.inputsCenter}>
              <View style={[s.titleRowContainer]}>
                {isEditingStep && getImportanceImage()}
                <TextInput 
                  style={s.inputStyle}
                  placeholderTextColor={o.itemtextfade}
                  placeholder="Title"
                  defaultValue={tempStep.Title}
                  onChangeText={(value: string)=>{setTempStep({...tempStep, Title: value})}} autoFocus></TextInput>
              </View>
              <View style={[s.importanceIconContainer]}>
                <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/cancel.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon(StepImportance.None);}}></PressImage>
                <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/low.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon(StepImportance.Low);}}></PressImage>
                <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/med.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon(StepImportance.Medium);}}></PressImage>
                <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/high.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon(StepImportance.High);}}></PressImage>
                <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/ladybug.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon(StepImportance.Ladybug);}}></PressImage>
                <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/questionmark.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon(StepImportance.Question);}}></PressImage>
                <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/wait.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon(StepImportance.Waiting);}}></PressImage>
                <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/inprogress.png')} onPress={() => {if(!isEditingPos)onChangeImportanceIcon(StepImportance.InProgress);}}></PressImage>
              </View>
            </View>
            <View style={s.inputsRight}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDone]} source={require('../../../../public/images/done.png')} onPress={onDoneStep}></PressImage>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageCancel]} source={require('../../../../public/images/cancel.png')} onPress={onCancelStep}></PressImage>
            </View> 
          </View> 
          :
          <PressText
            style={s.titleContainer}
            textStyle={step.Done? s.titleFade:s.title}
            text={step.Title}
            onPress={()=>{if(!isEditingPos)setIsEditingStep(!isEditingStep)}}
            ></PressText>
        }
        {!isEditingStep && !step.Done && <PressImage pressStyle={gs.baseImageContainer} style={s.image} source={require('../../../../public/images/step-black.png')} onPress={() => {if(!isEditingPos)onChangeIsDone();}}></PressImage>}
        {!isEditingStep && step.Done && <PressImage pressStyle={gs.baseImageContainer} style={s.imageFade} source={require('../../../../public/images/step-filled-black.png')} onPress={() => {if(!isEditingPos)onChangeIsDone();}}></PressImage>}
      </View>
    </View>
  );
};

export default StepView;