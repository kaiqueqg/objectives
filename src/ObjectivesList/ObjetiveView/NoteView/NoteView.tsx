import { View, StyleSheet, Vibration, Keyboard, BackHandler, TextInput } from "react-native";
import { colorPalette, globalStyle as gs } from "../../../Colors";
import { useUserContext } from "../../../Contexts/UserContext";
import { Note, ItemViewProps, Pattern } from "../../../Types";
import PressImage from "../../../PressImage/PressImage";
import PressInput from "../../../PressInput/PressInput";
import { useEffect, useState } from "react";
import { useLogContext } from "../../../Contexts/LogContext";
import PressText from "../../../PressText/PressText";

export const New = () => {
  return(
    {
      Text: '',
    }
  )
}

export interface NoteViewProps extends ItemViewProps {
  note: Note,
}

const NoteView = (props: NoteViewProps) => {
  const { userPrefs, theme: t, fontTheme: f, putItem } = useUserContext();
  const { log } = useLogContext();
  const { objTheme: o, wasJustAdded, isSelected, isSelecting, isDisabled, onDeleteItem, loadMyItems, note } = props;

  const [newNote, setNewNote] = useState<Note>(note);
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
    const hide = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

    const backAction = () => {
      if (keyboardVisible) {
        Keyboard.dismiss();
        return true;
      }
      
      onEditingTitle(false);
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

  const onDelete = async () => {
    await onDeleteItem(note);
  }
  
  const doneEdit = async () => {
    const newItem: Note = {...newNote, LastModified: new Date().toISOString()};

    if(newItem.Title !== note.Title || 
      newItem.Text !== note.Text){

      await putItem(newItem);
      setIsEditingNote(false);
      loadMyItems();
    }
    else{
      setIsEditingNote(false);
    }
  }

  const onCancelNote = async () => {
    setIsEditingNote(false);
  }

  const onEditingTitle = async (editingState: boolean) => {
    if(editingState) props.itemsListScrollTo(note.ItemId)
    setIsEditingNote(editingState);
  }

  const s = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: o.marginHorizontal,
      marginVertical: o.marginVertical,
      minHeight: 45,
    },
    containerSelecting:{
      borderStyle: 'solid',
      borderColor: o.bordercolorselecting,
    },
    containerSelected:{
      borderStyle: 'dashed',
      borderColor: o.bordercolorselected,
    },
    noteContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 10,
      backgroundColor: (note.Text.trim() !== '' && !isEditingNote)?colorPalette.transparent:o.itembk,
      
      borderColor: (note.Text.trim() !== '' && !isEditingNote)?colorPalette.transparent:o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: o.borderRadius,
    },
    displayContainer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      verticalAlign: 'middle',
      flexDirection: 'column',

      // paddingVertical: 5,
      // paddingHorizontal: 2,

      // borderColor: 'red',
      // borderWidth: 1,
      // borderRadius: 5,
      // borderStyle: 'solid',
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
    titleContainerStyle:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      verticalAlign: 'middle',
      flexDirection: 'row',
    },
    titleStyle:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      verticalAlign: 'middle',
      flexDirection: 'row',
      fontSize: 20,
      paddingVertical: 5,

      fontWeight: 'bold',
    },
    textContainerStyle:{
      width: '100%',
    },
    textStyle:{
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
    image:{
      height: 20,
      width: 20,
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
  });

  return (
    <View style={s.container}>
      <View style={[s.noteContainer, isSelecting && s.containerSelecting, isSelected && s.containerSelected]}>
        {(isDisabled || isEditingNote)?
          <View style={s.inputsContainer}>
            <View style={s.inputsLeft}>
              <PressImage pressStyle={[gs.baseImageContainer]} style={[s.image, s.imageDelete]} confirm={true} source={require('../../../../public/images/trash.png')} onPress={onDelete}></PressImage>
            </View>
            <View style={s.inputsCenter}>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Title"
                defaultValue={note.Title}
                onChangeText={(value: string)=>{setNewNote({...newNote, Title: value})}} autoFocus={note.Title.trim() === ''}
                onSubmitEditing={doneEdit}>
              </TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Text"
                multiline={true}
                defaultValue={note.Text}
                onChangeText={(value: string)=>{setNewNote({...newNote, Text: value})}} autoFocus={note.Text.trim() === ''}
                onSubmitEditing={doneEdit}>
              </TextInput>
            </View>
            <View style={s.inputsRight}>
              <PressImage pressStyle={[gs.baseImageContainer]} style={[s.image, s.imageDone]} source={require('../../../../public/images/done.png')} onPress={doneEdit}></PressImage>
              <View style={gs.baseImageContainer}></View>
              <PressImage pressStyle={[gs.baseImageContainer]} style={[s.image, s.imageCancel]} source={require('../../../../public/images/cancel.png')} onPress={onCancelNote}></PressImage>
            </View>    
          </View>
          :
          <View style={s.displayContainer}>
            {note.Title && <PressText style={s.titleContainerStyle} textStyle={s.titleStyle} onPress={()=>{setIsEditingNote(true)}} text={newNote.Title}></PressText>}
            <PressText style={s.textContainerStyle} textStyle={s.textStyle} onPress={()=>{setIsEditingNote(true)}} text={newNote.Text}></PressText>
            {/* <PressImage
              style={s.image}
              pressStyle={gs.baseImageContainer}
              onPress={()=>{setIsEditingNote(true)}}
              source={require('../../../../public/images/note.png')}
            ></PressImage> */}
          </View>
        }    
      </View>
    </View>
  );
};

export default NoteView;