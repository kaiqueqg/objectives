import { View, StyleSheet, Text, Vibration, TextInput } from "react-native";
import { Medicine, Pattern, ItemViewProps } from "../../../Types";
import { colorPalette, ObjectivePallete, ThemePalette } from "../../../Colors";
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
      Purpose: '',
      IsChecked: false,
      Quantity: 0,
      Unit: '',
      Components: [],
    }
  )
}

export interface MedicineViewProps extends ItemViewProps {
  medicine: Medicine,
}

const MedicineView = (props: MedicineViewProps) => {
  const { userPrefs, theme: t, fontTheme: f, putItem } = useUserContext();
  const { objTheme: o, isEditingPos, onDeleteItem, loadMyItems, medicine } = props;

  const [isEditingMedicine, setIsEditingMedicine] = useState<boolean>(false);
  const [tempMedicine, setTempMedicine] = useState<Medicine>(props.medicine);

  useEffect(()=>{
    setTempMedicine(props.medicine);
  }, [medicine])

  const onDelete = async () => {
    await onDeleteItem(medicine);
  }

  const onDoneMedicine = async () => {
    let newMedicine = {...tempMedicine};
    newMedicine.Title = newMedicine.Title.trim();
    newMedicine.Purpose = newMedicine.Purpose?.trim();
    newMedicine.Unit = newMedicine.Unit?.trim();
    await putItem(newMedicine);
    setIsEditingMedicine(false);
    loadMyItems();
  }

  const onCancelMedicine = async () => {
    setIsEditingMedicine(false);
  }

  const onChangeIsChecked = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    const newMedicine = {...medicine, IsChecked: !medicine.IsChecked};
    await putItem(newMedicine);
    loadMyItems();
  }

  const getText = () => {
    let rtn = '';
    if(medicine.Quantity && medicine.Quantity > 1) rtn += medicine.Quantity.toString()+' x ';
    rtn += medicine.Title;
    if(medicine.Purpose){ rtn += ' (' + medicine.Purpose + ')' }
    // if(medicine.GoodPrice){
    //   rtn += ' (' + medicine.GoodPrice;

    //   if(medicine.Unit) rtn += ' - ' + medicine.Unit;
    //   rtn += ')';
    // }

    return rtn;
  }

  const s = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
      marginHorizontal: 6,
      minHeight: 40,
    },
    medicineContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: medicine.IsChecked? o.objbk:o.itembk,
      
      borderRadius: 5,
      borderColor: medicine.IsChecked?colorPalette.transparent:o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    medicineContainerSelected:{
      borderStyle: 'dashed',
      borderColor: o.bordercolorselected,
    },
    medicineContainerEnding:{
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
    imageContainer:{
      height: 40,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image:{
      height: 24,
      width: 24,
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
      height: 24,
      width: 24,
      tintColor: o.itemtextfade,
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
    medicineDoneImage:{
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
      borderColor: o.bordercolor,
      borderBottomWidth: 1,
      borderStyle: 'solid',
    },
  });

  return (
    <View style={s.container}>
      <View style={[s.medicineContainer, props.isSelected && s.medicineContainerSelected, props.isSelected && props.isEndingPos && s.medicineContainerEnding]}>
        {!isEditingPos && isEditingMedicine?
          <View style={s.inputsContainer}>
            <View style={s.inputsLeft}>
              <PressImage pressStyle={s.imageContainer} style={[s.image, s.imageDelete]} confirm={true} source={require('../../../../public/images/trash.png')} onPress={onDelete}></PressImage>
            </View>
            <View style={s.inputsCenter}>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Title"
                defaultValue={medicine.Title}
                onChangeText={(value: string)=>{setTempMedicine({...tempMedicine, Title: value})}}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Quatity"
                defaultValue={medicine.Quantity?.toString()}
                keyboardType="numeric" 
                onChangeText={(value: string)=>{
                  const numericValue = value.replace(/[^0-9]/g, '');
                  const quantity = numericValue !== '' ? parseInt(numericValue, 10) : 1;
                  setTempMedicine({...tempMedicine, Quantity: quantity})}}></TextInput>
              <TextInput
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Unit"
                defaultValue={medicine.Unit}
                onChangeText={(value: string)=>{setTempMedicine({...tempMedicine, Unit: value})}}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Purpose"
                defaultValue={medicine.Purpose}
                onChangeText={(value: string)=>{setTempMedicine({...tempMedicine, Purpose: value})}}></TextInput>
            </View>
            <View style={s.inputsRight}>
              <PressImage pressStyle={s.imageContainer} style={[s.image, s.imageDone]} source={require('../../../../public/images/done.png')} onPress={onDoneMedicine}></PressImage>
              <PressImage pressStyle={s.imageContainer} style={[s.image, s.imageCancel]} source={require('../../../../public/images/cancel.png')} onPress={onCancelMedicine}></PressImage>
            </View>
          </View>
          :
          <>
            <PressText
              style={s.titleContainer}
              textStyle={medicine.IsChecked? s.titleFade:s.title}
              text={getText()}
              onPress={()=>{if(!isEditingPos)setIsEditingMedicine(!isEditingMedicine)}}
              ></PressText>
          </>
        }
        {!isEditingMedicine && !medicine.IsChecked && <PressImage pressStyle={s.imageContainer} style={s.image} source={require('../../../../public/images/medicine.png')} onPress={() => {if(!isEditingPos)onChangeIsChecked();}}></PressImage>}
        {!isEditingMedicine && medicine.IsChecked && <PressImage pressStyle={s.imageContainer} style={s.imageFade} source={require('../../../../public/images/medicine-filled.png')} onPress={() => {if(!isEditingPos)onChangeIsChecked();}}></PressImage>}
      </View>
    </View>
  );
};

export default MedicineView;