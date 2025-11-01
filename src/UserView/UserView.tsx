import { View, StyleSheet, Text, TextInput, Vibration , Pressable, BackHandler, ScrollView} from "react-native";
import { useUserContext } from "../Contexts/UserContext";
import React, { useEffect, useState } from "react";
import PressText from "../PressText/PressText";
import Loading from "../Loading/Loading";
import { colorPalette, dark, globalStyle as gs } from "../Colors";
import { MessageType, ObjBottomIcons, Pattern, UserPrefs, Views } from "../Types";
import { useLogContext } from "../Contexts/LogContext";
import { useStorageContext } from "../Contexts/StorageContext";
import PressImage from "../PressImage/PressImage";
import Constants, { ExecutionEnvironment } from 'expo-constants';

import LoginView from "./LoginView";

import * as FileSystem from 'expo-file-system';
interface StorageAccessFrameworkType {
  requestDirectoryPermissionsAsync: () => Promise<{ granted: boolean; directoryUri: string }>;
  createFileAsync: (dirUri: string, fileName: string, mimeType: string) => Promise<string>;
  writeAsStringAsync: (fileUri: string, content: string) => Promise<void>;
  readDirectoryAsync: (dirUri: string) => Promise<string[]>;
  deleteAsync: (uri: string) => Promise<void>;
}

const saf: StorageAccessFrameworkType = (FileSystem as any).StorageAccessFramework;

