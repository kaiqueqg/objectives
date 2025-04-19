import { Text, TextInput, View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import PressImage from "../PressImage/PressImage";
import { useUserContext } from "../Contexts/UserContext";
import { ObjectivePallete, globalStyle as gs } from "../Colors";
import { FontPalette } from "../../fonts/Font";
import React from "react";

export interface PressInputProps {
  onDone: (newText: string) => void,

  onDelete?: () => void,
  confirmDelete?: boolean,

  uneditable?: boolean,
  onEditingState?: (editingState: boolean) => void,
  text: string,
  defaultText?: string,
  objTheme: ObjectivePallete,

  containerStyle?: any,
  inputContainerStyle?: any,
  inputStyle? :any,
  imageContainerStyle?: any,
  trashImageStyle?: any,
  doneImageStyle?: any,
  cancelImageStyle?: any,
  textStyle?: any,
  defaultStyle?: any,

  multiline?: boolean,
}

const PressInput = (props: PressInputProps) => {
  const { theme: t, fontTheme: f } = useUserContext();
  const { objTheme: o } = props;

  const [newText, setNewText] = useState<string>(props.text);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputHeight, setInputHeight] = useState<number>(30);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  useEffect(()=>{
    setNewText(props.text);
  }, [props.text])

  const changeEditing = (newState: boolean) => {
    setIsEditing(newState) ;
    if(props.onEditingState) props.onEditingState(newState);
  };

  const handleChangeText = (value: string) => {
    setNewText(value);
  };
  
  const onDone = () => {
    setIsDeleting(false);
    changeEditing(false);
    props.onDone(newText);
    setNewText(props.text);
  }

  const onCancel = () => {
    setNewText(props.text);
    setIsDeleting(false);
    changeEditing(false);
  }

  const onDelete = () => {
    if(props.onDelete){
      if(props.confirmDelete){
        setIsDeleting(true);
        setTimeout(()=>{setIsDeleting(false)}, 2000);
      }else{
        props.onDelete();
      }
    }
  }

  const onChange = (event: any) => {
    setInputHeight(event.nativeEvent.contentSize.height);
  }

  const s = StyleSheet.create({
    container:{
      flex: 1,
      padding: 5,
    },
    inputContainer:{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 30,
    },
    imagePress:{
      maxHeight: 30,
      maxWidth: 30,
      marginHorizontal: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    trashImage:{
      ...gs.baseImage,
      tintColor: o.trashicontint,
    },
    cancelImage:{
      ...gs.baseImage,
      tintColor: o.cancelicontint,
    },
    doneImage:{
      ...gs.baseImage,
      tintColor: o.doneicontint,
    },
    input:{
      flex: 1,
      color: t.backgroundcolordarker,
      borderRadius: 2,
      marginHorizontal: 5,
      padding: 5,

      borderColor: t.backgroundcolordarker,
      borderBottomWidth: 1,
      borderStyle: 'solid',
    },
    text:{
      color: o.objtitle,
      marginLeft: 5,
    },
    defaultText:{
      color: t.textcolorfade,
      marginLeft: 5,
    },
  });

  return (
    <View 
      style={[s.container, props.containerStyle??undefined]}>
      {isEditing?
        <View style={[s.inputContainer, props.inputContainerStyle]}>
          {isDeleting && props.onDelete && <PressImage pressStyle={[s.imagePress, props.containerStyle]} style={[s.trashImage, props.trashImageStyle]} onPress={props.onDelete} source={require('../../public/images/done.png')}></PressImage>}
          {!isDeleting && props.onDelete && <PressImage pressStyle={[s.imagePress, props.containerStyle]} style={[s.trashImage, props.trashImageStyle]} onPress={onDelete} source={require('../../public/images/trash.png')}></PressImage>}
          {!props.onDelete && <PressImage pressStyle={[s.imagePress, props.containerStyle]} style={[s.cancelImage, props.cancelImageStyle]} onPress={onCancel} source={require('../../public/images/cancel.png')}></PressImage>}
          <TextInput 
            style={[s.input, props.inputStyle, {height: inputHeight}]} 
            multiline={props.multiline?? false} 
            autoFocus={true}
            value={newText}
            onSubmitEditing={onDone} 
            onChangeText={handleChangeText}
            onContentSizeChange={onChange}
            selectionColor={t.textcolor}
            >
          </TextInput>
          {props.onDelete && <PressImage pressStyle={[s.imagePress, props.containerStyle]} style={[s.cancelImage, props.cancelImageStyle]} onPress={onCancel} source={require('../../public/images/cancel.png')}></PressImage>}
          <PressImage pressStyle={[s.imagePress, props.containerStyle]} style={[s.doneImage, props.doneImageStyle]} onPress={onDone} source={require('../../public/images/done.png')}></PressImage>
        </View>
        :
        <>
          {props.text === '' ?
            <Text style={[s.defaultText, props.defaultStyle]} onPress={()=>{if(!props.uneditable)changeEditing(true);}}>{props.defaultText}</Text>
            :
            <Text style={[s.text, props.textStyle]} onPress={()=>{if(!props.uneditable)changeEditing(true);}}>{props.text}</Text>
          }
        </>
      }
    </View>
  );
};

export default PressInput;
