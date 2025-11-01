import { View, StyleSheet, Text, Vibration, TextInput, Keyboard, BackHandler } from "react-native";
import { Pattern,  Step, ItemViewProps, StepImportance } from "../../../Types";
import { colorPalette, globalStyle as gs, ObjectivePallete } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import PressImage from "../../../PressImage/PressImage";
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
  const { objTheme: o, isEditingPos, onDeleteItem: onDelete, loadMyItems, step} = props;

  const [isEditingStep, setIsEditingStep] = useState<boolean>(false);
  const [tempStep, setTempStep] = useState<Step>(step);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
      
  useEffect(() => {
    setTempStep(step);
  }, [step])

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
    const hide = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

    const backAction = () => {
      if (keyboardVisible) {
        Keyboard.dismiss();
        return true;
      }
      
      onCancelStep();
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

  const onDeleteItem = async () => {
    await onDelete(step);
  }

  const onDoneStep = async (newImp?: StepImportance) => {
    const newStep:Step = {
      ...tempStep,
      Title: tempStep.Title.trim(),
      Importance: newImp??tempStep.Importance,
      AutoDestroy: tempStep.AutoDestroy,
    };
    await putItem(newStep);
    setIsEditingStep(false);
    loadMyItems();
  }

  const onChangeAutoDestroy = () => {
    setTempStep({...tempStep, AutoDestroy: !tempStep.AutoDestroy});
  }

  const onCancelStep = async () => {
    setIsEditingStep(false);
  }

  const onChangeIsDone = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    if(step.AutoDestroy && !step.Done) { 
      await onDeleteItem(); 
      return;
    }

    const newStep = {...step, Done: !step.Done};
    await putItem(newStep);
    loadMyItems();
  }

  const getImportanceImage = () => {
    if(step.Importance === StepImportance.Low){
      return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/low.png')}></PressImage>;
    }
    else if(step.Importance === StepImportance.Medium){
      return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/med.png')}></PressImage>;
    }
    else if(step.Importance === StepImportance.High){
      return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/high.png')}></PressImage>;
    }
    else if(step.Importance === StepImportance.Ladybug){
      return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/ladybug.png')}></PressImage>;
    }
    else if(step.Importance === StepImportance.LadybugYellow){
      return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/ladybugyellow.png')}></PressImage>;
    }
    else if(step.Importance === StepImportance.LadybugGreen){
      return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/ladybuggreen.png')}></PressImage>;
    }
    else if(step.Importance === StepImportance.Question){
      return <PressImage pressStyle={gs.baseImageContainer} style={s.stepImageImportance} source={require('../../../../public/images/questionmark.png')}></PressImage>;
    }
    else if(step.Importance === StepImportance.Waiting){
      return <PressImage pressStyle={gs.baseImageContainer} style={s.stepImageImportance} source={require('../../../../public/images/wait.png')}></PressImage>;
    }
    else if(step.Importance === StepImportance.InProgress){
      return <PressImage pressStyle={gs.baseImageContainer} style={s.stepImageImportance} source={require('../../../../public/images/inprogress.png')}></PressImage>;
    }
    else{
      if(isEditingStep){
        return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/cancel.png')}></PressImage>;

      }
      else{
        return <></>;
      }
    }
  }

  const onEditingStep = () => {
    if(props.isLocked) {
      Vibration.vibrate(Pattern.Wrong);
      return;
    }

    if(!isEditingPos){
      setIsEditingStep(!isEditingStep);
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
      backgroundColor: (step.Done && !isEditingStep)? o.objbk:o.itembk,
      
      borderColor: (step.Done && !isEditingStep)?colorPalette.transparent:o.bordercolor,
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
      borderColor: o.icontintcolor,
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
    importanceImageSelected:{
      backgroundColor: o.itembkdark,

      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: o.bordercolorlight,
      borderRadius: 5,
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
    stepImageImportance:{
      ...gs.baseImage,
      tintColor: o.icontintcolor,
    }
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
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDelete]} confirm={true} source={require('../../../../public/images/trash.png')} onPress={onDeleteItem}></PressImage>
            </View>
            <View style={s.inputsCenter}>
              <View style={[s.titleRowContainer]}>
                <TextInput 
                  style={s.inputStyle}
                  placeholderTextColor={o.itemtextfade}
                  placeholder="Title"
                  defaultValue={tempStep.Title}
                  onSubmitEditing={()=>{onDoneStep()}}
                  onChangeText={(value: string)=>{setTempStep({...tempStep, Title: value})}} autoFocus={step.Title.trim() === ''}></TextInput>
                <PressImage pressStyle={[gs.baseImageContainer]} style={[s.image, tempStep.AutoDestroy?undefined:s.imageFade]} source={require('../../../../public/images/explode.png')} onPress={onChangeAutoDestroy}></PressImage>
              </View>
              <View style={[s.importanceIconContainer]}>
                <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.None? s.importanceImageSelected:undefined]} style={s.stepImageImportance} source={require('../../../../public/images/cancel.png')} onPress={() => {if(!isEditingPos)onDoneStep(StepImportance.None);}}></PressImage>
                <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.Low? s.importanceImageSelected:undefined]} style={gs.baseImage} source={require('../../../../public/images/low.png')} onPress={() => {if(!isEditingPos)onDoneStep(StepImportance.Low);}}></PressImage>
                <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.Medium? s.importanceImageSelected:undefined]} style={gs.baseImage} source={require('../../../../public/images/med.png')} onPress={() => {if(!isEditingPos)onDoneStep(StepImportance.Medium);}}></PressImage>
                <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.High? s.importanceImageSelected:undefined]} style={gs.baseImage} source={require('../../../../public/images/high.png')} onPress={() => {if(!isEditingPos)onDoneStep(StepImportance.High);}}></PressImage>
                <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.LadybugGreen? s.importanceImageSelected:undefined]} style={gs.baseImage} source={require('../../../../public/images/ladybuggreen.png')} onPress={() => {if(!isEditingPos)onDoneStep(StepImportance.LadybugGreen);}}></PressImage>
                <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.LadybugYellow? s.importanceImageSelected:undefined]} style={gs.baseImage} source={require('../../../../public/images/ladybugyellow.png')} onPress={() => {if(!isEditingPos)onDoneStep(StepImportance.LadybugYellow);}}></PressImage>
                <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.Ladybug? s.importanceImageSelected:undefined]} style={gs.baseImage} source={require('../../../../public/images/ladybug.png')} onPress={() => {if(!isEditingPos)onDoneStep(StepImportance.Ladybug);}}></PressImage>
                <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.Question? s.importanceImageSelected:undefined]} style={s.stepImageImportance} source={require('../../../../public/images/questionmark.png')} onPress={() => {if(!isEditingPos)onDoneStep(StepImportance.Question);}}></PressImage>
                <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.Waiting? s.importanceImageSelected:undefined]} style={s.stepImageImportance} source={require('../../../../public/images/wait.png')} onPress={() => {if(!isEditingPos)onDoneStep(StepImportance.Waiting);}}></PressImage>
                <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.InProgress? s.importanceImageSelected:undefined]} style={s.stepImageImportance} source={require('../../../../public/images/inprogress.png')} onPress={() => {if(!isEditingPos)onDoneStep(StepImportance.InProgress);}}></PressImage>
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
            onPress={()=>{onEditingStep()}}
            defaultStyle={o}
            ellipsizeMode='middle'
            ></PressText>
        }
        {!step.AutoDestroy && !isEditingStep && !step.Done && 
          <PressImage 
            pressStyle={gs.baseImageContainer}
            style={s.image}
            source={require('../../../../public/images/step.png')}
            onPress={() => {if(!isEditingPos)onChangeIsDone();}}
            confirm={step.AutoDestroy}>
          </PressImage>}
        {!isEditingStep && step.Done && 
          <PressImage 
            pressStyle={gs.baseImageContainer}
            style={s.imageFade}
            source={require('../../../../public/images/step-filled.png')}
            onPress={() => {if(!isEditingPos)onChangeIsDone();}}>
          </PressImage>}
          {!isEditingStep && step.AutoDestroy && 
          <PressImage 
            pressStyle={gs.baseImageContainer}
            style={s.image}
            source={require('../../../../public/images/explode.png')}
            onPress={() => {if(!isEditingPos)onDeleteItem();}}
            confirm>
          </PressImage>}
      </View>
    </View>
  );
};

export default StepView;