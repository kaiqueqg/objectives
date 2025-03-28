import { View, StyleSheet, Text } from "react-native";
import { ObjectivePallete, ThemePalette, colorPalette, getObjTheme } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import { ItemViewProps, Wait } from "../../../Types";
import PressImage from "../../../PressImage/PressImage";
import PressInput from "../../../PressInput/PressInput";
import { useState } from "react";

export const New = () => {
  return(
    {
      Title: '',
    }
  )
}

export interface WaitViewProps extends ItemViewProps{
  wait: Wait,
}

const WaitView = (props: WaitViewProps) => {
  const { theme: t, fontTheme: f, putItem } = useUserContext();
  const { objTheme: o, wait, isEditingPos, onDeleteItem, loadMyItems } = props;

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

  const onDelete = async () => {
    await onDeleteItem(wait);
  }

  const onChangeTitle = async (newText: string) => {
    const newWait = {...wait, Title: newText.trim()};
    await putItem(newWait);
    loadMyItems();
  }

  const onEditingTitle = async (editingState: boolean) => {
    setIsEditingTitle(editingState);
  }

  const s = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      marginBottom: 4,
      marginHorizontal: 6,
    },
    titleContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: wait.Title.trim() !== ''?o.objbk:o.itembk,
      
      borderRadius: 5,
      borderColor: wait.Title.trim() !== ''?o.objbk:o.bordercolor,
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
    inputTextStyle:{
      color: o.itemtext,
    },
    inputStyle: {
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
          text={wait.Title}
          onDelete={onDelete}
          onDone={onChangeTitle}
          onEditingState={onEditingTitle}
          uneditable={isEditingPos}

          textStyle={s.inputTextStyle}
          inputStyle={s.inputStyle}
          trashImageStyle={{tintColor: o.trashicontint}}
          >
        </PressInput>
        {!isEditingTitle && <PressImage 
          style={s.image}
          pressStyle={s.imageContainer}
          onPress={()=>{}}
          source={require('../../../../public/images/wait.png')}
        ></PressImage>}
      </View>
    </View>
  );
};

export default WaitView;