export interface UserViewProps {
}
const UserView = (props: UserViewProps) => {
  const { log, popMessage } = useLogContext();
  const { writeCurrentView } = useUserContext();
  const { storage } = useStorageContext();
  const { theme: t, fontTheme: f, user, userPrefs, writeUserPrefs } = useUserContext();

  const showLoginStuff: boolean = true;//Constants.executionEnvironment === ExecutionEnvironment.StoreClient || process.env.LOGIN_VIEW === 'true';

  useEffect(()=>{
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      writeCurrentView(Views.ListView);
      return true;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const parseJwt = (token :string) => {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  const onChangePrefs = (newPrefs: UserPrefs) => {
    if(newPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    writeUserPrefs(newPrefs);
  }

  const saveToJSON = async (): Promise<void> => {
    try {
      const perm = await saf.requestDirectoryPermissionsAsync();
      if (!perm.granted) throw new Error("Permission denied");
      const dir = perm.directoryUri;

      const objectives = await storage.readObjectives();
      const items = await storage.readItems();

      await writeSafFile(dir, "objectives.json", JSON.stringify(objectives, null, 2));
      await writeSafFile(dir, "items.json", JSON.stringify(items, null, 2));

      popMessage("Saved.");
    } catch (err) {
      console.error(err);
      popMessage("Error saving JSON files.", MessageType.Error);
    }
  }

  const writeSafFile = async (directoryUri: string, name: string, content: string): Promise<void> => {
    try {
      const files = await saf.readDirectoryAsync(directoryUri);
      const existing = files.find((u) => u.endsWith("/" + name));
      if (existing) await saf.deleteAsync(existing); // overwrite if exists
    } catch (err) {
      console.warn("Error deleting existing file", err);
    }

    const fileUri = await saf.createFileAsync(directoryUri, name, "application/json");
    await saf.writeAsStringAsync(fileUri, content);
  }

  // const saveToJSON = async () => {
  //   try {
  //     const perm = await saf.requestDirectoryPermissionsAsync();
  //     if (!perm.granted) throw new Error("Permissão negada");
  //     const dir = perm.directoryUri;

  //     const objectives = await storage.readObjectives();
  //     const items = await storage.readItems();

  //     await writeSafFile(dir, "objectives.json", JSON.stringify(objectives, null, 2));
  //     await writeSafFile(dir, "items.json", JSON.stringify(items, null, 2));

  //     popMessage('Salvo.');
  //   } 
  //   catch (err) {
  //     popMessage('Erro salvando arquivo.', MessageType.Error);
  //   }
  // }

  // async function writeSafFile(directoryUri: string, name: string, content: string) {
  //   try {
  //     const files = await saf.readDirectoryAsync(directoryUri);
  //     const existing = files.find((u: any) => u.endsWith("/" + name));
  //     if (existing) await saf.deleteAsync(existing);
  //   } catch {
  //     popMessage('Erro ao salvar os dados.', MessageType.Error);
  //   }

  //   const fileUri = await saf.createFileAsync(directoryUri, name, "application/json");
  //   await saf.writeAsStringAsync(fileUri, content);
  // }

  const shouldShowTools = () => {
    return (user.Role === 'Admin' || saf !== undefined);
  }

  const getToolsView = () => {
    if(!shouldShowTools()) return;

    return(
      <>
        <Text style={s.header}>TOOLS:</Text>
        {saf !== undefined && <PressText 
          style={s.prefsTools}
          textStyle={s.prefsToolsText}
          onPress={() => {saveToJSON()}}
          imageStyle={s.backupImage}
          imageSource={require('../../public/images/download-files.png')}
          text={"Download a JSON file of your data."}
          defaultStyle={{itemtextfade: colorPalette.green}}
          ></PressText>}
      </>
    )
  }

  const onAddIconToDisplay = (icon: string) => {
    if (userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    let newIcons: string[];

    if (userPrefs.ObjectivesPrefs.iconsToDisplay.includes(icon)) {
      newIcons = userPrefs.ObjectivesPrefs.iconsToDisplay.filter(i => i !== icon);
    } else {
      newIcons = [...userPrefs.ObjectivesPrefs.iconsToDisplay, icon];
    }

    const newPrefs: UserPrefs = {
      ...userPrefs,
      ObjectivesPrefs: {
        ...userPrefs.ObjectivesPrefs,
        iconsToDisplay: newIcons,
      },
    };

    writeUserPrefs(newPrefs);
  };

  const shouldFadeIcon = (icon: ObjBottomIcons) => {
    return (!userPrefs.ObjectivesPrefs.iconsToDisplay.includes(ObjBottomIcons[icon]))
  }

  const getObjectiveIconsView = () => {
    return(
      <>
        <PressImage 
          pressStyle={gs.baseBiggerImageContainer}
          style={[s.image, shouldFadeIcon(ObjBottomIcons.Unarchive) && s.imageFade]}
          onPress={()=>onAddIconToDisplay(ObjBottomIcons[ObjBottomIcons.Unarchive])}
          source={require('../../public/images/unarchive.png')}></PressImage>
        <PressImage 
          pressStyle={gs.baseBiggerImageContainer}
          style={[s.image, shouldFadeIcon(ObjBottomIcons.Archive) && s.imageFade]}
          onPress={()=>onAddIconToDisplay(ObjBottomIcons[ObjBottomIcons.Archive])}
          source={require('../../public/images/archive.png')}></PressImage>
        <PressImage 
          pressStyle={gs.baseBiggerImageContainer}
          style={[s.image, shouldFadeIcon(ObjBottomIcons.Palette) && s.imageFade]}
          onPress={()=>onAddIconToDisplay(ObjBottomIcons[ObjBottomIcons.Palette])}
          source={require('../../public/images/palette.png')}></PressImage>
        <PressImage 
          pressStyle={gs.baseBiggerImageContainer}
          style={[s.image, shouldFadeIcon(ObjBottomIcons.Tags) && s.imageFade]}
          onPress={()=>onAddIconToDisplay(ObjBottomIcons[ObjBottomIcons.Tags])}
          source={require('../../public/images/tag.png')}></PressImage>
        <PressImage 
          pressStyle={gs.baseBiggerImageContainer}
          style={[s.image, shouldFadeIcon(ObjBottomIcons.Sorted) && s.imageFade]}
          onPress={()=>onAddIconToDisplay(ObjBottomIcons[ObjBottomIcons.Sorted])}
          source={require('../../public/images/atoz.png')}></PressImage>
        <PressImage 
          pressStyle={gs.baseBiggerImageContainer}
          style={[s.image, shouldFadeIcon(ObjBottomIcons.Search) && s.imageFade]}
          onPress={()=>onAddIconToDisplay(ObjBottomIcons[ObjBottomIcons.Search])}
          source={require('../../public/images/search.png')}></PressImage>
        <PressImage 
          pressStyle={gs.baseBiggerImageContainer}
          style={[s.image, shouldFadeIcon(ObjBottomIcons.Pos) && s.imageFade]}
          onPress={()=>onAddIconToDisplay(ObjBottomIcons[ObjBottomIcons.Pos])}
          source={require('../../public/images/change.png')}></PressImage>
        <PressImage 
          pressStyle={gs.baseBiggerImageContainer}
          style={[s.image, shouldFadeIcon(ObjBottomIcons.IsLocked) && s.imageFade]}
          onPress={()=>onAddIconToDisplay(ObjBottomIcons[ObjBottomIcons.IsLocked])}
          source={require('../../public/images/lock.png')}></PressImage>
        <PressImage 
          pressStyle={gs.baseBiggerImageContainer}
          style={[s.image, shouldFadeIcon(ObjBottomIcons.Checked) && s.imageFade]}
          onPress={()=>onAddIconToDisplay(ObjBottomIcons[ObjBottomIcons.Checked])}
          source={require('../../public/images/checked.png')}></PressImage>
        <PressImage 
          pressStyle={gs.baseBiggerImageContainer}
          style={[s.image, shouldFadeIcon(ObjBottomIcons.Add) && s.imageFade]}
          onPress={()=>onAddIconToDisplay(ObjBottomIcons[ObjBottomIcons.Add])}
          source={require('../../public/images/add.png')}></PressImage>
      </>
    );
  }

  const inChangeLockOpen = () => {
    if(userPrefs.shouldLockOnOpen)
      onChangePrefs({...userPrefs, shouldLockOnOpen: false, shouldLockOnReopen: false});
    else
      onChangePrefs({...userPrefs, shouldLockOnOpen: true});
  }

  const onChangeLockReopen = () => {
    if(userPrefs.shouldLockOnReopen)
      onChangePrefs({...userPrefs, shouldLockOnReopen: false})
    else
      onChangePrefs({...userPrefs, shouldLockOnReopen: true, shouldLockOnOpen: true})
  }

  const getSettingsView = () => {
    return(
      <>
        <Text style={s.header}>SETTINGS:</Text>
        <Text style={s.subHeader}>General</Text>
        <PressText
          style={s.userPrefsContainerOn}
          textStyle={s.userPrefsTextOn}
          onPress={() => {onChangePrefs({...userPrefs, theme: userPrefs.theme === 'dark'?'light':'dark'})}}
          text={"Which theme? - " + (userPrefs.theme==='dark'? 'Dark.':'White.')}>
        </PressText>
        <PressText 
          style={userPrefs.shouldLockOnOpen? s.userPrefsContainerOn:s.userPrefsContainerOff}
          textStyle={userPrefs.shouldLockOnOpen? s.userPrefsTextOn:s.userPrefsTextOff}
          onPress={inChangeLockOpen}
          text={"Should lock app on first open? - " + (userPrefs.shouldLockOnOpen? 'Yes.':'No.')}>
        </PressText>
        <PressText 
          style={userPrefs.shouldLockOnReopen? s.userPrefsContainerOn:s.userPrefsContainerOff}
          textStyle={userPrefs.shouldLockOnReopen? s.userPrefsTextOn:s.userPrefsTextOff}
          onPress={onChangeLockReopen}
          text={"Should lock app every times it's open? - " + (userPrefs.shouldLockOnReopen? 'Yes.':'No.')}>
        </PressText>
        <PressText 
          style={userPrefs.vibrate? s.userPrefsContainerOn:s.userPrefsContainerOff}
          textStyle={userPrefs.vibrate? s.userPrefsTextOn:s.userPrefsTextOff}
          onPress={() => {onChangePrefs({...userPrefs, vibrate: !userPrefs.vibrate})}}
          text={"Should button vibrate? - " + (userPrefs.vibrate? 'Yes.':'No.')}>
        </PressText>
        <PressText 
          style={userPrefs.autoSync? s.userPrefsContainerOn:s.userPrefsContainerOff}
          textStyle={userPrefs.autoSync? s.userPrefsTextOn:s.userPrefsTextOff}
          onPress={() => {onChangePrefs({...userPrefs, autoSync: !userPrefs.autoSync})}}
          text={"Should automatically sync? - " + (userPrefs.autoSync? 'Yes.':'No.')}>
        </PressText>
        <Text style={s.subHeader}>Objectives - Fast Access Icons</Text>
        <View style={s.objectiveIconContainer}>
          {getObjectiveIconsView()}
        </View>
        <Text style={s.subHeader}>Location</Text>
        <PressText 
          style={userPrefs.allowLocation? s.userPrefsContainerOn:s.userPrefsContainerOff}
          textStyle={userPrefs.allowLocation? s.userPrefsTextOn:s.userPrefsTextOff}
          onPress={()=>{onChangePrefs({...userPrefs, allowLocation: !userPrefs.allowLocation})}}
          text={"Use location? - " + (userPrefs.allowLocation? 'Yes.':'No.')}>
        </PressText>
        <PressText 
          style={userPrefs.warmLocationOff? s.userPrefsContainerOn:s.userPrefsContainerOff}
          textStyle={userPrefs.warmLocationOff? s.userPrefsTextOn:s.userPrefsTextOff}
          onPress={()=>{onChangePrefs({...userPrefs, warmLocationOff: !userPrefs.warmLocationOff})}}
          ellipsizeMode="head"
          numberOfLines={3}
          text={"Warm about necessity of location of proximity of location? - " + (userPrefs.warmLocationOff? 'Yes.':'No.')}>
        </PressText>
      </>
    )
  }

  const s = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.backgroundcolor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    contentContainer:{
      flex: 1,
      height: '100%',
      width: '100%',
      backgroundColor: t.backgroundcolor,
    },
    scrollView:{
      paddingBottom: 25,
      paddingTop: 10,
      paddingHorizontal: 10,
    },
    header:{
      color: t.textcolor,
      fontSize: 25,
      fontWeight: 'bold',
      marginTop: 15,
    },
    subHeader:{
      textAlign: 'center',
      color: t.textcolor,
      fontSize: 15,
      marginTop: 10,
    },
    userTextDef:{
      fontSize: 15,
      width: '50%',
      color: t.textcolor,
    },
    userText: {
      fontSize: f.userViewText.fontSize,
      width: '50%',
      color: t.textcolor,
    },
    //^ TOOLS ----------------
    prefsTools:{
      flexDirection: 'row',
      alignItems: "center",
      padding: 5,
      marginTop: 10,
      backgroundColor: t.backgroundcolordarker,

      borderRadius: 2,
      borderColor: t.bordercolorfade,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    prefsToolsText:{
      marginVertical: 5,
      marginHorizontal: 5,
      color: t.textcolor,
    },
    //^ Prefs buttons ----------------
    objectiveIconContainer:{
      flexDirection: 'row',
      flexWrap: "wrap",
      minHeight: 45,
    },
    userPrefsContainerOn:{
      flexDirection: 'row',
      padding: 5,
      marginTop: 10,
      backgroundColor: t.backgroundcolordarker,
      alignItems: "center",

      borderRadius: 2,
      borderColor: t.bordercolorfade,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    userPrefsContainerOff:{
      padding: 5,
      marginTop: 10,

      borderRadius: 2,
      borderColor: t.bordercolorfade,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    userPrefsTextOn:{
      flex: 1,
      flexWrap: "wrap",
      marginVertical: 5,
      marginHorizontal: 5,
      color: t.textcolor,
    },
    userPrefsTextOff:{
      flex: 1,
      flexWrap: "wrap",
      marginVertical: 5,
      marginHorizontal: 5,
      color: t.textcolorfade,
    },
    objectivesText: {
      fontSize: 25,
      marginBottom: 30,
      width: '90%',
      color: t.textcolor,
      textAlign: 'center',
    },
    image:{
      ...gs.baseImage,
      tintColor: t.icontint,
    },
    imageFade:{
      ...gs.baseImage,
      tintColor: t.icontintfade,
    },
    backupImage:{
      ...gs.baseSmallImage,
      tintColor: t.icontint,
    },
  });

  return (
    <View style={s.container}>
      <View style={s.contentContainer}>
        <ScrollView style={s.scrollView} persistentScrollbar={true}>
          {showLoginStuff && <LoginView viewType="Full"></LoginView>}
          {getToolsView()}
          {getSettingsView()}
          <View style={{height: 100}}></View>
        </ScrollView>
      </View>
    </View>
  );
};

export default UserView;