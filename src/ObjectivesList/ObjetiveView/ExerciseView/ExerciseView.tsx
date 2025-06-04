import { View, StyleSheet, Text, Vibration, TextInput } from "react-native";
import { Exercise, Pattern, ItemViewProps, Weekdays } from "../../../Types";
import { colorPalette, globalStyle as gs } from "../../../Colors";
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
    const includes = newExercise.Weekdays.includes(weekday);
  
    if(includes){
      setNewExercise({...newExercise, Weekdays: newExercise.Weekdays.filter((item)=>item!==weekday)});
    }
    else{
      setNewExercise({...newExercise, Weekdays: [...newExercise.Weekdays, weekday]});
    }
  };

  const getText = () => {
    let title = '';
    if(exercise.Reps > 1 || exercise.Series > 1) title += exercise.Series + 'x' + exercise.Reps + ' ';
    title += exercise.Title;
    if(exercise.MaxWeight) title += ' ('+exercise.MaxWeight+')';
    title += exercise.Weekdays.includes(Weekdays.Monday)?' M':'';
    title += exercise.Weekdays.includes(Weekdays.Tuesday)?' T':'';
    title += exercise.Weekdays.includes(Weekdays.Wednesday)?' W':'';
    title += exercise.Weekdays.includes(Weekdays.Thursday)?' Th':'';
    title += exercise.Weekdays.includes(Weekdays.Friday)?' F':'';
    title += exercise.Weekdays.includes(Weekdays.Saturday)?' S':'';

    return title;
  }

  const getWeekdayButton = (weekday: Weekdays) => {
    let t = '';
    switch (weekday) {
      case Weekdays.Monday:
        t='M'
        break;
      case Weekdays.Tuesday:
        t='T'
        break;
      case Weekdays.Wednesday:
        t='W'
        break;
      case Weekdays.Thursday:
        t='T'
        break;
      case Weekdays.Friday:
        t='F'
        break;
      case Weekdays.Saturday:
        t='S'
        break;
      case Weekdays.Sunday:
        t='S'
        break;
    }

    const isSelected = newExercise.Weekdays.includes(weekday);

    return(
      <View style={[s.exerciseWeekdaysButton]} onTouchEnd={()=>weekdayChange(weekday)}>
        <Text style={[s.exerciseWeekdaysButtonText, isSelected?s.exerciseWeekdaysButtonTextSelected:'']}>{t}</Text>
      </View>
    );
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
    titleContainer:{
      flex: 1,
      justifyContent: 'center',

      minHeight: 40,
      margin: 2,
      paddingLeft: 10,
      color: 'beige',
    },
    title:{
      color: o.itemtext,
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
                onChangeText={(value: string)=>{setNewExercise({...newExercise, Title: value})}} autoFocus></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Series"
                defaultValue={exercise.Series.toString()}
                keyboardType="numeric" 
                onChangeText={(value: string)=>{
                  const numericValue = value.replace(/[^0-9]/g, '');
                  const quantity = numericValue !== '' ? parseInt(numericValue, 10) : 1;
                  setNewExercise({...newExercise, Series: quantity})}}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Reps"
                defaultValue={exercise.Reps.toString()}
                keyboardType="numeric" 
                onChangeText={(value: string)=>{
                  const numericValue = value.replace(/[^0-9]/g, '');
                  const quantity = numericValue !== '' ? parseInt(numericValue, 10) : 1;
                  setNewExercise({...newExercise, Reps: quantity})}}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Max"
                defaultValue={exercise.MaxWeight}
                onChangeText={(value: string)=>{setNewExercise({...newExercise, MaxWeight: value})}}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Description"
                defaultValue={exercise.Description}
                onChangeText={(value: string)=>{setNewExercise({...newExercise, Description: value})}}></TextInput>
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
          <>
            <PressText
              style={s.titleContainer}
              textStyle={exercise.IsDone? s.titleFade:s.title}
              text={getText()}
              onPress={()=>{if(!isEditingPos)setIsEditingExercise(!isEditingExercise)}}
              ></PressText>
          </>
        }
        {!isEditingExercise && !exercise.IsDone && <PressImage pressStyle={gs.baseImageContainer} style={s.image} source={require('../../../../public/images/exercise.png')} onPress={() => {if(!isEditingPos)onChangeIsDone();}}></PressImage>}
        {!isEditingExercise && exercise.IsDone && <PressImage pressStyle={gs.baseImageContainer} style={s.imageFade} source={require('../../../../public/images/exercise-filled.png')} onPress={() => {if(!isEditingPos)onChangeIsDone();}}></PressImage>}
      </View>
    </View>
  );
};

export default ExerciseView;