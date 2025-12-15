import { View, StyleSheet, Text, Keyboard, BackHandler } from "react-native";
import { globalStyle as gs } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import { ItemViewProps, Wait } from "../../../Types";
import PressImage from "../../../PressImage/PressImage";
import PressInput from "../../../PressInput/PressInput";
import { useEffect, useState } from "react";

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
  const { objTheme: o, wait, isDisabled, onDeleteItem, loadMyItems } = props;

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
    
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
    const hide = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

    const backAction = () => {
      if (keyboardVisible) {
        Keyboard.dismiss();
        return true;
      }
      
      onCancelWait();
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
    await onDeleteItem(wait);
  }

  const onChangeTitle = async (newText: string) => {
    const newWait = {...wait, Title: newText.trim()};
    await putItem(newWait);
    loadMyItems();
  }

  const onCancelWait = () => {
    onEditingTitle(false);
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
      marginHorizontal: o.marginHorizontal,
      marginVertical: o.marginVertical,
    },
    titleContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: wait.Title.trim() !== ''?o.objbk:o.itembk,
      
      borderColor: wait.Title.trim() !== ''?o.objbk:o.bordercolor,
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
    inputTextStyle:{
      color: o.itemtext,
    },
    inputStyle: {
      color: o.itemtext,
      borderColor: o.icontintcolor,
    },
    image:{
      ...gs.baseSmallImage,
      tintColor: o.icontintcolor,
    },
    imageMove:{
      ...gs.baseImage,
      tintColor: o.icontintcolor,
    },
  });

  return (
    <View style={s.container}>
    <View style={[s.titleContainer, props.isSelected && s.titleContainerSelected, props.isSelected && isDisabled && s.titleContainerEnding]}>
        <PressInput 
          objTheme={o}
          text={wait.Title}
          onDelete={onDelete}
          onDone={onChangeTitle}
          onEditingState={onEditingTitle}
          uneditable={isDisabled || props.isLocked}

          textStyle={s.inputTextStyle}
          inputStyle={s.inputStyle}
          trashImageStyle={{tintColor: o.trashicontint}}
          >
        </PressInput>
        {!isEditingTitle && <PressImage 
          style={s.image}
          pressStyle={gs.baseImageContainer}
          onPress={()=>{}}
          source={require('../../../../public/images/wait.png')}
        ></PressImage>}
      </View>
    </View>
  );
};

export default WaitView;