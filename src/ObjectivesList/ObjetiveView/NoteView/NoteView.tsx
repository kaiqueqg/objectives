import { View, StyleSheet, Vibration, Keyboard, BackHandler, TextInput } from "react-native";
import { colorPalette, globalStyle as gs } from "../../../Colors";
import { useUserContext } from "../../../Contexts/UserContext";
import { Note, ItemViewProps, Pattern } from "../../../Types";
import PressImage from "../../../PressImage/PressImage";
import PressInput from "../../../PressInput/PressInput";
import { useEffect, useState } from "react";
import { useLogContext } from "../../../Contexts/LogContext";
import PressText from "../../../PressText/PressText";
import PopMessageContainer from "../../../Log/PopMessageContainer";

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
  const { log, popMessage } = useLogContext();
  const { objTheme: o, itemsListScrollTo, isLocked, wasJustAdded, isSelected, isSelecting, isDisabled, onDeleteItem, loadMyItems, note } = props;

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
      
      onCancelNote();
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

  const onEditingNote = () => {
    log.r('qsd')
    if(isLocked) {
      Vibration.vibrate(Pattern.Wrong);
      return;
    }

    if(!isDisabled){
      itemsListScrollTo(note.ItemId);
      setIsEditingNote(!isEditingNote);
    }
    else{
      popMessage('qsds')
    }
  }

  const onCancelNote = async () => {
    setIsEditingNote(false);
  }

  const getDisplayView = () => {
    const displayText:boolean = (note.Text || !note.Title) ?true : false;

    return(
      <View style={s.displayContainer}>
        {note.Title && <PressText style={s.titleContainerStyle} textStyle={s.titleStyle} onPress={onEditingNote} text={newNote.Title}></PressText>}
        {displayText && <PressText style={s.textContainerStyle} textStyle={s.textStyle} onPress={onEditingNote} text={newNote.Text}></PressText>}
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
    noteContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      // paddingBottom: 10,
      minHeight: 40,
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
      paddingHorizontal: 10,
      paddingBottom: 5,
      minHeight: 40,
    },
    inputsContainer:{
      flex: 1,
      flexDirection: 'row',
      paddingBottom: 10,

      borderColor: 'yellow',
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
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
      color: o.itemtext,

      fontWeight: 'bold',
    },
    textContainerStyle:{
      width: '100%',
    },
    textStyle:{
      color: o.itemtext,
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
      <View style={[s.noteContainer, isSelecting && s.containerSelecting, isSelected && s.containerSelected, wasJustAdded && s.containerWasJustAdded]}>
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
              <PressImage pressStyle={[gs.baseImageContainer]} style={[s.image, s.imageCancel]} source={require('../../../../public/images/cancel.png')} onPress={onCancelNote}></PressImage>
            </View>    
          </View>
          :
          getDisplayView()
        }    
      </View>
    </View>
  );
};

export default NoteView;