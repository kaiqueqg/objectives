import { View, StyleSheet, Vibration, TextInput, Text, Keyboard, BackHandler } from "react-native";
import { Exercise, Pattern, ItemViewProps, Weekdays } from "../../../Types";
import { colorPalette, getObjTheme, globalStyle as gs } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import PressImage from "../../../PressImage/PressImage";
import { useEffect, useState } from "react";
import PressText from "../../../PressText/PressText";
import React from "react";
import { useLogContext } from "../../../Contexts/LogContext";
import { Images } from "../../../Images";

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
      BodyImages: [],
    }
  )
}

export interface ExerciseViewProps extends ItemViewProps {
  exercise: Exercise,
}

export const bodyImages: Record<string, any> = {
  cancel: Images.Cancel,
  abs: require('../../../../public/images/128px/abs.png'),
  anteriorforearm: require('../../../../public/images/128px/anteriorforearm.png'),
  backoutside: require('../../../../public/images/128px/backoutside.png'),
  biceps: require('../../../../public/images/128px/biceps.png'),
  calves: require('../../../../public/images/128px/calves.png'),
  chest: require('../../../../public/images/128px/chest.png'),
  innerthigh: require('../../../../public/images/128px/innerthigh.png'),
  externalobliques: require('../../../../public/images/128px/externalobliques.png'),
  frontthigh: require('../../../../public/images/128px/frontthigh.png'),
  glutes: require('../../../../public/images/128px/glutes.png'),
  hamstrings: require('../../../../public/images/128px/hamstrings.png'),
  lower: require('../../../../public/images/128px/lower.png'),
  lumbar: require('../../../../public/images/128px/lumbar.png'),
  obliques: require('../../../../public/images/128px/obliques.png'),
  pectorals: require('../../../../public/images/128px/pectorals.png'),
  posteriorforearm: require('../../../../public/images/128px/posteriorforearm.png'),
  quadriceps: require('../../../../public/images/128px/quadriceps.png'),
  rectusabdominis: require('../../../../public/images/128px/rectusabdominis.png'),
  shoulderback: require('../../../../public/images/128px/shoulderback.png'),
  shoulderfront: require('../../../../public/images/128px/shoulderfront.png'),
  topback: require('../../../../public/images/128px/topback.png'),
  outerthigh: require('../../../../public/images/128px/outerthigh.png'),
  trapezius: require('../../../../public/images/128px/trapezius.png'),
  triceps: require('../../../../public/images/128px/triceps.png'),
  cardio: require('../../../../public/images/128px/cardio.png'),
  stretching: require('../../../../public/images/128px/stretching.png'),
  warmup: require('../../../../public/images/128px/warmup.png'),
};

