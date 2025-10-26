import { View, StyleSheet, Text, Vibration, TextInput, Platform, Image as ReactImage, TouchableOpacity, Button, Keyboard, BackHandler } from "react-native";
import { Item, Image, Pattern, ItemViewProps, ItemNew, StoredImage } from "../../../Types";
import { dark, globalStyle as gs } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import PressImage from "../../../PressImage/PressImage";
import { useEffect, useState } from "react";
import PressText from "../../../PressText/PressText";
import React from "react";
import { useLogContext } from "../../../Contexts/LogContext";
import * as ImagePicker from 'expo-image-picker';

import * as FileSystem from 'expo-file-system';
import { useStorageContext } from "../../../Contexts/StorageContext";
import { useRequestContext } from "../../../Contexts/RequestContext";
import Loading from "../../../Loading/Loading";

export const New = () => {
  return(
    {
      Title: '',
      IsDisplaying: true,
      ItemId: '',
      ItemImage: {
        ItemId: '',
        Name: '',
        Size: 0,
        Width: 0,
        Height: 0,
        ImageFile: '',
      }
    }
  )
}

export interface ImageViewProps extends ItemViewProps {
  image: Image,
}

const ImageView = (props: ImageViewProps) => {
  const { userPrefs, theme: t, fontTheme: f, putItem } = useUserContext();
  const { log }= useLogContext();
  const { storage } = useStorageContext();
  const { objectivesApi } = useRequestContext();
  const { objTheme: o, isEditingPos, onDeleteItem, loadMyItems, image } = props;

  const [isEditingImage, setIsEditingImage] = useState<boolean>(false);
  const [tempImage, setTempImage] = useState<Image>(props.image);

  const [storedImage, setStoredImage] = useState<StoredImage|null>(null);

  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState<boolean>(false);
  const [isDeletingImage, setIsDeletingImage] = useState<boolean>(false);

  const [viewWidth, setViewWidth] = useState<number>(0);
  const [viewHeight, setViewHeight] = useState<number>(0);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
    
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
    const hide = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

    const backAction = () => {
      if (keyboardVisible) {
        Keyboard.dismiss();
        return true;
      }
      
      onCancelImage();
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
    if(image.Name) loadImage();
  },[storedImage]);

  const a = async () => {
    const fileDir:string|null = FileSystem.documentDirectory;

    if(fileDir){
      const list:string[] = await FileSystem.readDirectoryAsync(fileDir);
      log.arr(list);
    }
  }

  const loadImage = async () => {
    const fileDir: string | null = FileSystem.documentDirectory;
  
    if (fileDir) {
      const list: string[] = await FileSystem.readDirectoryAsync(fileDir);
      const storedFile: string | undefined = list.find(file => file === image.Name);
  
      if (storedFile) {
        const fullPath = fileDir + storedFile;
        setStoredImage({ ItemId: image.ItemId, ImageFile: fullPath });
      } else {
        setIsDownloadingImage(true);
        const data = await objectivesApi.getImage({ itemId: image.ItemId, fileName: image.Name });
        if (data) setStoredImage({ ItemId: image.ItemId, ImageFile: data });
        setIsDownloadingImage(false);
      }
    }
  };

  useEffect(()=>{
    if(storedImage?.ImageFile){ReactImage.getSize(storedImage.ImageFile, (width, height) => {
      setViewHeight(viewWidth/(width/height));
    }, (error:any) => {
      console.error('Failed to get image size:', error);
    });}

    
  },[viewWidth, image])  
  
  useEffect(()=>{
    setTempImage(props.image);
  }, [image])

  const onDelete = async () => {
    await onDeleteItem(image);
  }

  const onDoneImage = async () => {
    let newImage = {...tempImage};
    newImage.Title = newImage.Title.trim();
    await putItem(newImage);
    setIsEditingImage(false);
    loadMyItems();
  }

  const onCancelImage = async () => {
    setIsEditingImage(false);
  }

  const onChangeIsDisplaying = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    const newImage:Image = {...image, IsDisplaying: !image.IsDisplaying};
    await putItem(newImage);
    loadMyItems();
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const resultImage = result.assets[0];
      const newPath:string = `${FileSystem.documentDirectory}${resultImage.fileName}`;
      await FileSystem.moveAsync({ from: resultImage.uri, to: newPath });
      setStoredImage({ItemId: image.ItemId, ImageFile: newPath});

      const newImage:Image = {
        ...image, 
        Name: resultImage.fileName??'',
        Size: resultImage.fileSize??0,
        Height: resultImage.height,
        Width: resultImage.width
      };

      await putItem(newImage);
      loadMyItems();
    }
  };

  const openCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        base64: true,
        quality: 1,
      });

      if (!result.canceled) {
        const resultImage = result.assets[0];
        const path = `${FileSystem.documentDirectory}${resultImage.fileName}`;
        const newPath = `${FileSystem.documentDirectory}${resultImage.fileName}`;
        await FileSystem.moveAsync({ from: resultImage.uri, to: newPath });
        setStoredImage({ItemId: image.ItemId, ImageFile: newPath});
        
        const newImage:Image = {
          ...image, 
          Name: resultImage.fileName??'',
          Size: resultImage.fileSize??0,
          Height: resultImage.height,
          Width: resultImage.width
        };
        await putItem(newImage);
        loadMyItems();
      }
    } catch (error) {
      console.error("Error opening camera: ", error);
    }
  };

  const downloadImage = () => {
  }

  const deleteImage = async () => {
    const newImage:Image = {
      ...image, 
      Name: '',
      Size: 0,
      Width: 0,
      Height: 0,
    };
    await putItem(newImage);
    loadMyItems();
  }

  const getTitle = (): string => {
    //image.Name? 'has name': log.b('not image name');
    return image.Title;
  }

  const onEditingImage = () => {
    if(props.isLocked) {
      Vibration.vibrate(Pattern.Wrong);
      return;
    }

    if(!isEditingPos){
      setIsEditingImage(!isEditingImage);
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
    imageViewContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: o.itembk,
      
      borderColor: o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: o.borderRadius,
    },
    imageViewContainerSelected:{
      borderStyle: 'dashed',
      borderColor: o.bordercolorselected,
    },
    imageViewContainerEnding:{
      borderStyle: 'solid',
      borderColor: o.bordercolorselected,
    },
    displayContainer:{
      flex: 1,
      flexDirection: 'column',
      width: '100%',
      borderStyle: 'solid',
    },
    displayContainerRow:{
      flex: 1,
      flexDirection: 'row',
      width: '100%',
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
    buttonsRowContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: '100%',
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
    imageMoveContainer:{
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 5,
      width: 40,
      height: 40,
    },
    imageMove:{
      ...gs.baseImage,
      tintColor: o.icontintcolor,
    },
    imageDoneImage:{
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
    imagePreview: {
      flex: 1,
      width: '100%',
      height: viewHeight,
      resizeMode: 'contain',
    },
  });

  return (
    <View style={s.container}>
      <View style={[s.imageViewContainer, props.isSelected && s.imageViewContainerSelected, props.isSelected && props.isEndingPos && s.imageViewContainerEnding]}>
        {!isEditingPos && isEditingImage?
          <View style={s.inputsContainer}>
            <View style={s.inputsLeft}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDelete]} confirm={true} source={require('../../../../public/images/trash.png')} onPress={onDelete}></PressImage>
            </View>
            <View style={s.inputsCenter}>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Title"
                defaultValue={getTitle()}
                onChangeText={(value: string)=>{setTempImage({...tempImage, Title: value})}}
                onSubmitEditing={onDoneImage}
                autoFocus={image.Title.trim() === ''}></TextInput>
              <View style={s.buttonsRowContainer}>
                <PressImage pressStyle={gs.baseImageContainer} style={[s.image]} source={require('../../../../public/images/camera.png')} onPress={openCamera}></PressImage>
                <PressImage pressStyle={gs.baseImageContainer} style={[s.image]} source={require('../../../../public/images/image.png')} onPress={pickImage}></PressImage>
                <PressImage pressStyle={gs.baseImageContainer} style={[s.image]} confirm={true} source={require('../../../../public/images/trash.png')} onPress={deleteImage}></PressImage>
              </View>
              {storedImage && <ReactImage style={s.imagePreview} source={{ uri: storedImage.ImageFile }}></ReactImage>}
              {!storedImage && image.Name && <PressImage pressStyle={gs.baseImageContainer} style={[s.image]} source={require('../../../../public/images/download.png')} onPress={downloadImage}></PressImage>}
            </View>
            <View style={s.inputsRight}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDone]} source={require('../../../../public/images/done.png')} onPress={onDoneImage}></PressImage>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageCancel]} source={require('../../../../public/images/cancel.png')} onPress={onCancelImage}></PressImage>
            </View>
          </View>
          :
          <View style={s.displayContainer}onLayout={(event) => {const { width } = event.nativeEvent.layout;setViewWidth(width);}}>
            <View style={s.displayContainerRow}>
              <PressText
                style={s.titleContainer}
                textStyle={s.title}
                text={getTitle()}
                onPress={()=>{onEditingImage()}}
                defaultStyle={o}
              ></PressText>
              {storedImage?
                <PressImage pressStyle={[gs.baseImageContainer]} style={[s.image, image.IsDisplaying? null:s.imageFade]} source={require('../../../../public/images/image-filled.png')} onPress={() => {if(!isEditingPos)onChangeIsDisplaying();}}></PressImage>
                :
                <PressImage pressStyle={[gs.baseImageContainer]} style={[s.image, image.IsDisplaying? null:s.imageFade]} source={require('../../../../public/images/image.png')} onPress={() => {if(!isEditingPos)onChangeIsDisplaying();}}></PressImage>
              }
            </View>
          {image.IsDisplaying && storedImage?.ImageFile && 
          (isDownloadingImage?
            <Loading theme={dark}></Loading>
            :
            <ReactImage source={{ uri: storedImage.ImageFile }} style={s.imagePreview} />
          )
          }
        <View/>
      </View>
      }
      </View>
    </View>
  );
};

export default ImageView;