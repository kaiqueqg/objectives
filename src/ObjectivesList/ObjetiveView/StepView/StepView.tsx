import { View, StyleSheet, Text, Vibration, TextInput, Keyboard, BackHandler, Pressable } from "react-native";
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
  const { objTheme: o, isSelected, isSelecting, isDisabled, onDeleteItem: onDelete, loadMyItems, step, isLocked, itemsListScrollTo} = props;

  const [isEditingStep, setIsEditingStep] = useState<boolean>(false);
  const [tempStep, setTempStep] = useState<Step>(step);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  useEffect(() => {
    
  }, [isDisabled])

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
      if(isEditingStep && !isDisabled){
        return <PressImage pressStyle={gs.baseImageContainer} style={gs.baseImage} source={require('../../../../public/images/cancel.png')}></PressImage>;
      }
      else{
        return <></>;
      }
    }
  }

  const onEditingStep = () => {
    if(isLocked) {
      Vibration.vibrate(Pattern.Wrong);
      return;
    }

    if(!isDisabled){
      itemsListScrollTo(step.ItemId);
      setIsEditingStep(!isEditingStep);
    }
  }

  const getNormalView = () => {
    return(
      <View style={[s.stepContainer, isSelecting && s.containerSelecting, isSelected && s.containerSelected]}>
        {getImportanceImage()}
        <PressText
          style={s.titleContainer}
          textStyle={step.Done? s.titleFade:s.title}
          text={step.Title}
          onPress={()=>{onEditingStep()}}
          defaultStyle={o}
          ellipsizeMode='middle'
        ></PressText>
        {!step.Done && 
          <PressImage 
            pressStyle={gs.baseImageContainer}
            style={s.image}
            source={require('../../../../public/images/step.png')}
            onPress={() => {if(!isDisabled)onChangeIsDone();}}
            confirm={step.AutoDestroy}>
          </PressImage>}
        {step.Done && 
          <PressImage 
            pressStyle={gs.baseImageContainer}
            style={s.imageFade}
            source={require('../../../../public/images/step-filled.png')}
            onPress={() => {if(!isDisabled)onChangeIsDone();}}>
          </PressImage>}
      </View>
    )
  }

  const getEditingView = () => {
    return(
      <View style={[s.stepContainer, props.isSelecting && s.containerSelecting, props.isSelected && s.containerSelected]}>
        <View style={s.inputContainer}>
          <View style={s.inputsLeft}>
            <PressImage pressStyle={s.stepTrash} style={[s.image, s.imageDelete]} confirm={true} source={require('../../../../public/images/trash.png')} onPress={onDeleteItem}></PressImage>
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
              {/* <PressImage pressStyle={[gs.baseImageContainer]} style={[s.image, tempStep.AutoDestroy?s.imageDelete:s.imageFade]} source={require('../../../../public/images/explode.png')} onPress={onChangeAutoDestroy}></PressImage> */}
            </View>
            <View style={[s.importanceIconContainer]}>
              <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.None? s.importanceImageSelected:undefined]} style={s.stepImageImportance} source={require('../../../../public/images/null.png')} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.None);}}></PressImage>
              <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.Low? s.importanceImageSelected:undefined]} style={gs.baseImage} source={require('../../../../public/images/low.png')} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.Low);}}></PressImage>
              <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.Medium? s.importanceImageSelected:undefined]} style={gs.baseImage} source={require('../../../../public/images/med.png')} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.Medium);}}></PressImage>
              <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.High? s.importanceImageSelected:undefined]} style={gs.baseImage} source={require('../../../../public/images/high.png')} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.High);}}></PressImage>
              <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.LadybugGreen? s.importanceImageSelected:undefined]} style={gs.baseImage} source={require('../../../../public/images/ladybuggreen.png')} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.LadybugGreen);}}></PressImage>
              <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.LadybugYellow? s.importanceImageSelected:undefined]} style={gs.baseImage} source={require('../../../../public/images/ladybugyellow.png')} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.LadybugYellow);}}></PressImage>
              <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.Ladybug? s.importanceImageSelected:undefined]} style={gs.baseImage} source={require('../../../../public/images/ladybug.png')} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.Ladybug);}}></PressImage>
              <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.Question? s.importanceImageSelected:undefined]} style={s.stepImageImportance} source={require('../../../../public/images/questionmark.png')} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.Question);}}></PressImage>
              <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.Waiting? s.importanceImageSelected:undefined]} style={s.stepImageImportance} source={require('../../../../public/images/wait.png')} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.Waiting);}}></PressImage>
              <PressImage pressStyle={[gs.baseImageContainer, step.Importance === StepImportance.InProgress? s.importanceImageSelected:undefined]} style={s.stepImageImportance} source={require('../../../../public/images/inprogress.png')} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.InProgress);}}></PressImage>
            </View>
            <Pressable style={[s.autoDestroyContainer]} onPress={onChangeAutoDestroy}>
              <Text style={s.autoDestroyText}>Autodestroy when you click on</Text>
              <PressImage pressStyle={[s.stepDone]} style={[s.image]} source={require('../../../../public/images/step.png')}></PressImage>
              {/* <Text style={s.autoDestroyText}>should self delete? {tempStep.AutoDestroy?'Yes.': 'No.'}</Text> */}
            </Pressable>
          </View>
          <View style={s.inputsRight}>
            <PressImage pressStyle={[s.stepDone]} style={[s.image, s.imageDone]} source={require('../../../../public/images/done.png')} onPress={onDoneStep}></PressImage>
            <PressImage pressStyle={s.stepCancel} style={[s.image, s.imageCancel]} source={require('../../../../public/images/cancel.png')} onPress={onCancelStep}></PressImage>
          </View> 
        </View>
      </View>
    )
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
      paddingBottom: 5,
    },
    importanceIconContainer:{
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 5,
    },
    autoDestroyContainer:{
      flex: 1,
      justifyContent: "center",
      alignItems: 'center',
      verticalAlign: 'middle',
      flexDirection: "row",
      textAlign: 'center',
      paddingHorizontal: 10,
      marginBottom: 5,
      backgroundColor: tempStep.AutoDestroy?o.itembkdark:'#00000000',

      borderColor: tempStep.AutoDestroy?o.bordercolor:'#00000000',
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
    },
    autoDestroyText:{
      color: 'beige',
    },
    containerSelecting:{
      borderStyle: 'solid',
      borderColor: o.bordercolorselecting,
    },
    containerSelected:{
      borderStyle: 'dashed',
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
      backgroundColor: colorPalette.lighter,

      borderWidth: 1,
      borderStyle: 'dotted',
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
    },
    stepDone:{
      ...gs.baseImageContainer,
      // ...gs.baseItemCheckImage,

      // borderColor: o.doneicontint,
    },
    stepCancel:{
      ...gs.baseImageContainer,
      // ...gs.baseItemCheckImage,

      // borderColor: o.cancelicontint,
    },
    stepTrash:{
      ...gs.baseImageContainer,
      // ...gs.baseItemCheckImage,

      // borderColor: o.trashicontint,
    }
  });

  return (
    <View style={[s.container]}>
      {isEditingStep && !isDisabled?
        getEditingView()
        :
        getNormalView()
      }
    </View>
  );
};

export default StepView;