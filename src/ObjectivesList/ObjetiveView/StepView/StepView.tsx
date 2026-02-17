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
import { Images } from "../../../Images";

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
  const { objTheme: o, isSelected, isSelecting, isDisabled, onDeleteItem: onDelete, loadMyItems, step, isLocked, itemsListScrollTo, wasJustAdded} = props;

  const [isEditingStep, setIsEditingStep] = useState<boolean>(false);
  const [tempStep, setTempStep] = useState<Step>(step);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  useEffect(() => {
  }, [isDisabled, wasJustAdded])

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
      return <PressImage raw source={Images.Low}/>;
    }
    else if(step.Importance === StepImportance.Medium){
      return <PressImage raw source={Images.Med}/>;
    }
    else if(step.Importance === StepImportance.High){
      return <PressImage raw source={Images.High}/>;
    }
    else if(step.Importance === StepImportance.Ladybug){
      return <PressImage raw source={Images.Ladybug}/>;
    }
    else if(step.Importance === StepImportance.LadybugYellow){
      return <PressImage raw source={Images.LadybugYellow}/>;
    }
    else if(step.Importance === StepImportance.LadybugGreen){
      return <PressImage raw source={Images.LadybugGreen}/>;
    }
    else if(step.Importance === StepImportance.Question){
      return <PressImage cT={o} source={Images.QuestionMark}/>;
    }
    else if(step.Importance === StepImportance.Waiting){
      return <PressImage cT={o} source={Images.Wait}/>;
    }
    else if(step.Importance === StepImportance.InProgress){
      return <PressImage cT={o} source={Images.InProgress}/>;
    }
    else{
      if(isEditingStep && !isDisabled){
        return <PressImage cT={o} source={Images.Cancel}/>;
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
      <View style={[s.stepContainer, isSelecting && s.containerSelecting, isSelected && s.containerSelected, wasJustAdded && s.containerWasJustAdded]}>
        {getImportanceImage()}
        <PressText
          style={s.titleContainer}
          textStyle={step.Done? s.titleFade:s.title}
          text={step.Title}
          onPress={()=>{if(!isDisabled)onEditingStep()}}
          defaultStyle={o}
          ellipsizeMode='middle'/>
        <PressImage cT={o} source={step.Done? Images.StepFilled:Images.Step} onPress={() => {if(!isDisabled)onChangeIsDone();}} confirm={step.AutoDestroy && !step.Done} fade={step.Done}/>
      </View>
    )
  }

  const getEditingView = () => {
    return(
      <View style={[s.stepContainer, props.isSelecting && s.containerSelecting, props.isSelected && s.containerSelected, wasJustAdded && s.containerWasJustAdded]}>
        <View style={s.inputContainer}>
          <View style={s.inputsLeft}>
            <PressImage source={Images.Trash} onPress={onDeleteItem} color={o.trashicontint}/>
          </View>
          <View style={s.inputsCenter}>
            <View style={[s.titleRowContainer]}>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.innertextcolorfade}
                placeholder="Title"
                defaultValue={tempStep.Title}
                onSubmitEditing={()=>{onDoneStep()}}
                onChangeText={(value: string)=>{setTempStep({...tempStep, Title: value})}} autoFocus={step.Title.trim() === ''}></TextInput>
            </View>
            <View style={[s.importanceIconContainer]}>
              
              <PressImage cT={o} source={Images.Null} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.None);}}/>
              <PressImage source={Images.Low} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.Low);}} raw/>
              <PressImage source={Images.Med} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.Medium);}} raw/>
              <PressImage source={Images.High} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.High);}} raw/>
              <PressImage source={Images.LadybugGreen} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.LadybugGreen);}} raw/>
              <PressImage source={Images.LadybugYellow} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.LadybugYellow);}} raw/>
              <PressImage source={Images.Ladybug} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.Ladybug);}} raw/>
              <PressImage cT={o} source={Images.QuestionMark} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.Question);}}/>
              <PressImage cT={o} source={Images.Wait} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.Waiting);}}/>
              <PressImage cT={o} source={Images.InProgress} onPress={() => {if(!isDisabled)onDoneStep(StepImportance.InProgress);}}/>
            </View>
            <Pressable style={[s.autoDestroyContainer]} onPress={onChangeAutoDestroy}>
              <Text style={s.autoDestroyText}>Autodestroy when you click on</Text>
              <PressImage cT={o} source={Images.Step} selected={step.Done}/>
            </Pressable>
          </View>
          <View style={s.inputsRight}>
            <PressImage cT={o} source={Images.Done} onPress={onDoneStep} color={o.doneicontint}/>
            <PressImage cT={o} source={Images.Cancel} onPress={onCancelStep} color={o.cancelicontint}/>
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
      backgroundColor: (step.Done && !isEditingStep)? o.backgroundcolor:o.innerbackgroundcolor,
      
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
      // paddingBottom: 5,
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
      backgroundColor: tempStep.AutoDestroy?o.backgroundcolordark:'#00000000',

      borderColor: tempStep.AutoDestroy?o.bordercolor:'#00000000',
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
    },
    autoDestroyText:{
      color: o.innertextcolor,
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
    title:{
      color: o.innertextcolor,
    },
    titleFade:{
      color: o.innertextcolorfade,
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
      color: o.innertextcolor,

      borderRadius: 5,
      borderColor: o.icontint,
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