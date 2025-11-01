import { View, StyleSheet, Text, TextInput, Vibration , Pressable, BackHandler, ScrollView, NativeSyntheticEvent, TextInputSubmitEditingEventData, TextInputSubmitEditingEvent} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import PressText from "../PressText/PressText";
import Loading from "../Loading/Loading";

import { useUserContext } from "../Contexts/UserContext";
import { useLogContext } from "../Contexts/LogContext";
import { useRequestContext } from "../Contexts/RequestContext";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { colorPalette, dark, globalStyle as gs } from "../Colors";
import { Item, MessageType, Objective, ObjectiveList, Pattern } from "../Types";
import PressImage from "../PressImage/PressImage";

export interface LoginViewProps {
  viewType: 'Full'|'Image'
}

const LoginView = (props: LoginViewProps = { viewType: 'Full' }) => {
  const { identityApi, objectivesApi } = useRequestContext();
  const { log, popMessage } = useLogContext();
  const { viewType } = props;
  const { 
    theme: t,
    fontTheme: f,
    user, userPrefs, writeUser, writeJwtToken, writeObjectives, writeItems, writeLastSync, writeUserPrefs,
    availableTags, selectedTags, writeAvailableTags, writeSelectedTags,
    clearAllData, lastSync, objectives, readItems, deletedObjectives, deletedItems, deleteDeletedObjectives, deleteDeletedItems,
  } = useUserContext();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isShowingPassword, setIsShowingPassword] = useState<boolean>(false);
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [isBackingUpData, setIsBackingUpData] = useState<boolean>(false);const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [doneSync, setDoneSync] = useState<boolean>(false);
  const [failedSync, setFailedSync] = useState<boolean>(false);
  const [isLambdaCold, setIsLambdaCold] = useState<boolean>(false);
  const [isServerUp, setIsServerUp] = useState<boolean>(false);

  const [isEmailWrong, setIsEmailWrong] = useState<boolean>(false);
  const [isPasswordWrong, setIsPasswordWrong] = useState<boolean>(false);

  const emailRef = useRef<TextInput>(null);
  const passRef = useRef<TextInput>(null);

  useEffect(() => {
    if(user.Email !== '') {
      setIsLogged(true);
    }
  },[])

  const onChangeEmail = (value: string) => {
    setIsEmailWrong(false);
    setEmail(value);
  }

  const onChangePassword = (value: string) => {
    setIsPasswordWrong(false);
    setPassword(value);
  }

  const getLogoutView = () => {
    return(
      <View style={s.logoutView}>
        <PressText text={'Logout'} textStyle={s.logoutButtonText} style={s.logoutButton} onPress={logout} defaultStyle={{itemtextfade: colorPalette.green}}></PressText>
      </View>
    )
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
      setFailedSync(false);
      setDoneSync(false);
      
      let syncObjectives: Objective[] = [];
      let syncItems: Item[] = [];
      if(lastSync){ //^ If there is a last sync date, sync only the new objectives and items
        for(let i = 0; i < objectives.length; i++){
          const current = objectives[i];
          let objectiveLastModified = new Date(current.LastModified);
  
          if(objectiveLastModified > lastSync){
            syncObjectives.push(current);
          }
          else{
          }
          const objItems = await readItems(objectives[i].ObjectiveId);
    
          for(let j = 0; j < objItems.length; j++) {
            const currentItem = objItems[j];
            let itemLastModified = new Date(currentItem.LastModified);
            if(itemLastModified > lastSync){
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
      }
  
      setIsSyncing(true);
      //^ Sync all
      const data = await objectivesApi.syncObjectivesList(objectiveList);
      
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
        
        popMessage('Sync done.');
        setIsSyncing(false);
        setDoneSync(true);
        setTimeout(() => {
          writeLastSync(new Date());
          setDoneSync(false);
        }, 10000);
  
        return;
      }
  
      popMessage('Sync failed.', MessageType.Error);
      setIsSyncing(false);
      setFailedSync(true);
      setTimeout(() => {
        setFailedSync(false);
      }, 10000);
    } catch (err) {
      log.push(err);

      setIsSyncing(false);
      setFailedSync(true);
      setTimeout(() => {
        setFailedSync(false);
      }, 10000);
    } 
  }

  const isValidEmail = (input: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(input);
  }

  const login = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);

    const loginBody = { Email: email.trim(), Password: password.trim() };

    if(!isValidEmail(loginBody.Email)){
      popMessage("Type a valid email.", MessageType.Alert)
      return;
    }

    if(loginBody.Email === ""){
      popMessage("Type email to login!", MessageType.Alert);
      return;
    }

    if(loginBody.Password === ""){
      popMessage("Type password to login!", MessageType.Alert);
      return;
    }

    setIsLogging(true);
    try {
      const data = await identityApi.login(JSON.stringify(loginBody), () => {});

      if(data && data.User && data.Token) {
        writeUser(data.User);
        writeJwtToken(data.Token);
        setIsLogged(true);

        syncObjectivesList();
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
      <>
        {isSyncing &&  !isLambdaCold && <Loading theme={dark}></Loading>}
        {!isSyncing && !isLambdaCold && <PressImage pressStyle={gs.baseBiggerImageContainer} style={[s.bottomImage, failedSync&&s.cancelImage, doneSync&&s.doneImage]} onPress={syncObjectivesList} source={require('../../public/images/sync.png')}></PressImage>}
      </>
    )
  }
 
  const getUserDetailsView = () => {
    if(user.Email === ''){
      return getLoggingInView()
    }
    else{
      return(
      <>
        <Text style={s.header}>USER:</Text>
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
          <PressText 
            style={s.prefsTools}
            textStyle={s.prefsToolsText}
            onPress={() => {syncObjectivesList()}}
            isLoading={isSyncing}
            imageStyle={s.smallImage}
            imageSource={require('../../public/images/sync.png')}
            text={"Sync data."}>  
          </PressText>
          <PressText 
            style={s.prefsTools}
            textStyle={s.prefsToolsText}
            onPress={() => {backupData()}}
            isLoading={isBackingUpData}
            imageStyle={s.smallImage}
            imageSource={require('../../public/images/backup.png')}
            text={"Save full data on AWS S3."}>  
          </PressText>
          {getLogoutView()}
        </View>
      </>
    )}
  }

  const onEmailEnter = (event: TextInputSubmitEditingEvent) => {
    if(!isValidEmail(email.trim())){
      popMessage('Type a valid email.', MessageType.Alert);
      setIsEmailWrong(true);
      return;
    }

    if(password.trim() !== ''){
      login();
    }
    else{
      passRef.current?.focus();
    }
  }

  const onPasswordEnter = (event: TextInputSubmitEditingEvent) => {
    if(password.trim() === ''){
      popMessage('Type a password.', MessageType.Alert);
      setIsPasswordWrong(true);
      return;
    }

    if(email.trim() === ''){
      emailRef.current?.focus();
      return;
    }

    login();
  }

  const getLoggingInView = () => {
    return(
      <View style={s.loginContainer}>
        <Text style={s.header}>LOGIN:</Text>

        {isLogging?
          <Loading theme={dark}></Loading>
          :
          <>
            <View style={s.passwordContainer}>
              <TextInput ref={emailRef} autoCapitalize="none" placeholder="Email" placeholderTextColor={t.textcolorfade} style={s.emailInput} onChangeText={onChangeEmail} onSubmitEditing={onEmailEnter}></TextInput>
              </View>
            <View style={s.passwordContainer}>
              <TextInput ref={passRef} autoCapitalize="none" placeholder="Password" placeholderTextColor={t.textcolorfade} style={s.passwordInput} secureTextEntry={!isShowingPassword} onChangeText={onChangePassword} onSubmitEditing={onPasswordEnter}></TextInput>
              {!isShowingPassword && <PressImage onPress={()=>{setIsShowingPassword(!isShowingPassword)}} style={s.image} pressStyle={gs.baseImageContainer} source={require('../../public/images/show.png')}></PressImage>}
              {isShowingPassword && <PressImage onPress={()=>{setIsShowingPassword(!isShowingPassword)}} style={s.image} pressStyle={gs.baseImageContainer} source={require('../../public/images/hide.png')}></PressImage>}
            </View>
            <View style={s.logoutView}>
              <PressText text={'Login'} textStyle={s.loginButtonText} style={s.loginButton} onPress={login}></PressText>
            </View>
          </>
        }
      </View>
    )
  }

  const s = StyleSheet.create({
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
    prefsTools:{
      flexDirection: 'row',
      alignItems: "center",
      padding: 5,
      marginTop: 10,
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
      fontSize: 15,
      width: '50%',
      color: t.textcolor,
    },
    userText: {
      fontSize: f.userViewText.fontSize,
      width: '50%',
      color: t.textcolor,
    },
    userContainer: {
      marginTop: 10,
      justifyContent: 'center',
    },
    userView: {
      flexDirection: 'row',
    },
    logoutView:{
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 30,
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
      alignItems: "center",
      verticalAlign: "middle",
      width: '100%',
      padding: 5,
    },
    emailInput:{
      flex: 1,
      minHeight: 50,
      color: t.textcolor,
      padding: 10,
      marginVertical: 10,

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
    loginButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: t.loginbuttonbk,
      paddingVertical: 15,
      paddingHorizontal: 50,
      
      borderRadius: 2,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: colorPalette.black,
    },
    loginButtonText: {
      color: colorPalette.black,
      fontSize: f.userViewLogoutButton.fontSize,
    },
    bottomImage: {
      ...gs.baseImage,
      tintColor: t.icontint,
    },
    doneImage:{
      tintColor: t.doneicontint,
    },
    cancelImage:{
      tintColor: t.cancelicontint,
    },
    image:{
      ...gs.baseImage,
      tintColor: t.icontint,
    },
    imageFade:{
      ...gs.baseImage,
      tintColor: t.icontintfade,
    },
    smallImage:{
      ...gs.baseSmallImage,
      tintColor: t.icontint,
    },
  })

  if(viewType === "Image")
    return(getSyncImage())
  else
    return(getUserDetailsView())
}

export default LoginView;