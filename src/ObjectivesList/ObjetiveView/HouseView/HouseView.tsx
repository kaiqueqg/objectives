import { View, StyleSheet, Text, Vibration, TextInput, Linking } from "react-native";
import { House, Pattern, ItemViewProps, MessageType } from "../../../Types";
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
      Title: '',
      Listing: '',
      MapLink: '',
      MeterSquare: '',
      Rating: 0,
      Address: '',
      TotalPrice: 0,
      WasContacted: false,
      Details: '',
      Attention: '',
    }
  )
}

export interface HouseViewProps extends ItemViewProps {
  house: House,
}

export const HouseView = (props: HouseViewProps) => {
  const { userPrefs, theme: t, fontTheme: f, putItem } = useUserContext();
  const { log, popMessage } = useLogContext();
  const { objTheme: o, isEditingPos, onDeleteItem, loadMyItems, house } = props;

  const [isEditingHouse, setIsEditingHouse] = useState<boolean>(false);
  const [tempHouse, setTempHouse] = useState<House>(props.house);

  useEffect(()=>{
    setTempHouse(props.house);
  }, [house])

  const onDelete = async () => {
    await onDeleteItem(house);
  }

  const onDoneHouse = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    let newHouse = {...tempHouse, LastModified: new Date().toISOString()};
    if(newHouse.Title != house.Title.trim() || 
      newHouse.Listing != house.Listing.trim() ||
      newHouse.MapLink != house.MapLink.trim() ||
      newHouse.MeterSquare != house.MeterSquare.trim() ||
      newHouse.Address != house.Address.trim() ||
      newHouse.Details != house.Details.trim() ||
      newHouse.Attention != house.Attention.trim())
    {
      await putItem(newHouse);
      loadMyItems();
    }

    setIsEditingHouse(false);
  }

  const onCancelHouse = async () => {
    setIsEditingHouse(false);
  }

  const onChangeWasContacted = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    const newHouse = {...house, WasContacted: !house.WasContacted};
    await putItem(newHouse);
    loadMyItems();
  }

  const onChangeIsEditing = () => {
    if(!isEditingPos)setIsEditingHouse(!isEditingHouse);
  }

  const openLink = () => {
    if (house.Listing) {
      Linking.canOpenURL(house.Listing)
        .then((supported) => {
          if (supported) {
            Linking.openURL(house.Listing);
          } else {
            popMessage('Cannot open this URL', MessageType.Error);
          }
        })
        .catch((err) => {});
    }
  }

  const openUrl = async () => {
    if(house.MapLink && house.MapLink.trim()) {
      Linking.openURL(house.MapLink).catch(err => popMessage('Error opening Google Maps:', MessageType.Error, 5));
    }
  };

  const getText = () => {
    let rtn:string = '';

    if(house.Address.trim()!=='') rtn += house.Address.trim() + ' ';
    if(house.Rating !== 0) rtn += house.Rating + ' ';
    if(house.MeterSquare.trim()!=='') rtn += house.MeterSquare.trim() + 'm² ';
    if(house.TotalPrice !== 0) rtn += '$' + house.TotalPrice;

    return rtn;
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
    houseContainer:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: house.WasContacted? o.objbk:o.itembk,
      
      borderColor: house.WasContacted?colorPalette.transparent:o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: o.borderRadius,
    },
    houseContainerSelected:{
      borderStyle: 'dashed',
      borderColor: o.bordercolorselected,
    },
    houseContainerEnding:{
      borderStyle: 'solid',
      borderColor: o.bordercolorselected,
    },
    displayContainer:{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    displayTitleContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
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
    detailsContainer:{
      padding: 10,
    },
    attentionContainer:{
      padding: 10,
    },
    detaisText:{
      color: o.itemtext,
    },
    attentionText:{
      color: colorPalette.red,
      fontWeight: 'bold',
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
      tintColor: o.itemtextfade,
    },
    imageMove:{
      ...gs.baseImage,
      tintColor: o.icontintcolor,
    },
    houseDoneImage:{
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
    <View style={s.container}>
      <View style={[s.houseContainer, props.isSelected && s.houseContainerSelected, props.isSelected && props.isEndingPos && s.houseContainerEnding]}>
        {!isEditingPos && isEditingHouse ?
          <View style={s.inputsContainer}>
            <View style={s.inputsLeft}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDelete]} confirm={true} source={require('../../../../public/images/trash.png')} onPress={onDelete}></PressImage>
            </View>
            <View style={s.inputsCenter}>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Title"
                defaultValue={house.Title}
                onChangeText={(value: string)=>{setTempHouse({...tempHouse, Title: value})}}
                autoFocus></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Listing"
                defaultValue={house.Listing}
                onChangeText={(value: string)=>{setTempHouse({...tempHouse, Listing: value})}}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="MapLink"
                defaultValue={house.MapLink}
                onChangeText={(value: string)=>{setTempHouse({...tempHouse, MapLink: value})}}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="m²"
                defaultValue={house.MeterSquare}
                onChangeText={(value: string)=>{setTempHouse({...tempHouse, MeterSquare: value})}}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Rating"
                defaultValue={house.Rating?.toString()}
                keyboardType="numeric" 
                onChangeText={(value: string)=>{
                  const numericValue = value.replace(/[^0-9]/g, '');
                  const Rating = numericValue !== '' ? parseInt(numericValue, 10) : 1;
                  setTempHouse({...tempHouse, Rating: Rating})}}></TextInput>
              <TextInput
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Address"
                defaultValue={house.Address}
                onChangeText={(value: string)=>{setTempHouse({...tempHouse, Address: value})}}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Details"
                defaultValue={house.Details}
                onChangeText={(value: string)=>{setTempHouse({...tempHouse, Details: value})}}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Attention"
                defaultValue={house.Attention}
                onChangeText={(value: string)=>{setTempHouse({...tempHouse, Attention: value})}}></TextInput>
            </View>
            <View style={s.inputsRight}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDone]} source={require('../../../../public/images/done.png')} onPress={onDoneHouse}></PressImage>
              <View style={gs.baseImageContainer}></View>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageCancel]} source={require('../../../../public/images/cancel.png')} onPress={onCancelHouse}></PressImage>
            </View>
          </View>
          :
          <View style={s.displayContainer}>
            <View style={s.displayTitleContainer}>
              <PressText
                style={s.titleContainer}
                textStyle={house.WasContacted? s.titleFade:s.title}
                text={house.Title}
                onPress={onChangeIsEditing}
              ></PressText>
              <PressText textStyle={{color: o.itemtext}} style={s.attentionContainer} onPress={onChangeIsEditing} text={getText()}></PressText>
              {!isEditingHouse && house.Listing.trim() !== '' && <PressImage pressStyle={gs.baseImageContainer} style={s.image} source={require('../../../../public/images/link.png')} onPress={openLink}></PressImage>}
              {!isEditingHouse && house.MapLink.trim() !== '' && <PressImage pressStyle={gs.baseImageContainer} style={s.image} source={require('../../../../public/images/location-filled.png')} onPress={openUrl}></PressImage>}
              {!isEditingHouse && !house.WasContacted && <PressImage pressStyle={gs.baseImageContainer} style={s.image} source={require('../../../../public/images/home.png')} onPress={() => {if(!isEditingPos)onChangeWasContacted();}}></PressImage>}
              {!isEditingHouse && house.WasContacted && <PressImage pressStyle={gs.baseImageContainer} style={s.imageFade} source={require('../../../../public/images/done.png')} onPress={() => {if(!isEditingPos)onChangeWasContacted();}}></PressImage>}
            </View>
            {!isEditingHouse && house.Details.trim() !== '' && <View style={s.detailsContainer}><Text style={s.detaisText}>{house.Details}</Text></View>}
            {!isEditingHouse && house.Attention.trim() !== '' && <View style={s.attentionContainer}><Text style={s.attentionText}>{house.Attention}</Text></View>}
          </View>
        }
      </View>
    </View>
  );
};