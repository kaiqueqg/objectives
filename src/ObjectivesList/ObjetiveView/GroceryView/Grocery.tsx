import { View, StyleSheet, Text, Vibration, TextInput, Keyboard, BackHandler } from "react-native";
import { Grocery, Item, Pattern, ItemViewProps } from "../../../Types";
import { colorPalette, globalStyle as gs } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import PressImage from "../../../PressImage/PressImage";
import { useEffect, useState } from "react";
import PressText from "../../../PressText/PressText";

export const New = () => {
  return(
    {
      Title: '',
      IsChecked: false,
      Quantity: 1,
      Unit: '',
      GoodPrice: '',
    }
  )
}

export interface GroceryViewProps extends ItemViewProps {
  grocery: Grocery,
}

const GroceryView = (props: GroceryViewProps) => {
  const { userPrefs, theme: t, fontTheme: f, putItem } = useUserContext();
  const { objTheme: o, wasJustAdded, isSelected, isSelecting, isDisabled, onDeleteItem, loadMyItems, grocery } = props;

  const [isEditingGrocery, setIsEditingGrocery] = useState<boolean>(false);
  const [tempGrocery, setTempGrocery] = useState<Grocery>(props.grocery);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
      
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
    const hide = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

    const backAction = () => {
      if (keyboardVisible) {
        Keyboard.dismiss();
        return true;
      }
      
      onCancelGrocery();
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
    setTempGrocery(props.grocery);
  }, [grocery])

  const onDelete = async () => {
    await onDeleteItem(grocery);
  }

  const onDoneGrocery = async () => {
    let newGrocery = {...tempGrocery};
    newGrocery.Title = newGrocery.Title.trim();
    newGrocery.GoodPrice = newGrocery.GoodPrice?.trim();
    newGrocery.Unit = newGrocery.Unit?.trim();
    await putItem(newGrocery);
    setIsEditingGrocery(false);
    loadMyItems();
  }

  const onCancelGrocery = async () => {
    setIsEditingGrocery(false);
  }

  const onChangeIsChecked = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    const newGrocery = {...grocery, IsChecked: !grocery.IsChecked};
    await putItem(newGrocery);
    loadMyItems();
  }

  const getText = () => {
    let rtn = '';
    if(grocery.Quantity && grocery.Quantity > 1) rtn += grocery.Quantity.toString()+' x ';
    rtn += grocery.Title;
    if(grocery.GoodPrice){
      rtn += ' (' + grocery.GoodPrice;

      if(grocery.Unit) rtn += ' - ' + grocery.Unit;
      rtn += ')';
    }

    return rtn;
  }

  const onEditingGrocery = () => {
    if(props.isLocked) {
      Vibration.vibrate(Pattern.Wrong);
      return;
    }

    if(!isDisabled){
      props.itemsListScrollTo(grocery.ItemId);
      setIsEditingGrocery(!isEditingGrocery);
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
    groceryContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: (grocery.IsChecked && !isEditingGrocery)? o.objbk:o.itembk,
      
      borderColor: (grocery.IsChecked && !isEditingGrocery)?colorPalette.transparent:o.bordercolor,
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
    groceryDoneImage:{
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
      <View style={[s.groceryContainer, isSelecting && s.containerSelecting, isSelected && s.containerSelected]}>
        {!isDisabled && isEditingGrocery?
          <View style={s.inputsContainer}>
            <View style={s.inputsLeft}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDelete]} confirm={true} source={require('../../../../public/images/trash.png')} onPress={onDelete}></PressImage>
            </View>
            <View style={s.inputsCenter}>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Title"
                defaultValue={grocery.Title}
                onChangeText={(value: string)=>{setTempGrocery({...tempGrocery, Title: value})}} 
                onSubmitEditing={onDoneGrocery}
                autoFocus={grocery.Title.trim() === ''}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholder="Quantity"
                placeholderTextColor={o.itemtextfade}
                defaultValue={grocery.Quantity?.toString()}
                keyboardType="numeric" 
                onChangeText={(value: string)=>{
                  const numericValue = value.replace(/[^0-9]/g, '');
                  const quantity = numericValue !== '' ? parseInt(numericValue, 10) : 1;
                  setTempGrocery({...tempGrocery, Quantity: quantity})}}
                  onSubmitEditing={onDoneGrocery}></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Good price"
                defaultValue={grocery.GoodPrice}
                onChangeText={(value: string)=>{setTempGrocery({...tempGrocery, GoodPrice: value})}}
                onSubmitEditing={onDoneGrocery}></TextInput>
              <TextInput
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Unit"
                defaultValue={grocery.Unit}
                onChangeText={(value: string)=>{setTempGrocery({...tempGrocery, Unit: value})}}
                onSubmitEditing={onDoneGrocery}></TextInput>
            </View>
            <View style={s.inputsRight}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDone]} source={require('../../../../public/images/done.png')} onPress={onDoneGrocery}></PressImage>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageCancel]} source={require('../../../../public/images/cancel.png')} onPress={onCancelGrocery}></PressImage>
            </View>
          </View>
          :
          <PressText
            style={s.titleContainer}
            textStyle={grocery.IsChecked? s.titleFade:s.title}
            text={getText()}
            onPress={()=>{onEditingGrocery()}}
            defaultStyle={o}
            ></PressText>
        }
        {!isEditingGrocery && !grocery.IsChecked && <PressImage pressStyle={gs.baseImageContainer} style={s.image} source={require('../../../../public/images/grocery.png')} onPress={() => {if(!isDisabled)onChangeIsChecked();}}></PressImage>}
        {!isEditingGrocery && grocery.IsChecked && <PressImage pressStyle={gs.baseImageContainer} style={s.imageFade} source={require('../../../../public/images/grocery-filled.png')} onPress={() => {if(!isDisabled)onChangeIsChecked();}}></PressImage>}
      </View>
    </View>
  );
};

export default GroceryView;