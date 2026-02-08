import { View, StyleSheet, Text, Vibration, TextInput, BackHandler, Keyboard } from "react-native";
import { Review, Pattern, ItemViewProps } from "../../../Types";
import { colorPalette, globalStyle as gs } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import PressImage from "../../../PressImage/PressImage";
import { useEffect, useState } from "react";
import PressText from "../../../PressText/PressText";
import React from "react";
import { useLogContext } from "../../../Contexts/LogContext";

export const New = () => {
  return(
    {
        Rating: '',
        Description: '',
        IsCurrentChoise: false,
    }
  )
}

export interface ReviewViewProps extends ItemViewProps {
  review: Review,
}

export const ReviewView = (props: ReviewViewProps) => {
  const { userPrefs, theme: t, fontTheme: f, putItem } = useUserContext();
  const { log } = useLogContext();
  const { objTheme: o, wasJustAdded, isSelected, isSelecting, isDisabled, onDeleteItem, loadMyItems, review } = props;

  const [isEditingReview, setIsEditingReview] = useState<boolean>(false);
  const [tempReview, setTempReview] = useState<Review>(props.review);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
    const hide = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

    const backAction = () => {
      if (keyboardVisible) {
        Keyboard.dismiss();
        return true;
      }
      
      onCancelReview();
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
    setTempReview(props.review);
  }, [review])

  const onDelete = async () => {
    await onDeleteItem(review);
  }

  const onDoneReview = async () => {
    let newReview = {...tempReview};
    newReview.Title = newReview.Title.trim();
    await putItem(newReview);
    setIsEditingReview(false);
    loadMyItems();
  }

  const onCancelReview = async () => {
    setIsEditingReview(false);
  }

  const onChangeIsChecked = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    const newReview = {...review, IsCurrentChoise: !review.IsCurrentChoise};
    await putItem(newReview);
    loadMyItems();
  }

  const getText = () => {
    return review.Title;
  }

  const onEditingReview = () => {
    if(props.isLocked) {
      Vibration.vibrate(Pattern.Wrong);
      return;
    }

    if(!isDisabled){
      props.itemsListScrollTo(review.ItemId);
      setIsEditingReview(!isEditingReview);
    }
  }

  const getDisplayView = () => {
    return(
      <View style={s.reviewDisplayContainer}>
        <View style={s.displayTopLine}>
          {review.Rating.trim() !== '' && 
          <Text style={s.reviewRatingText}>
            {review.Rating}
          </Text>}
          <PressText
            style={s.titleContainer}
            textStyle={review.IsCurrentChoise? s.title:s.titleFade}
            text={getText()}
            onPress={()=>{onEditingReview()}}
            defaultStyle={o}
          ></PressText>
        </View>
        {review.Description.trim() !== '' &&
        <Text style={s.reviewDescriptionText}>
          {review.Description}
        </Text>}
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
    reviewContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: (!review.IsCurrentChoise && !isEditingReview)? colorPalette.transparent:o.itembk,
      
      borderColor: (!review.IsCurrentChoise && !isEditingReview)?colorPalette.transparent:o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: o.borderRadius,
    },
    reviewDisplayContainer:{
      flex: 1,
      flexDirection: 'column',
    },
    titleContainer:{
      flex: 1,
      justifyContent: 'center',

      minHeight: 40,
      margin: 2,
      paddingLeft: 10,
      color: review.IsCurrentChoise?o.itemtext:o.itemtextfade,
    },
    title:{
      color: o.itemtext,
    },
    titleFade:{
      color: o.itemtextfade,
    },
    reviewRatingText:{
      verticalAlign: 'middle',
      textAlign: "center",

      fontSize: 10,
      color: review.IsCurrentChoise?o.itemtext:o.itemtextfade,
      flexDirection: 'row',
      paddingHorizontal: 5,
      marginVertical: 10,
      marginHorizontal: 5,

      backgroundColor: o.itembkdark,

      borderColor: o.bordercolor,
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
    },
    displayTopLine:{
      flex: 1,
      flexDirection: "row",
    },
    reviewDescriptionText:{
      flex: 1,
      width: '100%',
      color: o.itemtext,
      paddingBottom: 5,
      paddingHorizontal: 10,
    },
    reviewDoneImage:{
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
  });

  return (
    <View style={[s.container]}>
      <View style={[s.reviewContainer, isSelecting && s.containerSelecting, isSelected && s.containerSelected, wasJustAdded && s.containerWasJustAdded]}>
        {!isDisabled && isEditingReview?
          <View style={s.inputsContainer}>
            <View style={s.inputsLeft}>
              <PressImage confirm={true} source={require('../../../../public/images/trash.png')} onPress={onDelete} color={o.trashicontint}></PressImage>
            </View>
            <View style={s.inputsCenter}>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Title"
                defaultValue={review.Title}
                onChangeText={(value: string)=>{setTempReview({...tempReview, Title: value})}} autoFocus
                onSubmitEditing={onDoneReview}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Rating"
                defaultValue={review.Rating}
                onChangeText={(value: string)=>{setTempReview({...tempReview, Rating: value})}}
                onSubmitEditing={onDoneReview}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Description"
                defaultValue={review.Description}
                onChangeText={(value: string)=>{setTempReview({...tempReview, Description: value})}}
                onSubmitEditing={onDoneReview}></TextInput>
            </View>
            <View style={s.inputsRight}>
              <PressImage source={require('../../../../public/images/done.png')} onPress={onDoneReview} color={o.doneicontint}></PressImage>
              <PressImage source={require('../../../../public/images/cancel.png')} onPress={onCancelReview} color={o.cancelicontint}></PressImage>
            </View>
          </View>
          :
          getDisplayView()
        }
        {!isEditingReview  && <PressImage source={require('../../../../public/images/review.png')} onPress={() => {if(!isDisabled)onChangeIsChecked();}} selected={!review.IsCurrentChoise} colorSelected={t.icontintfade}/>}
      </View>
    </View>
  );
};