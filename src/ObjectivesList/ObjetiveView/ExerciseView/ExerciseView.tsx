import { View, StyleSheet, Vibration, TextInput, Text, Keyboard, BackHandler } from "react-native";
import { Exercise, Pattern, ItemViewProps, Weekdays } from "../../../Types";
import { colorPalette, getObjTheme, globalStyle as gs } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import PressImage from "../../../PressImage/PressImage";
import { useEffect, useState } from "react";
import PressText from "../../../PressText/PressText";
import React from "react";

export const New = () => {
  return(
    {
      Title: '',
      IsDone: false,
      Reps: 1,
      Series: 1,
      MaxWeight: '',
      Description: '',
      Weekdays: [],
      LastDone: '',
    }
  )
}

export interface ExerciseViewProps extends ItemViewProps {
  exercise: Exercise,
}

const ExerciseView = (props: ExerciseViewProps) => {
  const { userPrefs, theme: t, fontTheme: f, putItem } = useUserContext();
  const { objTheme: o, isEditingPos, onDeleteItem, loadMyItems, exercise } = props;

  const [isSavingExercise, setIsSavingExercise] = useState<boolean>(false);
  const [isSavingIsDone, setIsSavingIsDone] = useState<boolean>(false);
  const [isEditingExercise, setIsEditingExercise] = useState<boolean>(false);
  const [newExercise, setNewExercise] = useState<Exercise>(exercise);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
        
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
    const hide = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

    const backAction = () => {
      if (keyboardVisible) {
        Keyboard.dismiss();
        return true;
      }
      
      onCancelExercise();
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

  useEffect(()=>{
    const now = new Date();
    const exerciseDate = new Date(exercise.LastDone);

    const needToWorkoutToday = (
      (now.getFullYear() >= exerciseDate.getFullYear() ||
      now.getMonth() >= exerciseDate.getMonth()) &&
      now.getDay() > exerciseDate.getDay()
    )

    if (exercise.IsDone && needToWorkoutToday && exercise.Weekdays.includes(now.getDay())) {
      onChangeIsDone();
    }
  }, []);

  useEffect(() => {
  }, [exercise, newExercise]);

  const onDelete = async () => {
    await onDeleteItem(exercise);
  }

  const doneEdit = async () => {
    const newItem: Exercise = {...newExercise, LastModified: new Date().toISOString()};

    if(newItem.Title !== exercise.Title || 
      newItem.Reps !== exercise.Reps ||
      newItem.Series !== exercise.Series ||
      newItem.MaxWeight !== exercise.MaxWeight ||
      newItem.Pos !== exercise.Pos ||
      newItem.Description !== exercise.Description ||
      newItem.Weekdays !== exercise.Weekdays ||
      newItem.LastDone !== exercise.LastDone) {
      setIsSavingExercise(true);

      await putItem(newItem);
      setIsEditingExercise(false);
      loadMyItems();
    }
    else{
      setIsEditingExercise(false);
    }
  }

  const onCancelExercise = async () => {
    setIsEditingExercise(false);
  }

  const onChangeIsDone = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    const newExercise = {...exercise, IsDone: !exercise.IsDone,LastDone: !exercise.IsDone? new Date().toISOString():exercise.LastDone, };
    await putItem(newExercise);
    loadMyItems();
  }

  const weekdayChange = async (weekday: Weekdays) => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    const includes = newExercise.Weekdays.includes(weekday);
  
    if(includes){
      setNewExercise({...newExercise, Weekdays: newExercise.Weekdays.filter((item)=>item!==weekday)});
    }
    else{
      setNewExercise({...newExercise, Weekdays: [...newExercise.Weekdays, weekday]});
    }
  }

  const getWeekdayButton = (weekday: Weekdays) => {
    let t = '';
    switch (weekday) {
      case Weekdays.Monday:
        t='Mo'
        break;
      case Weekdays.Tuesday:
        t='Tu'
        break;
      case Weekdays.Wednesday:
        t='We'
        break;
      case Weekdays.Thursday:
        t='Th'
        break;
      case Weekdays.Friday:
        t='Fr'
        break;
      case Weekdays.Saturday:
        t='Sa'
        break;
      case Weekdays.Sunday:
        t='Su'
        break;
    }

    const isSelected = newExercise.Weekdays.includes(weekday);

    return(
      <View style={[s.exerciseWeekdaysButton]} onTouchEnd={()=>weekdayChange(weekday)}>
        <Text style={[s.exerciseWeekdaysButtonText, isSelected?s.exerciseWeekdaysButtonTextSelected:'']}>{t}</Text>
      </View>
    );
  }

  const onEditingExercise = () => {
    if(!isEditingPos && !props.isLocked) setIsEditingExercise(!isEditingExercise);
    else Vibration.vibrate(Pattern.Wrong);
  }

  const getTitleDisplay = () => {
    let exerciseRepSerie = '';
    if(exercise.Reps > 1 || exercise.Series > 1) exerciseRepSerie += exercise.Series + 'x' + exercise.Reps + ' ';

    let daysOfWeek = '';
    
    daysOfWeek += exercise.Weekdays.includes(Weekdays.Monday)?' M':'';
    daysOfWeek += exercise.Weekdays.includes(Weekdays.Tuesday)?' t':'';
    daysOfWeek += exercise.Weekdays.includes(Weekdays.Wednesday)?' W':'';
    daysOfWeek += exercise.Weekdays.includes(Weekdays.Thursday)?' T':'';
    daysOfWeek += exercise.Weekdays.includes(Weekdays.Friday)?' F':'';
    daysOfWeek += exercise.Weekdays.includes(Weekdays.Saturday)?' s':'';
    daysOfWeek += exercise.Weekdays.includes(Weekdays.Saturday)?' S':'';

    return (
      <View style={s.exerciseMainRow}>
        <View style={s.exerciseTopRow}>
          <PressText
            style={s.textContainer}
            textStyle={exercise.IsDone? s.titleFade:s.titleText}
            text={exercise.Title}
            onPress={()=>{onEditingExercise()}}
            defaultStyle={o}
            hideDefaultTextBorder={true}
            ellipsizeMode='middle'
          ></PressText>
          <PressText style={[s.textContainer, {flex: 1}]} textStyle={s.maxText} defaultStyle={o} text={exercise.MaxWeight} onPress={onEditingExercise} hideDefaultTextBorder={true}></PressText>
          <PressText style={s.textContainer} textStyle={s.daysText} defaultStyle={o} text={daysOfWeek} onPress={onEditingExercise} hideDefaultTextBorder={true}></PressText>
          <PressText style={[s.textContainer]} textStyle={s.seriesRepsText} defaultStyle={o} text={exerciseRepSerie} onPress={onEditingExercise} hideDefaultTextBorder={true}></PressText>
        </View>
        <View style={s.exerciseBottomRow}>
          {exercise.Description && <PressText style={s.descriptionContainer} textStyle={[s.descriptionText, exercise.IsDone? {color: o.itemtextfadedark}:undefined]} text={exercise.Description} onPress={()=>{if(!isEditingPos && !props.isLocked)setIsEditingExercise(!isEditingExercise)}} defaultStyle={o} hideDefaultTextBorder={true}></PressText>}
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
    exerciseContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: exercise.IsDone? o.objbk:o.itembk,
      
      borderColor: exercise.IsDone?colorPalette.transparent:o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: o.borderRadius,
    },
    exerciseContainerSelected:{
      borderStyle: 'dashed',
      borderColor: o.bordercolorselected,
    },
    exerciseContainerEnding:{
      borderStyle: 'solid',
      borderColor: o.bordercolorselected,
    },
    exerciseMainRow:{
      flex: 1,
      minHeight: 40,
    },
    exerciseTopRow:{
      flexDirection: 'row',
    },
    exerciseBottomRow: {
      flexDirection: 'row',
    },
    descriptionContainer:{
      flex: 1,
      justifyContent: 'center',
      paddingLeft: 10,
    },
    descriptionText:{
      flex: 1,
      flexWrap: 'wrap',
      width: '100%',
      verticalAlign: 'middle',
      justifyContent: 'center',
      alignItems: 'center',
      color: o.itemtextfade,
      fontSize: 12,

      marginBottom: 6,
    },
    textContainer:{
      justifyContent: 'center',
      paddingLeft: 10,
    },
    titleText:{
      flex: 1,
      verticalAlign: 'middle',
      color: o.itemtext,
    },
    daysText:{
      minHeight: 40,
      textAlign: "right",
      verticalAlign: 'middle',
      color: o.itemtextfade,
      paddingLeft: 5,
    },
    maxText:{
      minHeight: 40,
      textAlign: "left",
      verticalAlign: 'middle',
      color: o.itemtextfade,
      paddingLeft: 5,
    },
    seriesRepsText:{
      minHeight: 40,
      textAlign: "right",
      verticalAlign: 'middle',
      color: o.itemtext,
      paddingLeft: 5,
    },
    titleFade:{
      color: o.itemtextfade,
    },
    image:{
      ...gs.baseImage,
      tintColor: o.icontintcolor,
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
    imageFade:{
      ...gs.baseImage,
      tintColor: o.icontintcolorfade,
    },
    exerciseDoneImage:{
      tintColor: o.doneicontint,
    },
    inputsContainer:{
      flex: 1,
      flexDirection: 'row',
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
    inputStyle:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',

      width: '100%',
      minHeight: 40,
      margin: 2,
      paddingLeft: 10,
      color: o.itemtext,

      borderRadius: 5,
      borderColor: o.icontintcolor,
      borderBottomWidth: 1,
      borderStyle: 'solid',
    },
    exerciseWeekdaysContainer:{
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: "row",
    },
    exerciseWeekdaysButton:{
      flex: 1,
      minHeight: 40,
      margin: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    exerciseWeekdaysButtonText:{
      textAlign: "center",
      color: o.itemtextfade,
    },
    exerciseWeekdaysButtonTextSelected:{
      color: o.itemtext,
    }
  });

  return (
    <View style={s.container}>
      <View style={[s.exerciseContainer, props.isSelected && s.exerciseContainerSelected, props.isSelected && props.isEndingPos && s.exerciseContainerEnding]}>
        {!isEditingPos && isEditingExercise?
          <View style={s.inputsContainer}>
            <View style={s.inputsLeft}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDelete]} confirm={true} source={require('../../../../public/images/trash.png')} onPress={onDelete}></PressImage>
            </View>
            <View style={s.inputsCenter}>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Title"
                defaultValue={exercise.Title}
                onChangeText={(value: string)=>{setNewExercise({...newExercise, Title: value})}} autoFocus
                onSubmitEditing={doneEdit}>
              </TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Series"
                defaultValue={exercise.Series.toString()}
                keyboardType="numeric" 
                onChangeText={(value: string)=>{
                  const numericValue = value.replace(/[^0-9]/g, '');
                  const quantity = numericValue !== '' ? parseInt(numericValue, 10) : 1;
                  setNewExercise({...newExercise, Series: quantity})}}
                onSubmitEditing={doneEdit}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Reps"
                defaultValue={exercise.Reps.toString()}
                keyboardType="numeric" 
                onChangeText={(value: string)=>{
                  const numericValue = value.replace(/[^0-9]/g, '');
                  const quantity = numericValue !== '' ? parseInt(numericValue, 10) : 1;
                  setNewExercise({...newExercise, Reps: quantity})}}
                onSubmitEditing={doneEdit}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Max"
                defaultValue={exercise.MaxWeight}
                onChangeText={(value: string)=>{setNewExercise({...newExercise, MaxWeight: value})}}
                onSubmitEditing={doneEdit}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Description"
                defaultValue={exercise.Description}
                onChangeText={(value: string)=>{setNewExercise({...newExercise, Description: value})}}
                onSubmitEditing={doneEdit}
                ></TextInput>
              <View style={s.exerciseWeekdaysContainer}>
                {getWeekdayButton(Weekdays.Monday)}
                {getWeekdayButton(Weekdays.Tuesday)}
                {getWeekdayButton(Weekdays.Wednesday)}
                {getWeekdayButton(Weekdays.Thursday)}
                {getWeekdayButton(Weekdays.Friday)}
                {getWeekdayButton(Weekdays.Saturday)}
                {getWeekdayButton(Weekdays.Sunday)}
              </View>
            </View>  
            <View style={s.inputsRight}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDone]} source={require('../../../../public/images/done.png')} onPress={doneEdit}></PressImage>
              <View style={gs.baseImageContainer}></View>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageCancel]} source={require('../../../../public/images/cancel.png')} onPress={onCancelExercise}></PressImage>
            </View>
          </View>
          :
          getTitleDisplay()
        }
        {!isEditingExercise && !exercise.IsDone && <PressImage pressStyle={gs.baseImageContainer} style={s.image} source={require('../../../../public/images/exercise.png')} onPress={() => {if(!isEditingPos)onChangeIsDone();}}></PressImage>}
        {!isEditingExercise && exercise.IsDone && <PressImage pressStyle={gs.baseImageContainer} style={s.imageFade} source={require('../../../../public/images/exercise-filled.png')} onPress={() => {if(!isEditingPos)onChangeIsDone();}}></PressImage>}
      </View>
    </View>
  );
};

export default ExerciseView;