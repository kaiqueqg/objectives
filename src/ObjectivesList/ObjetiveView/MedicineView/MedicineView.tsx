import { View, StyleSheet, Text, Vibration, TextInput, BackHandler, Keyboard } from "react-native";
import { Medicine, Pattern, ItemViewProps } from "../../../Types";
import { colorPalette, globalStyle as gs } from "../../../Colors";
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
  const { log } = useLogContext();
  const { objTheme: o, wasJustAdded, isSelected, isSelecting, isDisabled, onDeleteItem, loadMyItems, medicine } = props;

  const [isEditingMedicine, setIsEditingMedicine] = useState<boolean>(false);
  const [tempMedicine, setTempMedicine] = useState<Medicine>(props.medicine);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
    const hide = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

    const backAction = () => {
      if (keyboardVisible) {
        Keyboard.dismiss();
        return true;
      }
      
      onCancelMedicine();
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

  const onEditingMedicine = () => {
    if(props.isLocked) {
      Vibration.vibrate(Pattern.Wrong);
      return;
    }

    if(!isDisabled){
      props.itemsListScrollTo(medicine.ItemId);
      setIsEditingMedicine(!isEditingMedicine);
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
    medicineContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: (medicine.IsChecked && !isEditingMedicine)? colorPalette.transparent:o.innerbackgroundcolor,
      
      borderColor: (medicine.IsChecked && !isEditingMedicine)?colorPalette.transparent:o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: o.borderRadius,
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
      color: o.innertextcolor,
    },
    titleFade:{
      color: o.innertextcolorfade,
    },
    image:{
      ...gs.baseImage,
      tintColor: o.icontint,
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
      tintColor: o.innertextcolorfade,
    },
    imageMove:{
      ...gs.baseImage,
      tintColor: o.icontint,
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
      color: o.innertextcolor,

      borderRadius: 5,
      borderColor: o.icontint,
      borderBottomWidth: 1,
      borderStyle: 'solid',
    },
  });

  return (
    <View style={[s.container]}>
      <View style={[s.medicineContainer, isSelecting && s.containerSelecting, isSelected && s.containerSelected, wasJustAdded && s.containerWasJustAdded]}>
        {!isDisabled && isEditingMedicine?
          <View style={s.inputsContainer}>
            <View style={s.inputsLeft}>
              <PressImage confirm={true} source={Images.Trash} onPress={onDelete} color={o.trashicontint}/>
            </View>
            <View style={s.inputsCenter}>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.innertextcolorfade}
                placeholder="Title"
                defaultValue={medicine.Title}
                onChangeText={(value: string)=>{setTempMedicine({...tempMedicine, Title: value})}} autoFocus
                onSubmitEditing={onDoneMedicine}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.innertextcolorfade}
                placeholder="Quatity"
                defaultValue={medicine.Quantity?.toString()}
                keyboardType="numeric" 
                onChangeText={(value: string)=>{
                  const numericValue = value.replace(/[^0-9]/g, '');
                  const quantity = numericValue !== '' ? parseInt(numericValue, 10) : 1;
                  setTempMedicine({...tempMedicine, Quantity: quantity})}}
                onSubmitEditing={onDoneMedicine}></TextInput>
              <TextInput
                style={s.inputStyle}
                placeholderTextColor={o.innertextcolorfade}
                placeholder="Unit"
                defaultValue={medicine.Unit}
                onChangeText={(value: string)=>{setTempMedicine({...tempMedicine, Unit: value})}}
                onSubmitEditing={onDoneMedicine}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.innertextcolorfade}
                placeholder="Purpose"
                defaultValue={medicine.Purpose}
                onChangeText={(value: string)=>{setTempMedicine({...tempMedicine, Purpose: value})}}
                onSubmitEditing={onDoneMedicine}></TextInput>
            </View>
            <View style={s.inputsRight}>
              <PressImage source={Images.Done} onPress={onDoneMedicine} color={o.doneicontint}/>
              <PressImage source={Images.Cancel} onPress={onCancelMedicine} color={o.cancelicontint}/>
            </View>
          </View>
          :
          <PressText
            style={s.titleContainer}
            textStyle={medicine.IsChecked? s.titleFade:s.title}
            text={getText()}
            onPress={()=>{onEditingMedicine()}}
            defaultStyle={o}
            ></PressText>
        }
        {!isEditingMedicine && !medicine.IsChecked && <PressImage cT={o} source={Images.Medicine} onPress={() => {if(!isDisabled)onChangeIsChecked();}}/>}
        {!isEditingMedicine && medicine.IsChecked && <PressImage cT={o} source={Images.MedicineFilled} onPress={() => {if(!isDisabled)onChangeIsChecked();}} fade={medicine.IsChecked}/>}
      </View>
    </View>
  );
};

export default MedicineView;