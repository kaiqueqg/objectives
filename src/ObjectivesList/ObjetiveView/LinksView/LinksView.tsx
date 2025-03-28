import { View, StyleSheet, Text, Vibration, TextInput, Linking } from "react-native";
import { Links, Item, Pattern, ItemViewProps, User, Link, Objective, ItemType, MessageType } from "../../../Types";
import { colorPalette, ObjectivePallete, ThemePalette } from "../../../Colors";
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
      Links: [],
    }
  )
}

export interface LinksViewProps extends ItemViewProps {
  links: Links,
}

const LinksView = (props: LinksViewProps) => {
  const { log, popMessage } = useLogContext();
  const { userPrefs, theme: t, fontTheme: f, putItem } = useUserContext();
  const { objTheme: o, isEditingPos, onDeleteItem, loadMyItems, links: links } = props;

  
  const [newTitle, setNewTitle] = useState<string>(links.Title);
  const [isEditingLinks, setIsEditingLinks] = useState<boolean>(false);
  const [newLinkTitle, setNewLinkTitle] = useState<string>('');
  const [newLinkUrl, setNewLinkUrl] = useState<string>('');
  const [newLinks, setNewLinks] = useState<Link[]>(links.Links);
  const [newLinkTitleWarning, setNewLinkTitleWarning] = useState<boolean>(false);
  const [newLinkUrlWarning, setNewLinkUrlWarning] = useState<boolean>(false);

  const titleInputRef = useRef<TextInput>(null);
  const urlInputRef = useRef<TextInput>(null);

  useEffect(()=>{
  }, [links])

  const onDelete = async () => {
    await onDeleteItem(links);
  }

  const onTitleEnter = () => {
    if(newLinkTitle.trim() !== '' && newLinkUrl.trim() !== '') {
      addLinkToLinks();
    }
    else{
      urlInputRef.current?.focus();
    }
  }

  const onUrlEnter = () => {
    if(newLinkTitle.trim() !== '' && newLinkUrl.trim() !== '') {
      addLinkToLinks();
    }
    else{
      titleInputRef.current?.focus();
    }
  }

  const addLinkToLinks = () => {
    if(newLinkTitle.trim() === ''){
      setNewLinkTitleWarning(true);
    }

    if(newLinkUrl.trim() === ''){
      setNewLinkUrlWarning(true);
    }
    
    if(newLinkTitle.trim() !== '' && newLinkUrl.trim() !== ''){
      const exist = newLinks.find((e)=>(e.Title === newLinkTitle.trim() && e.Url === newLinkUrl.trim()))
      if(!exist){
        setNewLinks([...newLinks, {Title: newLinkTitle, Url: newLinkUrl}])
      }

      setNewLinkTitle('');
      setNewLinkUrl('');
      setNewLinkTitleWarning(false);
      setNewLinkUrlWarning(false);
    }
  }

  const removeLinkFromLinks = (link: Link) => {
    const newValue = newLinks.filter((e)=>(e.Title !== link.Title && e.Url !== link.Url));
    setNewLinks([...newValue]);
  }

  const onDoneGrocery = async () => {
    const newValue: Links = {
      ...links, 
      Title: newTitle.trim(), 
      Links: newLinks,
      LastModified: new Date().toISOString()};

    await putItem(newValue);
    setIsEditingLinks(false);
    setNewLinkTitle('');
    setNewLinkUrl('');
    setNewLinkTitleWarning(false);
    setNewLinkUrlWarning(false);
    loadMyItems();
  }

  const onCancelGrocery = async () => {
    setIsEditingLinks(false);
    
    setNewLinkTitleWarning(false);
    setNewLinkUrlWarning(false);
  }

  const onChangeLinkTitle = (value: string) => {
    setNewLinkTitle(value);
    setNewLinkTitleWarning(false);
  }

  const  onChangeLinkUrl = (value: string) => {
    setNewLinkUrl(value);
    setNewLinkUrlWarning(false);
  }

  const openLink = (link: Link) => {
    if (link.Url) {
      Linking.canOpenURL(link.Url)
        .then((supported) => {
          if (supported) {
            Linking.openURL(link.Url);
          } else {
            popMessage('Cannot open this URL', MessageType.Error);
          }
        })
        .catch((err) => {});
    }
  }

  const openLinks = () => {
    links.Links.forEach((link: Link) => {
      openLink(link);
    })
  }

  const getLinkView = (link: Link) => {
    return(
      <View key={link.Title+link.Url} style={s.linkRowContainer}>
        <PressImage pressStyle={s.imageContainer} style={[s.linkRowImage]} source={require('../../../../public/images/trash.png')} onPress={()=>{removeLinkFromLinks(link)}}></PressImage>
        <Text style={s.linkRowText}>{link.Title}</Text>
        <PressImage pressStyle={s.imageContainer} style={[s.linkRowImage]} source={require('../../../../public/images/link.png')} onPress={()=>{openLink(link)}}></PressImage>
      </View> 
    )
  }

  const getLinkList = () => {
    if(newLinks.length > 0){
      let linksList = newLinks.map((link: Link) => {
        return getLinkView(link);
      })
  
      return (
        <View style={s.linksListContainer}>
          {linksList}
        </View>
      )
    }
    else{
      return(
        <View style={s.linksListContainer}>
          <Text style={s.title}>Empty list</Text>
        </View>
      )
    }
  }

  const s = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
      marginHorizontal: 6,
      minHeight: 40,
    },
    linksContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: (links.Title.trim() !=='')?colorPalette.transparent:o.itembk,
      
      borderRadius: 5,
      borderColor: (links.Title.trim() !=='')?colorPalette.transparent:o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
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
    imageContainer:{
      height: 40,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image:{
      height: 24,
      width: 24,
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
      height: 24,
      width: 24,
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
      borderColor: o.bordercolor,
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
              <PressImage pressStyle={s.imageContainer} style={[s.image, s.imageDelete]} confirm={true} source={require('../../../../public/images/trash.png')} onPress={onDelete}></PressImage>
            </View>
            <View style={s.inputsCenter}>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Title"
                defaultValue={links.Title}
                onChangeText={(value: string)=>{setNewTitle(value)}}></TextInput>
              <View style={s.newLinkInputsContainer}>
                <TextInput
                  ref={titleInputRef}
                  style={s.inputStyle}
                  placeholderTextColor={newLinkTitleWarning? 'red':o.itemtextfade}
                  placeholder="Title"
                  defaultValue={newLinkTitle}
                  onSubmitEditing={onTitleEnter}
                  onChangeText={onChangeLinkTitle}></TextInput>
                <TextInput 
                  ref={urlInputRef}
                  style={s.inputStyle}
                  placeholderTextColor={newLinkUrlWarning? 'red':o.itemtextfade}
                  placeholder="Url"
                  defaultValue={newLinkUrl}
                  onSubmitEditing={onUrlEnter}
                  onChangeText={onChangeLinkUrl}></TextInput>
              </View>
              {getLinkList()}
            </View>
            <View style={s.inputsRight}>
              <PressImage pressStyle={s.imageContainer} style={[s.image, s.imageDone]} source={require('../../../../public/images/done.png')} onPress={onDoneGrocery}></PressImage>
              <PressImage pressStyle={s.imageContainer} style={[s.image, s.imageCancel]} source={require('../../../../public/images/cancel.png')} onPress={onCancelGrocery}></PressImage>
            </View>
          </View>
          :
          <PressText style={s.titleContainer} textStyle={s.title} text={links.Title} onPress={()=>{if(!isEditingPos)setIsEditingLinks(!isEditingLinks)}}></PressText>
        }
        {!isEditingLinks && <PressImage pressStyle={s.imageContainer} style={[s.image, links.Links.length > 0?{}:s.imageFade]} source={require('../../../../public/images/link.png')} onPress={() => { if(!isEditingPos)openLinks();}}></PressImage>}
      </View>
    </View>
  );
};

export default LinksView;