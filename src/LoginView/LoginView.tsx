import { View, StyleSheet, Text, TextInput, Vibration , TextInputSubmitEditingEvent } from "react-native";
import React, { useEffect, useEffectEvent, useRef, useState } from "react";
import PressText from "../PressText/PressText";
import {Loading} from "../Loading/Loading";

import { useUserContext } from "../Contexts/UserContext";
import { useLogContext } from "../Contexts/LogContext";
import { useRequestContext } from "../Contexts/RequestContext";
import { globalStyle as gs } from "../Colors";
import { Item, MessageType, Objective, ObjectiveList, Pattern, TwoFactorAuthRequest, Views } from "../Types";
import PressImage from "../PressImage/PressImage";
import { Images } from "../Images";
import * as FileSystem from 'expo-file-system';
import { useStorageContext } from "../Contexts/StorageContext";
import ButtonView from "../ButtonView/ButtonView";
import { cp } from "../ColorPalette";
import ReloggingView from "./ReloggingView";
import TwoFAView from "./TwoFAView";

interface StorageAccessFrameworkType {
  requestDirectoryPermissionsAsync: () => Promise<{ granted: boolean; directoryUri: string }>;
  createFileAsync: (dirUri: string, fileName: string, mimeType: string) => Promise<string>;
  writeAsStringAsync: (fileUri: string, content: string) => Promise<void>;
  readDirectoryAsync: (dirUri: string) => Promise<string[]>;
  deleteAsync: (uri: string) => Promise<void>;
}

const saf: StorageAccessFrameworkType = (FileSystem as any).StorageAccessFramework;

export interface LoginViewProps {
  viewType: 'Full'|'Image',
}

