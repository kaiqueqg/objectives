import { View, StyleSheet, Text, Vibration, Alert, Pressable } from "react-native";
import { Item, Pattern,  Step, ItemViewProps } from "../../../Types";
import { ObjectivePallete, ThemePalette } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import PressImage from "../../../PressImage/PressImage";
import PressInput from "../../../PressInput/PressInput";
import { useEffect, useState } from "react";

//import StepIcon from "../../../assets/step.svg";

export interface StepViewProps extends ItemViewProps {
  step: Step,
}
const StepView = (props: StepViewProps) => {
  const { userPrefs, theme: t, fontTheme: f, putItem } = useUserContext();
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
      backgroundColor: step.Done? o.objbk:o.stepbk,
      
      borderRadius: 5,
      borderColor: o.bordercolor,
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
      color: o.steptitle,
    },
    titleFade:{
      color: o.steptitlefade,
    },
    inputStyle: {
      color: o.steptitle,
      borderColor: o.steptitle,
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
    imageFade:{
      height: 20,
      width: 20,
      tintColor: o.steptitlefade,
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
      tintColor: o.doneicontintstep,
    },
  });

  return (
    <View style={s.container}>
      <View style={[s.titleContainer, props.isSelected && s.titleContainerSelected, props.isSelected && props.isEndingPos && s.titleContainerEnding]}>
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
          trashImageStyle={{tintColor: o.trashicontintstep}}
          >
        </PressInput>
        {!isEditingTitle && !step.Done && <PressImage pressStyle={s.imageContainer} style={s.image} source={require('../../../../public/images/step-black.png')} onPress={() => {if(!isEditingPos)onChangeIsDone();}}></PressImage>}
        {!isEditingTitle && step.Done && <PressImage pressStyle={s.imageContainer} style={s.imageFade} source={require('../../../../public/images/step-filled-black.png')} onPress={() => {if(!isEditingPos)onChangeIsDone();}}></PressImage>}
      </View>
    </View>
  );
};

export default StepView;