const ExerciseView = (props: ExerciseViewProps) => {
  const { userPrefs, theme: t, fontTheme: f, putItem } = useUserContext();
  const { objTheme: o, wasJustAdded, isSelected, isSelecting, isDisabled, onDeleteItem, loadMyItems, exercise } = props;
  const { log } = useLogContext();

  const [isEditingExercise, setIsEditingExercise] = useState<boolean>(false);
  const [newExercise, setNewExercise] = useState<Exercise>(exercise);

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
      newItem.LastDone !== exercise.LastDone || 
      newItem.BodyImages !== exercise.BodyImages){

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
      <View style={[isSelected?s.exerciseWeekdaysButtonSelected:s.exerciseWeekdaysButton]} onTouchEnd={()=>weekdayChange(weekday)}>
        <Text style={[s.exerciseWeekdaysButtonText, isSelected?s.exerciseWeekdaysButtonTextSelected:'']}>{t}</Text>
      </View>
    );
  }

  const onChangeBodyImage = (bodyImage: string) => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    if(bodyImage === 'cancel') {
      setNewExercise({...newExercise, BodyImages: []}); 
      return;
    }

    if(!newExercise.BodyImages){ //! fixing old BodyImages
      setNewExercise({...newExercise, BodyImages: [bodyImage]});
      return;
    }
    
    const includes = newExercise.BodyImages.includes(bodyImage);
    if(includes){
      setNewExercise({...newExercise, BodyImages: newExercise.BodyImages.filter((item)=>item!==bodyImage)});
    }
    else{
      setNewExercise({...newExercise, BodyImages: [...newExercise.BodyImages, bodyImage]});
    }
  };

  const getBodyImage = (bodyImage: string, view: boolean = false) => {
    if (!bodyImage || !bodyImages[bodyImage]) return <></>;

    return (
      <View key={bodyImage} style={[view?undefined:s.bodyImageContainer, newExercise.BodyImages.includes(bodyImage)&&!view?s.imageBodySelected:undefined]}>
        <PressImage
          key={bodyImage}
          source={bodyImages[bodyImage]}
          onPress={() => {if(view) onEditingExercise(); else onChangeBodyImage(bodyImage);}}
          raw
        />
      </View>
    );
  };  

  const onEditingExercise = () => {
    if(props.isLocked) {
      Vibration.vibrate(Pattern.Wrong);
      return;
    }

    if(!isDisabled){
      props.itemsListScrollTo(exercise.ItemId);
      setIsEditingExercise(!isEditingExercise);
    }
  }

  const getBodyImages = () => {
    if (!exercise.BodyImages || exercise.BodyImages === undefined || exercise.BodyImages.includes('cancel')) return <></>;

    const rtn = [];

    for (let i = 0; i < exercise.BodyImages.length; i++) {
      rtn.push(getBodyImage(exercise.BodyImages[i], true));
    }

    return <>{rtn}</>;
  };

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
        <View style={s.exerciseTitleRow}>
          {getBodyImages()}
          <PressText
            style={s.titleContainer}
            textStyle={[s.titleText, exercise.IsDone && s.titleFade]}
            text={exercise.Title}
            onPress={()=>{onEditingExercise()}}
            defaultStyle={o}
            hideDefaultTextBorder={true}
            ellipsizeMode='middle'/>
          {exerciseRepSerie && <PressText style={s.seriesRepsContainer} textStyle={[s.seriesRepsText, exercise.IsDone && s.titleFade]} defaultStyle={o} text={exerciseRepSerie} onPress={onEditingExercise} hideDefaultTextBorder={true}/>}
        </View>
        {(exercise.MaxWeight || daysOfWeek) && 
        <View style={s.exerciseSecondaryRow}>
          <PressText style={s.maxContainer} textStyle={s.maxText} defaultStyle={o} text={exercise.MaxWeight} onPress={onEditingExercise} hideDefaultTextBorder={true}/>
          <PressText style={s.daysContainer} textStyle={s.daysText} defaultStyle={o} text={daysOfWeek} onPress={onEditingExercise} hideDefaultTextBorder={true}/>
        </View>}
        {exercise.Description && 
          <PressText style={s.descriptionContainer} textStyle={[s.descriptionText, exercise.IsDone? {color: o.innertextfadedark}:undefined]} text={exercise.Description} onPress={()=>{if(!isDisabled && !props.isLocked)setIsEditingExercise(!isEditingExercise)}} defaultStyle={o} hideDefaultTextBorder={true} ellipsizeMode="tail"/>
        }
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
      backgroundColor: (exercise.IsDone && !isEditingExercise)? o.backgroundcolor:o.innerbackgroundcolor,
      
      borderColor: colorPalette.transparent,//(exercise.IsDone && !isEditingExercise)?colorPalette.transparent:o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: o.borderRadius,
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
    exerciseMainRow:{
      flex: 1,
      minHeight: 40,
      flexDirection: 'column',
    },
    exerciseTitleRow: {
      width: '100%',
      flex: 1,
      minHeight: 40,
      flexDirection: 'row',
      paddingLeft: 5,
    },
    exerciseSecondaryRow:{
      minHeight: 20,
      flexDirection: 'row',
      paddingLeft: 10,
    },
    descriptionContainer:{
      paddingLeft: 10,
    },
    descriptionText:{
      color: o.innertextcolorfade,
      fontSize: 12,
      marginBottom: 6,
    },
    titleContainer:{
      width: '100%',
      paddingLeft: 5,
    },
    titleText:{
      flex: 1,
      verticalAlign: 'middle',
      color: o.innertextcolor,
    },
    daysContainer: {
    },
    daysText:{
      textAlign: "right",
      verticalAlign: 'middle',
      color: o.innertextcolorfade,
      fontSize: 12,
    },
    maxContainer:{
    },
    maxText:{
      textAlign: "left",
      verticalAlign: 'middle',
      color: o.innertextcolorfade,
      fontSize: 12,
    },
    seriesRepsContainer:{
      minWidth: '20%',
      justifyContent: "center",
      alignItems:"flex-end",
    },
    seriesRepsText:{
      textAlign: "right",
      verticalAlign: 'middle',
      color: o.innertextcolor,
      paddingLeft: 5,
    },
    titleFade:{
      color: o.innertextcolorfade,
    },
    bodyImageContainer:{
      ...gs.baseImageContainer,
      margin: 2,
    },
    bodyImage:{
      ...gs.baseBiggerImage,
    },
    imageBodySelected:{
      backgroundColor: o.backgroundcolordark,
      borderColor: o.bordercolor,
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
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
      color: o.innertextcolor,

      borderRadius: 5,
      borderColor: o.icontint,
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
    exerciseWeekdaysButtonSelected:{
      flex: 1,
      minHeight: 40,
      margin: 2,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: o.backgroundcolordark,

      borderColor: o.bordercolor,
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
    },
    exerciseWeekdaysButtonText:{
      textAlign: "center",
      color: o.innertextcolorfade,
    },
    exerciseWeekdaysButtonTextSelected:{
      color: o.innertextcolorcontrast,
      fontWeight: 'bold',
    },
    exerciseImageContainer:{
      flexWrap: "wrap",
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: "row",
    },
  });

  return (
    <View style={[s.container]}>
      <View style={[s.exerciseContainer, isSelecting && s.containerSelecting, isSelected && s.containerSelected, wasJustAdded && s.containerWasJustAdded]}>
        {!isDisabled && isEditingExercise?
          <View style={s.inputsContainer}>
            <View style={s.inputsLeft}>
              <PressImage color={o.trashicontint} confirm={true} source={Images.Trash} onPress={onDelete}/>
            </View>
            <View style={s.inputsCenter}>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.innertextcolorfade}
                placeholder="Title"
                defaultValue={exercise.Title}
                onChangeText={(value: string)=>{setNewExercise({...newExercise, Title: value})}} autoFocus={exercise.Title.trim() === ''}/>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.innertextcolorfade}
                placeholder="Series"
                defaultValue={exercise.Series.toString()}
                keyboardType="numeric" 
                onChangeText={(value: string)=>{
                  const numericValue = value.replace(/[^0-9]/g, '');
                  const quantity = numericValue !== '' ? parseInt(numericValue, 10) : 1;
                  setNewExercise({...newExercise, Series: quantity})}}
                onSubmitEditing={doneEdit}/>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.innertextcolorfade}
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
                placeholderTextColor={o.innertextcolorfade}
                placeholder="Max"
                defaultValue={exercise.MaxWeight}
                onChangeText={(value: string)=>{setNewExercise({...newExercise, MaxWeight: value})}}
                onSubmitEditing={doneEdit}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.innertextcolorfade}
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
              <View style={s.exerciseImageContainer}>
                {getBodyImage('chest')}
                {getBodyImage('triceps')}
                {getBodyImage('shoulderfront')}
                {getBodyImage('anteriorforearm')}
                {getBodyImage('trapezius')}
                {getBodyImage('biceps')}
                {getBodyImage('posteriorforearm')}
                {getBodyImage('shoulderback')}
                {getBodyImage('backoutside')}
                {getBodyImage('topback')}
                {getBodyImage('abs')}
                {getBodyImage('pectorals')}
                {getBodyImage('lower')}
                {getBodyImage('obliques')}
                {getBodyImage('externalobliques')}
                {getBodyImage('hamstrings')}
                {getBodyImage('frontthigh')}
                {getBodyImage('quadriceps')}
                {getBodyImage('innerthigh')}
                {getBodyImage('outerthigh')}
                {getBodyImage('glutes')}
                {getBodyImage('lumbar')}
                {getBodyImage('calves')}
                {getBodyImage('rectusabdominis')}
                {getBodyImage('cardio')}
                {getBodyImage('warmup')}
                {getBodyImage('stretching')}
                {getBodyImage('cancel')}
              </View>
            </View>  
            <View style={s.inputsRight}>
              <PressImage color={o.doneicontint} source={Images.Done} onPress={doneEdit}/>
              <View style={gs.baseImageContainer}></View>
              <PressImage color={o.cancelicontint} source={Images.Cancel} onPress={onCancelExercise}/>
            </View>
          </View>
          :
          getTitleDisplay()
        }
        {!isEditingExercise && !exercise.IsDone && <PressImage cT={o} source={Images.Exercise} onPress={() => {if(!isDisabled)onChangeIsDone();}}/>}
        {!isEditingExercise && exercise.IsDone && <PressImage cT={o} source={Images.ExerciseFilled} onPress={() => {if(!isDisabled)onChangeIsDone();}} fade={exercise.IsDone}/>}
      </View>
    </View>
  );
};

export default ExerciseView;