export const LoginView = (props: LoginViewProps = { viewType: 'Full' }) => {
  const { identityApi, objectivesApi } = useRequestContext();
  const { storage,  } = useStorageContext();
  const { writeCurrentView } = useUserContext();
  const { log, popMessage } = useLogContext();
  const { viewType } = props;
  const { 
    theme: t,
    fontTheme: f,
    user, userPrefs, writeUser, writeJwtToken, deleteJwtToken, writeTwoFAToken, isLogged, isAuthorized, writeObjectives, writeItems, writeLastSync, writeUserPrefs,
    availableTags, selectedTags, writeAvailableTags, writeSelectedTags,
    clearAllData, vibOk, vibWrong, lastSync, objectives, readItems, deletedObjectives, deletedItems, deleteDeletedObjectives, deleteDeletedItems,
  } = useUserContext();

  const [inputEmail, setInputEmail] = useState<string>('');
  const [inputPass, setInputPass] = useState<string>('');
  const [isShowingPassword, setIsShowingPassword] = useState<boolean>(false);
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [isBackingUpData, setIsBackingUpData] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const [isEmailWrong, setIsEmailWrong] = useState<boolean>(false);
  const [isPasswordWrong, setIsPasswordWrong] = useState<boolean>(false);

  const [showRequireTwoFAView, setShowRequireTwoFAView] = useState<boolean>(false);

  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);

  useEffect(() => {
  }, [])

  const onChangeEmail = (value: string) => {
    setIsEmailWrong(false);
    setInputEmail(value);
  }

  const onChangePassword = (value: string) => {
    setIsPasswordWrong(false);
    setInputPass(value);
  }

  const getLogoutView = () => {
    if(userPrefs.isRightHand){
      return(
        <View style={s.logoutView}>
          <ButtonView text='Logout' onPress={logout} type='reset'/>
        </View>
      )
    }
    else{
      return(
        <View style={s.logoutView}>
          <ButtonView text='Logout' onPress={logout} type='reset'/>
        </View>
      )
    }
  }

  const syncTags = (objectives: Objective[]) => {
    //^ Download tags, unique or not.
    let download: string[] = [];
    objectives.forEach((obj: any) => {
      if (Array.isArray(obj.Tags)) {
        download.push(...obj.Tags);
      }
    });
    //^ All unique downloaded tags.
    const uniqueDownloadTags = Array.from(new Set(download));
    //^ New tags that'll be selected.
    const downloadTagsNotInAvailable = uniqueDownloadTags.filter((tag) => !availableTags.includes(tag));
    //^ Remove selected tags that don't exist anymore.
    const selectedTagsStillOnAvailable = selectedTags.filter((tag) => uniqueDownloadTags.includes(tag));
    //^ Write the downloaded unique tags.
    writeAvailableTags(uniqueDownloadTags);
    // ^ Write the selected tags that still exist and the downloaded ones.
    writeSelectedTags([...selectedTagsStillOnAvailable, ...downloadTagsNotInAvailable]);
  }

  const syncObjectivesList = async () => {
    try {
      if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

      let syncObjectives: Objective[] = [];
      let syncItems: Item[] = [];
      if(lastSync){ //^ If there is a last sync date, sync only the new objectives and items
        for(let i = 0; i < objectives.length; i++){
          const current = objectives[i];
          if(current.LastModified > lastSync){
            syncObjectives.push(current);
          }
          else{
          }
          const objItems = await readItems(objectives[i].ObjectiveId);
    
          for(let j = 0; j < objItems.length; j++) {
            const currentItem = objItems[j];
            if(currentItem.LastModified > lastSync){
              syncItems.push(currentItem);
            }
            else{
            }
          }
        }
      }
      else{//^ If there is no last sync date, sync all objectives and items
        syncObjectives = [...objectives];
        for(let i = 0; i < syncObjectives.length; i++){
          const objItems = await readItems(syncObjectives[i].ObjectiveId);
          syncItems.push(...objItems);
        }
      }
  
      const objectiveList: ObjectiveList = {
        Objectives: syncObjectives,
        Items: syncItems,
        DeleteObjectives: deletedObjectives,
        DeleteItems: deletedItems,
        LastModified: lastSync? lastSync: undefined,
      }
  
      setIsSyncing(true);
      const data = await objectivesApi.syncObjectivesList(objectiveList, handleRequestError);
      
      if(data !== null && data !==undefined && data.Objectives){
        syncTags(data.Objectives);
        
        const sorted = data.Objectives.sort((a: Objective, b: Objective)=>a.Pos-b.Pos);
        writeObjectives(sorted);
        
        if(data.Items) {
          data.Objectives.forEach((currentObj: any) => {
            const objItems = data.Items?.filter((item: any) => item.UserIdObjectiveId.slice(40) === currentObj.ObjectiveId);
            if(objItems) writeItems(currentObj.ObjectiveId, objItems);
          });
        }
        deleteDeletedObjectives();
        deleteDeletedItems();
        
        popMessage('Sync done.', MessageType.Positive);
        setIsSyncing(false);
        setTimeout(() => {
          writeLastSync((new Date()).toISOString());
        }, 10000);
  
        return;
      }
  
      popMessage('Sync failed.', MessageType.Error);
      setIsSyncing(false);
    } catch (err) {
      setIsSyncing(false);
    } 
  }

  const handleRequestError = (code: number) => {
    if(code === 401){
      deleteJwtToken();
      setInputEmail(user.Email);
      writeCurrentView(Views.LoginView);
    }
  }

  const isValidEmail = (input: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(input);
  }

  const testBeforeLogin = async (email: string, pass: string) => {
    const loginBody = { Email: email.trim(), Password: pass.trim() };

    if(!isValidEmail(loginBody.Email)){
      popMessage("Enter a valid email address!", MessageType.Alert);
      vibWrong();
      emailRef.current?.focus();
      return;
    }

    if(loginBody.Email === ""){
      if(loginBody.Password !== "") popMessage("Enter an email to log in!", MessageType.Alert);
      if(loginBody.Password !== "") vibWrong();
      emailRef.current?.focus();
      return;
    }

    if(loginBody.Password === ""){
      if(loginBody.Email === "") popMessage("Enter a password to log in!", MessageType.Alert);
      if(loginBody.Email === "") vibWrong();
      passRef.current?.focus();
      return;
    }
    
    await login(loginBody);
  }

  const login = async (loginBody: {Email: string, Password: string}) => {
    setInputPass('');
    setIsLogging(true);
    vibOk();

    try {
      const data = await identityApi.login(JSON.stringify(loginBody));
      if(data){
        /// Fist require 2FA
        if(data.RequiringTwoFA){
          if(data.TwoFATempToken && data.TwoFATempToken.trim() !== ''){
            writeTwoFAToken(data.TwoFATempToken);
            setShowRequireTwoFAView(true);
          }
          else{
            popMessage('There was a problem with requiring 2FA code.', MessageType.Error);
          }
        }
        else{
          /// Normal login, without 2FA
          if(data.User && data.Token){
            writeUser(data.User);
            writeJwtToken(data.Token);

            syncObjectivesList();
          }
          else{
            popMessage('Login was ok but no data was returned.', MessageType.Error);
          }
        }
      }
    } catch (err) {
      log.err(JSON.stringify(err));
    }

    setIsLogging(false);
  }
  
  const logout = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Wrong);
    await clearAllData();
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

  const getSyncImage = () => {
    return(
      <PressImage
        onPress={syncObjectivesList}
        source={Images.Sync}
        disable={!isLogged || !isAuthorized}
        isLoading={isSyncing}
        onPressDisabled={() => {
          popMessage('Need to login to sync.', MessageType.Alert);
        }}
      />
    )
  }

  const getFullView = () => {
    if(showRequireTwoFAView){
      return <TwoFAView login={testBeforeLogin} back={() => {setShowRequireTwoFAView(false); if(isLogged && isAuthorized) syncObjectivesList();}}/>
    }
    else{
      if(isLogged){
        if(isAuthorized){
          return getLoggedView();
        }
        else{
          return <ReloggingView email={user.Email} login={testBeforeLogin} logout={logout}/>
        }
      }
      else{
        return getLoggingView();
      }
    }
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

  // view

  const getLoggedView = () => {
    return(
        <View style={s.loggerContainer}>
          <Text style={s.header}>USER</Text>
          <View style={s.userContainer}>
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
            <View style={s.userView}>
              <Text style={s.userTextDef}>2FA:</Text>
              <Text style={s.userText}>{user === null? "no user": (user.TwoFAActive?'Active':'Not Active')}</Text>
            </View>
            <Text style={s.header}>TOOLS:</Text>
            <PressText 
              style={s.prefsTools}
              textStyle={s.prefsToolsText}
              onPress={() => {syncObjectivesList()}}
              isLoading={isSyncing}
              imageStyle={s.smallImage}
              imageSource={Images.Sync}
              text={"Sync data."}>
            </PressText>
            <PressText 
              style={s.prefsTools}
              textStyle={s.prefsToolsText}
              onPress={() => {backupData()}}
              isLoading={isBackingUpData}
              imageStyle={s.smallImage}
              imageSource={Images.Backup}
              text={"Save full data on AWS S3."}>
            </PressText>
            {saf !== undefined && <PressText 
              style={s.prefsTools}
              textStyle={s.prefsToolsText}
              onPress={() => {saveToJSON()}}
              imageStyle={s.backupImage}
              imageSource={Images.DownloadFiles}
              text={"Download a JSON file of your data."}
            ></PressText>}
              {getLogoutView()}
          </View>
        </View>
      )
  }

  const getPasswordInputView = () => {
    return(
      <View style={s.passwordContainer}>
        {!userPrefs.isRightHand && <PressImage onPress={()=>{setIsShowingPassword(!isShowingPassword)}} source={isShowingPassword?Images.Hide:Images.Show}/>}
        <TextInput ref={passRef} autoCapitalize="none" placeholder="Password" placeholderTextColor={t.textcolorfade} style={s.passwordInput} secureTextEntry={!isShowingPassword} onChangeText={onChangePassword} onSubmitEditing={() => testBeforeLogin(inputEmail, inputPass)}></TextInput>
        {userPrefs.isRightHand && <PressImage onPress={()=>{setIsShowingPassword(!isShowingPassword)}} source={isShowingPassword?Images.Hide:Images.Show}/>}
      </View>
    )
  }

  const getLoggingView = () => {
    return(
      <View style={s.loginContainer}>
        <Text style={s.header}>{'LOGIN'}</Text> 
          <Loading isLoading={isLogging}>
            <View style={s.emailContainer}>
              <TextInput
                ref={emailRef}
                autoCapitalize="none"
                placeholder="Email"
                placeholderTextColor={t.textcolorfade}
                style={s.emailInput}
                onChangeText={onChangeEmail}
                onSubmitEditing={() => testBeforeLogin(inputEmail, inputPass)}/>
            </View>
            {getPasswordInputView()}
            <View style={s.logoutView}>
              <ButtonView text={'Login'} onPress={() => testBeforeLogin(inputEmail, inputPass)} type='foward'/>
            </View>
          </Loading>
      </View>
    )
  }
  const s = StyleSheet.create({
    header:{
      color: t.textcolor,
      fontSize: 25,
      fontWeight: 'bold',
      paddingVertical: 15,
    },
    subHeader:{
      color: t.textcolor,
      fontSize: 15,
      marginBottom: 10,
    },
    prefsTools:{
      flexDirection: 'row',
      alignItems: "center",
      padding: 5,
      marginTop: 5,
      paddingLeft: 10,
      backgroundColor: t.backgroundcolordarker,

      borderRadius: 2,
      borderColor: t.bordercolorfade,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    prefsToolsText:{
      marginVertical: 5,
      marginHorizontal: 10, 
      color: t.textcolor,
    },
    userTextDef:{
      width: '50%',
      fontSize: 15,
      color: t.textcolor,
    },
    userText: {
      width: '50%',
      fontSize: f.userViewText.fontSize,
      color: t.textcolor,
    },
    userContainer: {
      flex: 1,
    },
    userInformationCard:{
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    userView: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 2,
      paddingVertical: 2,
      paddingHorizontal: 5,
    },
    logoutView:{
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
    },
    refreshTokenButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: t.refreshtokenbuttonbk,
      paddingVertical: 15,
      paddingHorizontal: 20,
      margin: 10,
      
      borderRadius: 2,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: cp.black,
    },
    refreshTokenButtonText: {
      color: cp.black,
      fontSize: f.userViewLogoutButton.fontSize,
    },
    loginContainer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      
      paddingHorizontal: 10,
      paddingVertical: 20,
    },
    loggerContainer:{
      flex: 1,
      paddingHorizontal: 10,
    },
    emailContainer:{
      minHeight: 50,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 10,
    },
    emailInput:{
      flex: 1,
      minHeight: 50,
      color: t.textcolor,
      padding: 10,

      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: isEmailWrong?t.cancelicontint:t.bordercolorfade,
      borderRadius: 2,
    },
    passwordContainer:{
      minHeight: 50,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 10,
    },
    passwordInput: {
      height: 50,
      flex: 1,
      color: t.textcolor,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: isPasswordWrong?t.cancelicontint:t.bordercolorfade,
      borderRadius: 2,
      padding: 10,
    },
    smallImage:{
      ...gs.baseSmallImage,
      tintColor: t.icontint,
    },
    backupImage:{
      ...gs.baseSmallImage,
      tintColor: t.icontint,
    },
  })

  if(viewType === "Image")
    return(getSyncImage())
  else if(viewType === 'Full')
    return(getFullView())
  else
    return <Text>ERROR</Text>
}