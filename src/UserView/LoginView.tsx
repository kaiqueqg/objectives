import { View, StyleSheet, Text, TextInput, Vibration , Pressable, BackHandler, ScrollView, NativeSyntheticEvent, TextInputSubmitEditingEventData, TextInputSubmitEditingEvent} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import PressText from "../PressText/PressText";
import Loading from "../Loading/Loading";

import { useUserContext } from "../Contexts/UserContext";
import { useLogContext } from "../Contexts/LogContext";
import { useRequestContext } from "../Contexts/RequestContext";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { colorPalette, dark, globalStyle as gs } from "../Colors";
import { Item, MessageType, Objective, ObjectiveList, Pattern, TwoFactorAuthRequest } from "../Types";
import PressImage from "../PressImage/PressImage";
import ButtonView from "../BView/ButtonView";

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
  const [isBackingUpData, setIsBackingUpData] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [doneSync, setDoneSync] = useState<boolean>(false);
  const [failedSync, setFailedSync] = useState<boolean>(false);
  const [isLambdaCold, setIsLambdaCold] = useState<boolean>(false);

  const [isEmailWrong, setIsEmailWrong] = useState<boolean>(false);
  const [isPasswordWrong, setIsPasswordWrong] = useState<boolean>(false);
  const [isShowingRefreshTokenView, setIsShowingRefreshTokenView] = useState<boolean>(false);

  const [isRequiringTwoFA, setIsRequiringTwoFA] = useState<boolean>(false);
  const [requiringTwoFA, setRequiringTwoFA] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [twoFATempToken, setTwoFATempToken] = useState<string>('');

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

  const onChangeVerificationCode = (value: string) => {
    setVerificationCode(value);
  }

  const getLogoutView = () => {
    return(
      <View style={s.logoutView}>
        <PressText 
          style={s.refreshTokenButton}
          textStyle={s.refreshTokenButtonText}
          text={'Login again'}
          onPress={()=>{setIsShowingRefreshTokenView(!isShowingRefreshTokenView)}}
          defaultStyle={{itemtextfade: colorPalette.yellow}}>
        </PressText>
        {/* <ButtonView 
          textStyle={s.logoutButtonText}
          style={s.logoutButton}
          onPress={logout}
          defaultStyle={{ itemtextfade: colorPalette.green }}
          outStyle={undefined}
          inStyle={undefined}
          text={'Logout'}></ButtonView> */}
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

    const loginBody = { Email: isShowingRefreshTokenView?user.Email.trim():email.trim(), Password: password.trim() };

    if(!isValidEmail(loginBody.Email)){
      popMessage("Type a valid email.", MessageType.Alert);
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

    if(isShowingRefreshTokenView && loginBody.Email !== user.Email){
      popMessage('Different user that is logged in.', MessageType.Error);
      return;
    }

    setIsLogging(true);

    try {
      const data = await identityApi.login(JSON.stringify(loginBody));
      if(data){
        /// Fist require 2FA
        if(data.RequiringTwoFA){
          if(data.TwoFATempToken && data.TwoFATempToken.trim() !== ''){
            setTwoFATempToken(data.TwoFATempToken);
            setRequiringTwoFA(true);
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
            setIsLogged(true);

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
    setIsShowingRefreshTokenView(false);
  }

  const sendVerificationTwoFA = async () => {
    log.w('sendVerificationTwoFA')
    setIsRequiringTwoFA(true);

    if(!(/^[0-9]{6}$/.test(verificationCode))){
      setVerificationCode('');
      popMessage('Bad verification code. Must be 6 numbers.', MessageType.Alert);
      return;
    }
    
    if(twoFATempToken) {
      const sendRequest: TwoFactorAuthRequest = { TwoFACode: verificationCode, TwoFATempToken: twoFATempToken };
      const data = await identityApi.validateTwoFA(sendRequest);

      if(data && data.User && data.Token){
        writeUser(data.User);
        writeJwtToken(data.Token);
        setIsLogged(true);
        setRequiringTwoFA(false);

        syncObjectivesList();
      }
      else{
        popMessage('Login was ok but no data was returned.', MessageType.Error);
        logout();
      }
    }
    else{
      popMessage(`There's no token to try to approve 2FA code.`)
    }

    setIsRequiringTwoFA(false);
  }
  
  const logout = async () => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Wrong);
    await clearAllData();
    setIsLogged(false);
    setIsShowingRefreshTokenView(false);
    setRequiringTwoFA(false);
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
        {isSyncing &&  !isLambdaCold && <Loading></Loading>}
        {!isSyncing && !isLambdaCold && <PressImage pressStyle={gs.baseBiggerImageContainer} style={[s.bottomImage, failedSync&&s.cancelImage, doneSync&&s.doneImage]} onPress={syncObjectivesList} source={require('../../public/images/sync.png')}></PressImage>}
      </>
    )
  }
 
  const getUserDetailsView = () => {
    if(isLogged && !requiringTwoFA){
      return getLoggedView();
    }
    else if(requiringTwoFA){
      return requiringTwoFAView();
    }
    else if(!isLogged && !requiringTwoFA){
      return getLoggingInView();
    }
    else{
      <Text>Nothing</Text>
    }
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

  const requiringTwoFAView = () => {
    return(
      <View style={[s.loginContainer]}>
        <Text style={s.header}>{'2FA Verification code'}</Text>
        {isRequiringTwoFA?
          <Loading></Loading>
          :
          <>
            <View style={s.emailContainer}>
              <TextInput autoCapitalize="none" placeholder="6 digit number" placeholderTextColor={t.textcolorfade} style={s.emailInput} onChangeText={onChangeVerificationCode} onSubmitEditing={()=>{sendVerificationTwoFA()}}></TextInput>
            </View>
            <View style={s.logoutView}>
              <PressText text={'Send'} textStyle={s.loginButtonText} style={s.loginButton} onPress={()=>{}}></PressText>
            </View>
          </>
        }
      </View>
    )
  }

  const getLoggedView = () => {
    return(isShowingRefreshTokenView?
      getLoggingInView()
      :
      <>
        <Text style={s.header}>USER</Text>
        <View style={s.userContainer}>
          <View style={s.userInformationCard}>
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
    )
  }

  const getLoggingInView = () => {
    return(
      <View style={[s.loginContainer]}>
        <Text style={s.header}>{isShowingRefreshTokenView?'REFRESH TOKEN':'LOGIN'}</Text>
        {isLogging?
          <Loading></Loading>
          :
          <>
            <View style={s.emailContainer}>
              {isShowingRefreshTokenView?
              <TextInput style={s.emailInput} value={user.Email} editable={false}></TextInput>
              :
              <TextInput ref={emailRef} autoCapitalize="none" placeholder="Email" placeholderTextColor={t.textcolorfade} style={s.emailInput} onChangeText={onChangeEmail} onSubmitEditing={onEmailEnter}></TextInput>
              }
            </View>
            <View style={s.passwordContainer}>
              <TextInput ref={passRef} autoCapitalize="none" placeholder="Password" placeholderTextColor={t.textcolorfade} style={s.passwordInput} secureTextEntry={!isShowingPassword} onChangeText={onChangePassword} onSubmitEditing={onPasswordEnter}></TextInput>
              {!isShowingPassword && <PressImage onPress={()=>{setIsShowingPassword(!isShowingPassword)}} style={s.image} pressStyle={s.imageContainer} source={require('../../public/images/show.png')}></PressImage>}
              {isShowingPassword && <PressImage onPress={()=>{setIsShowingPassword(!isShowingPassword)}} style={s.image} pressStyle={s.imageContainer} source={require('../../public/images/hide.png')}></PressImage>}
            </View>
            <View style={s.logoutView}>
              <PressText text={isShowingRefreshTokenView?'Refresh':'Login'} textStyle={s.loginButtonText} style={isShowingRefreshTokenView?s.refreshTokenButton:s.loginButton} onPress={login}></PressText>
              {isShowingRefreshTokenView && <PressText text={'Cancel'} textStyle={s.loginButtonText} style={s.logoutButton} onPress={() => setIsShowingRefreshTokenView(false)}></PressText>}
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
      paddingBottom: 5,
    },
    subHeader:{
      // textAlign: 'center',
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
    userInformationCard:{
      paddingVertical: 10,
      paddingHorizontal: 10,
      backgroundColor: t.backgroundcolordark,

      borderColor: t.bordercolorfade,
      borderWidth: 1,
      borderRadius: 2,
      borderStyle: 'solid',
    },
    userView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      verticalAlign: 'middle',
      flexDirection: 'row',
      marginBottom: 2,
      paddingVertical: 2,
      paddingHorizontal: 5,

      // borderColor: t.textcolorfade,
      // borderBottomWidth: 1,
      // borderRadius: 5,
      // borderStyle: 'solid',
    },
    logoutView:{
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    logoutButton: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: t.logoutbuttonbk,
      paddingVertical: 15,
      paddingHorizontal: 20,
      margin: 10,
      
      borderRadius: 2,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: colorPalette.black,
    },
    logoutButtonText: {
      color: colorPalette.black,
      fontSize: f.userViewLogoutButton.fontSize,
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
      borderColor: colorPalette.black,
    },
    refreshTokenButtonText: {
      color: colorPalette.black,
      fontSize: f.userViewLogoutButton.fontSize,
    },
    loginContainer:{
      flex: 1,
      alignItems: "center",
      verticalAlign: "middle",
      width: '100%',
      paddingTop: 10,
      paddingHorizontal: 10,
      backgroundColor: t.backgroundcolordarker,

      borderColor: t.bordercolorfade,
      borderWidth: 1,
      borderRadius: 5,
      borderStyle: 'solid',
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

      // borderColor: 'green',
      // borderWidth: 1,
      // borderRadius: 5,
      // borderStyle: 'solid',
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
      paddingHorizontal: 20,
      margin: 2,
      
      borderRadius: 5,
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
    imageContainer:{
      ...gs.baseImageContainer,
      marginHorizontal: 10,
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