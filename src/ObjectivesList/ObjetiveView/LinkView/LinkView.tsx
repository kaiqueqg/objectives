import { View, StyleSheet, Text, TextInput, Linking, Vibration } from "react-native";
import { Link, ItemViewProps,  MessageType, Pattern } from "../../../Types";
import { colorPalette, globalStyle as gs } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import PressImage from "../../../PressImage/PressImage";
import { useEffect, useRef, useState } from "react";
import PressText from "../../../PressText/PressText";
import { useLogContext } from "../../../Contexts/LogContext";

export const New = () => {
  return(
    {
      Title: '',
      Link: '',
    }
  )
}

export interface LinkViewProps extends ItemViewProps {
  link: Link,
}

const LinkView = (props: LinkViewProps) => {
  const { log, popMessage } = useLogContext();
  const { userPrefs, theme: t, fontTheme: f, putItem } = useUserContext();
  const { objTheme: o, isEditingPos, onDeleteItem, loadMyItems, link } = props;

  
  const [newTitle, setNewTitle] = useState<string>(link.Title);
  const [newLink, setNewLink] = useState<string>(link.Link);
  const [isEditingLinks, setIsEditingLinks] = useState<boolean>(false);

  useEffect(()=>{
  }, [link])

  const onDelete = async () => {
    await onDeleteItem(link);
  }

  const onDoneLink = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    const newValue: Link = {
      ...link, 
      Title: newTitle.trim(), 
      Link: newLink,
      LastModified: new Date().toISOString()};

    await putItem(newValue);
    setIsEditingLinks(false);
    setNewTitle('');
    setNewLink('');
    loadMyItems();
  }

  const onCancelLink = async () => {
    setIsEditingLinks(false);
  }

  const openLink = () => {
    if (link.Link) {
      Linking.canOpenURL(link.Link)
        .then((supported) => {
          if (supported) {
            Linking.openURL(link.Link);
          } else {
            popMessage('Cannot open this URL', MessageType.Error);
          }
        })
        .catch((err) => {});
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
    linksContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: (link.Title.trim() !=='')?colorPalette.transparent:o.itembk,
      
      borderColor: (link.Title.trim() !=='')?colorPalette.transparent:o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: o.borderRadius,
    },
    linksContainerSelected:{
      borderStyle: 'dashed',
      borderColor: o.bordercolorselected,
    },
    linksContainerEnding:{
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
      tintColor: o.itemtextfade,
    },
    linksDoneImage:{
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
    newLinkInputsContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 40,
    },
    linksListContainer:{
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 40,
      width: '100%',
    },
    linkRowContainer:{ 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
    },
    linkRowText:{
      display: 'flex',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      color: o.itemtext,
      marginLeft: 10,
    },
    linkRowImage:{
      height: 15,
      width: 15,
      tintColor: o.icontintcolor,
    },
  });

  return (
    <View style={s.container}>
      <View style={[s.linksContainer, props.isSelected && s.linksContainerSelected, props.isSelected && props.isEndingPos && s.linksContainerEnding]}>
        {!isEditingPos && isEditingLinks?
          <View style={s.inputsContainer}>
            <View style={s.inputsLeft}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDelete]} confirm={true} source={require('../../../../public/images/trash.png')} onPress={onDelete}></PressImage>
            </View>
            <View style={s.inputsCenter}>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Title"
                defaultValue={link.Title}
                onSubmitEditing={onDoneLink}
                onChangeText={(value: string)=>{setNewTitle(value)}} autoFocus></TextInput>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Link url"
                defaultValue={link.Link}
                onSubmitEditing={onDoneLink}
                onChangeText={(value: string)=>{setNewLink(value)}}></TextInput>
            </View>
            <View style={s.inputsRight}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDone]} source={require('../../../../public/images/done.png')} onPress={onDoneLink}></PressImage>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageCancel]} source={require('../../../../public/images/cancel.png')} onPress={onCancelLink}></PressImage>
            </View>
          </View>
          :
          <PressText style={s.titleContainer} textStyle={s.title} text={link.Title} onPress={()=>{if(!isEditingPos)setIsEditingLinks(!isEditingLinks)}}></PressText>
        }
        {!isEditingLinks && <PressImage pressStyle={gs.baseImageContainer} style={[s.image, link.Link.trim() !== ''?{}:s.imageFade]} source={require('../../../../public/images/link.png')} onPress={() => { if(!isEditingPos)openLink();}}></PressImage>}
      </View>
    </View>
  );
};

export default LinkView;