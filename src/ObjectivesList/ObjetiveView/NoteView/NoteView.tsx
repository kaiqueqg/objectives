import { View, StyleSheet, Vibration } from "react-native";
import { ObjectivePallete, ThemePalette, getObjTheme } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import { Note, ItemViewProps } from "../../../Types";
import PressImage from "../../../PressImage/PressImage";
import PressInput from "../../../PressInput/PressInput";
import { useState } from "react";

export interface NoteViewProps extends ItemViewProps {
  note: Note,
}

const NoteView = (props: NoteViewProps) => {
  const { userPrefs, theme: t, fontTheme: f, putItem } = useUserContext();
  const { objTheme: o, isEditingPos, onDeleteItem, loadMyItems, note } = props;

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

  const onDelete = async () => {
    await onDeleteItem(note);
  }

  const onChangeText = async (newText: string) => {
    const newNote = {...note, Text: newText.trim()};
    await putItem(newNote);
    loadMyItems();
  }

  const onEditingTitle = async (editingState: boolean) => {
    setIsEditingTitle(editingState);
  }

  const s = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
      marginHorizontal: 6,
    },
    titleContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: note.Text.trim() === ''?o.itembk:o.objbk,
      
      borderRadius: 5,
      borderColor: note.Text.trim() === ''?o.bordercolor:o.objbk,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    titleContainerSelected:{
      borderStyle: 'dashed',
      borderColor: o.bordercolorselected,
    },
    titleContainerEnding:{
      borderStyle: 'solid',
      borderColor: o.bordercolorselected,
    },
    editingText:{
      verticalAlign: 'middle',
      color: o.itemtext,
    },
    editingInput: {
      color: o.itemtext,
      borderColor: o.itemtext,
    },
    imageContainer:{
      height: 40,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image:{
      height: 20,
      width: 20,
      tintColor: o.icontintcolor,
    },
    imageFade: {
      height: 20,
      width: 20,
      tintColor: o.icontintcolorfade
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
  });

  return (
    <View style={s.container}>
      <View style={[s.titleContainer, props.isSelected && s.titleContainerSelected, props.isSelected && props.isEndingPos && s.titleContainerEnding]}>
        <PressInput 
          objTheme={o}
          text={note.Text}
          onDelete={onDelete}
          onDone={onChangeText}
          onEditingState={onEditingTitle}
          multiline={true}
          uneditable={isEditingPos}
          
          textStyle={s.editingText}
          inputStyle={s.editingInput}
          trashImageStyle={{tintColor: o.trashicontint}}
          >
        </PressInput>
        {note.Text === '' && !isEditingTitle && 
        <PressImage 
          style={s.image}
          pressStyle={s.imageContainer}
          onPress={()=>{}}
          source={require('../../../../public/images/note.png')}
        ></PressImage>}    
      </View>
    </View>
  );
};

export default NoteView;