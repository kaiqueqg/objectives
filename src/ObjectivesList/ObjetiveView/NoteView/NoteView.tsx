import { View, StyleSheet, Vibration } from "react-native";
import { globalStyle as gs } from "../../../Colors";
import { useUserContext } from "../../../Contexts/UserContext";
import { Note, ItemViewProps } from "../../../Types";
import PressImage from "../../../PressImage/PressImage";
import PressInput from "../../../PressInput/PressInput";
import { useState } from "react";

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
      marginHorizontal: o.marginHorizontal,
      marginVertical: o.marginVertical,
      minHeight: 45,
    },
    titleContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: note.Text.trim() === ''?o.itembk:o.objbk,
      
      borderColor: note.Text.trim() === ''?o.bordercolor:o.objbk,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: o.borderRadius,
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
      borderColor: o.icontintcolor,
    },
    image:{
      height: 20,
      width: 20,
      tintColor: o.icontintcolor,
    },
    imageFade: {
      ...gs.baseImage,
      tintColor: o.icontintcolorfade
    },
    imageMove:{
      ...gs.baseImage,
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
          confirmDelete={true}
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
          pressStyle={gs.baseImageContainer}
          onPress={()=>{}}
          source={require('../../../../public/images/note.png')}
        ></PressImage>}    
      </View>
    </View>
  );
};

export default NoteView;