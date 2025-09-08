import { View, StyleSheet, Text, TextInput, Vibration , Pressable, BackHandler} from "react-native";
import { useUserContext } from "../Contexts/UserContext";
import React, { useEffect, useState } from "react";
import PressText from "../PressText/PressText";
import Loading from "../Loading/Loading";
import { colorPalette, dark, globalStyle as gs } from "../Colors";
import { MessageType, Pattern, UserPrefs, Views } from "../Types";
import { useLogContext } from "../Contexts/LogContext";
import { useRequestContext } from "../Contexts/RequestContext";
import PressImage from "../PressImage/PressImage";
import Constants from 'expo-constants';

import * as FileSystem from "expo-file-system";
import { useStorageContext } from "../Contexts/StorageContext";
const saf = FileSystem.StorageAccessFramework;

export interface UserViewProps {
  syncObjectivesList: () => void,
}
const UserView = (props: UserViewProps) => {
  const { identityApi, objectivesApi } = useRequestContext();
  const { log, popMessage } = useLogContext();
  const { writeCurrentView } = useUserContext();
  const { storage } = useStorageContext();
  const { theme: t, fontTheme: f, user, writeUser, writeJwtToken, userPrefs, writeUserPrefs, clearAllData } = useUserContext();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [isShowingPassword, setIsShowingPassword] = useState<boolean>(false);
  const [isBackingUpData, setIsBackingUpData] = useState<boolean>(false);

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

  const login = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    const loginBody = { Email: email.trim(), Password: password.trim() };

    if(loginBody.Email === ""){
      popMessage("Type email to login!");
      return;
    }

    if(loginBody.Password === ""){
      popMessage("Type password to login!");
      return;
    }

    setIsLogging(true);
    try {
      const data = await identityApi.login(JSON.stringify(loginBody), () => {});

      if(data && data.User && data.Token) {
        writeUser(data.User);
        writeJwtToken(data.Token);
        setIsLogged(true);

        props.syncObjectivesList();
      }
    } 
    catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsLogging(false);
  }

  const logout = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Wrong);
    await clearAllData();
    setIsLogged(false);
  }
  
  const onChangeEmail = (value: string) => {
    setEmail(value);
  }

  const onChangePassword = (value: string) => {
    setPassword(value);
  }

  const onChangePrefs = (newPrefs: UserPrefs) => {
    if(newPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    writeUserPrefs(newPrefs);
  }

  const backupData = async () => {
    setIsBackingUpData(true);
    const data = await objectivesApi.backupData(() => {});

    if(data){
      popMessage("Backup Ok");
    }
    else{
      popMessage("Backup Fail");
    }

    setIsBackingUpData(false);
  }

  const saveToJSON = async () => {
    try {
      const perm = await saf.requestDirectoryPermissionsAsync();
      if (!perm.granted) throw new Error("Permissão negada");
      const dir = perm.directoryUri;

      const objectives = await storage.readObjectives();
      const items = await storage.readItems();

      await writeSafFile(dir, "objectives.json", JSON.stringify(objectives, null, 2));
      await writeSafFile(dir, "items.json", JSON.stringify(items, null, 2));

      log.g('Salvo');
      popMessage('Salvo.');
    } 
    catch (err) {
      popMessage('Erro salvando arquivo.', MessageType.Error);
      log.r('Error: ' + err);  
    }
  }

  async function writeSafFile(directoryUri: string, name: string, content: string) {
    try {
      const files = await saf.readDirectoryAsync(directoryUri);
      const existing = files.find((u) => u.endsWith("/" + name));
      if (existing) await saf.deleteAsync(existing);
    } catch {
      popMessage('Erro ao salvar os dados.', MessageType.Error);
    }

    const fileUri = await saf.createFileAsync(directoryUri, name, "application/json");
    await saf.writeAsStringAsync(fileUri, content);
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
      paddingHorizontal: 10,
      backgroundColor: t.backgroundcolor,
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
    userContainer: {
      marginTop: 10,
      justifyContent: 'center',
    },
    userView: {
      flexDirection: 'row',
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
    userPrefsContainerOn:{
      padding: 5,
      marginTop: 10,
      backgroundColor: t.backgroundcolordarker,
      flexDirection: 'row',
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
      marginVertical: 5,
      marginHorizontal: 5,
      color: t.textcolor,
    },
    userPrefsTextOff:{
      marginVertical: 5,
      marginHorizontal: 5,
      color: t.textcolorfade,
    },
    logoutView:{
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 30,
    },
    logoutButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: t.logoutbuttonbk,
      paddingVertical: 15,
      paddingHorizontal: 50,
      
      borderRadius: 2,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: colorPalette.black,
    },
    logoutButtonText: {
      color: colorPalette.black,
      fontSize: f.userViewLogoutButton.fontSize,
    },
    loginContainer:{
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    objectivesText: {
      fontSize: 25,
      marginBottom: 30,
      width: '90%',
      color: t.textcolor,
      textAlign: 'center',
    },
    emailInput:{
      height: 50,
      width: '90%',
      color: t.textcolor,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: t.bordercolorfade,
      borderRadius: 2,
      padding: 10,
      marginVertical: 10,
    },
    passwordContainer:{
      height: 50,
      width: '90%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    passwordInput: {
      height: 50,
      flex: 1,
      color: t.textcolor,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: t.bordercolorfade,
      borderRadius: 2,
      padding: 10,
    },
    image:{
      ...gs.baseImage,
      tintColor: t.icontint,
    },
    backupImage:{
      ...gs.baseSmallImage,
      tintColor: t.icontint,
    },
    loginButton: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '90%',
      margin: 10,
      color: t.textcolor,
      backgroundColor: t.loginbuttonbk,
      padding: 10,

      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: t.bordercolorfade,
      borderRadius: 2,
    },
    loginButtonText: {
      fontSize: 18,
    },
  });

  return (
    <View style={s.container}>
      {isLogging?
        <Loading theme={dark}></Loading>
        :
        (user?
          <>
            <View style={s.contentContainer}>
              <Text style={s.header}>USER:</Text>
              <View style={s.userContainer}>
                <View style={s.userView}>
                  <Text style={s.userTextDef}>Build:</Text>
                  <Text style={s.userText}>{Constants.easBuildNumber}</Text>
                </View>
                <View style={s.userView}>
                  <Text style={s.userTextDef}>Email:</Text>
                  <Text style={s.userText}>{user === null? "no user": user.Email}</Text>
                </View>
                <View style={s.userView}>
                  <Text style={s.userTextDef}>Username:</Text>
                  <Text style={s.userText}>{user === null? "no user": user.Username}</Text>
                </View>
                <View style={s.userView}>
                  <Text style={s.userTextDef}>Role:</Text>
                  <Text style={s.userText}>{user === null? "no user": user.Role}</Text>
                </View>
                <View style={s.userView}>
                  <Text style={s.userTextDef}>Status:</Text>
                  <Text style={s.userText}>{user === null? "no user": user.Status}</Text>
                </View>
              </View>
              <Text style={s.header}>TOOLS:</Text>
              {user.Role === 'Admin' &&
              <PressText 
                style={s.prefsTools}
                textStyle={s.prefsToolsText}
                onPress={() => {backupData()}}
                isLoading={isBackingUpData}
                imageStyle={s.backupImage}
                imageSource={require('../../public/images/backup.png')}
                text={"Save full data on AWS S3."}
                defaultStyle={{itemtextfade: colorPalette.green}}></PressText>}
              <PressText 
                style={s.prefsTools}
                textStyle={s.prefsToolsText}
                onPress={() => {saveToJSON()}}
                imageStyle={s.backupImage}
                imageSource={require('../../public/images/download-files.png')}
                text={"Download a JSON file of your data."}
                defaultStyle={{itemtextfade: colorPalette.green}}
                ></PressText>
              <Text style={s.header}>SETTINGS:</Text>
              <Text style={s.subHeader}>General</Text>
              <PressText 
                style={s.userPrefsContainerOn}
                textStyle={s.userPrefsTextOn}
                onPress={() => onChangePrefs({...userPrefs, theme: userPrefs.theme === 'dark'?'light':'dark'})}
                text={"Which theme? - " + (userPrefs.theme==='dark'? 'Dark.':'White.')}
                defaultStyle={{itemtextfade: colorPalette.green}}></PressText>
              <PressText 
                style={userPrefs.vibrate? s.userPrefsContainerOn:s.userPrefsContainerOff}
                textStyle={userPrefs.vibrate? s.userPrefsTextOn:s.userPrefsTextOff}
                onPress={() => onChangePrefs({...userPrefs, vibrate: !userPrefs.vibrate})}
                text={"Should button vibrate? - " + (userPrefs.vibrate? 'Yes.':'No.')}
                defaultStyle={{itemtextfade: colorPalette.green}}>
              </PressText>
              <PressText 
                style={userPrefs.autoSync? s.userPrefsContainerOn:s.userPrefsContainerOff}
                textStyle={userPrefs.autoSync? s.userPrefsTextOn:s.userPrefsTextOff}
                onPress={() => onChangePrefs({...userPrefs, autoSync: !userPrefs.autoSync})}
                text={"Should automatically sync? - " + (userPrefs.autoSync? 'Yes.':'No.')}
                defaultStyle={{itemtextfade: colorPalette.green}}>
              </PressText>
              <Text style={s.subHeader}>Location</Text>
              <PressText 
                style={userPrefs.allowLocation? s.userPrefsContainerOn:s.userPrefsContainerOff}
                textStyle={userPrefs.allowLocation? s.userPrefsTextOn:s.userPrefsTextOff}
                onPress={()=>onChangePrefs({...userPrefs, allowLocation: !userPrefs.allowLocation})}
                text={"Use location? - " + (userPrefs.allowLocation? 'Yes.':'No.')}
                defaultStyle={{itemtextfade: colorPalette.green}}>
              </PressText>
            </View>
            <View style={s.logoutView}>
              <PressText text={'Logout'} textStyle={s.logoutButtonText} style={s.logoutButton} onPress={logout} defaultStyle={{itemtextfade: colorPalette.green}}></PressText>
            </View>
          </>
        :
          <View style={s.loginContainer}>
            <Text style={s.objectivesText}>
              Objectives
            </Text>

            <TextInput autoCapitalize="none" placeholder="Email" placeholderTextColor={'grey'} style={s.emailInput} onChangeText={onChangeEmail}></TextInput>
            <View style={s.passwordContainer}>
              <TextInput autoCapitalize="none" placeholder="Password" placeholderTextColor={'grey'} style={s.passwordInput} secureTextEntry={!isShowingPassword} onChangeText={onChangePassword}></TextInput>
              {!isShowingPassword && <PressImage onPress={()=>{setIsShowingPassword(!isShowingPassword)}} style={s.image} pressStyle={gs.baseImageContainer} source={require('../../public/images/show.png')}></PressImage>}
              {isShowingPassword && <PressImage onPress={()=>{setIsShowingPassword(!isShowingPassword)}} style={s.image} pressStyle={gs.baseImageContainer} source={require('../../public/images/hide.png')}></PressImage>}
            </View>
            {isLogging?
            <Loading theme={dark}></Loading>
            :
            <>
              {/* <Pressable style={s.loginButton} onPress={login}>
                <Text style={s.loginButtonText}>Login</Text>
              </Pressable>
              <PressText 
                style={s.userPrefsContainerOn}
                textStyle={s.userPrefsTextOn}
                onPress={() => onChangePrefs({...userPrefs, theme: userPrefs.theme === 'dark'?'light':'dark'})}
                text={"Which theme? - " + (userPrefs.theme==='dark'? 'Dark.':'White.')}
                defaultStyle={{itemtextfade: colorPalette.green}}></PressText> */}
            </>}
          </View>
        )
      }
    </View>
  );
};

export default UserView;