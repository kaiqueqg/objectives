import { View, StyleSheet, Text, TextInput, Vibration , Pressable} from "react-native";
import { useUserContext } from "../Contexts/UserContext";
import React, { useState } from "react";
import PressInput from "../PressInput/PressInput";
import PressText from "../PressText/PressText";
import Loading from "../Loading/Loading";
import { colorPalette, dark } from "../Colors";
import { Pattern, UserPrefs } from "../Types";
import { useLogContext } from "../Contexts/LogContext";
import { useRequestContext } from "../Contexts/RequestContext";

export interface UserViewProps {
  syncObjectivesList: () => void,
}
const UserView = (props: UserViewProps) => {
  const { identityApi } = useRequestContext();
  const { log, popMessage } = useLogContext();
  const { theme: t, fontTheme: f, user, writeUser, writeJwtToken, userPrefs, writeUserPrefs, clearAllData } = useUserContext();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);

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

  const s = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
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
    userPrefsContainerOn:{
      padding: 5,
      marginTop: 10,
      backgroundColor: colorPalette.bluedarkerdarker,

      borderRadius: 2,
      borderColor: colorPalette.beigedark,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    userPrefsContainerOff:{
      padding: 5,
      marginTop: 10,

      borderRadius: 2,
      borderColor: 'grey',
      borderWidth: 1,
      borderStyle: 'solid',
    },
    userPrefsTextOn:{
      marginVertical: 5,
      marginHorizontal: 5,
      color: 'beige',
    },
    userPrefsTextOff:{
      marginVertical: 5,
      marginHorizontal: 5,
      color: 'grey',
    },
    logoutView:{
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 30,
    },
    logoutButton: {
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: t.logoutbuttonbk,
      paddingVertical: 15,
      paddingHorizontal: 50,
    },
    logoutButtonText: {
      color: t.backgroundcolor,
      fontSize: f.userViewLogoutButton.fontSize,
    },
    loginContainer:{
      flex: 1, 
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    objectivesText: {
      fontSize: 25,
      marginBottom: 30,
      width: '90%',
      color: 'beige',
      textAlign: 'center',
    },
    emailpassword: {
      width: '90%',
      margin: 10,
      color: colorPalette.beige,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: 'grey',
      borderRadius: 2,
      padding: 10
    },
    loginButton: {
      borderRadius: 2,
      justifyContent: 'center',
      alignItems: 'center',
      width: '90%',
      margin: 10,
      color: t.textcolor,
      backgroundColor: t.loginbuttonbk,
      padding: 10,
    },
    loginButtonText: {
      fontSize: 18,
    },
    loading:{
    },
  });

  return (
    <View style={s.container}>
      {isLogging?
        <Loading theme={dark} style={{width: 30, height: 30, margin: 10}}></Loading>
        :
        (user?
          <>
            <View style={s.contentContainer}>
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
              </View>
              <Text style={s.header}>SETTINGS:</Text>
              <Text style={s.subHeader}>General</Text>
              <PressText 
                style={userPrefs.vibrate? s.userPrefsContainerOn:s.userPrefsContainerOff}
                textStyle={userPrefs.vibrate? s.userPrefsTextOn:s.userPrefsTextOff}
                onPress={() => onChangePrefs({...userPrefs, vibrate: !userPrefs.vibrate})}
                text={"Should button vibrate? - " + (userPrefs.vibrate? 'Yes.':'No.')}>
              </PressText>
              <PressText 
                style={userPrefs.autoSync? s.userPrefsContainerOn:s.userPrefsContainerOff}
                textStyle={userPrefs.autoSync? s.userPrefsTextOn:s.userPrefsTextOff}
                onPress={() => onChangePrefs({...userPrefs, autoSync: !userPrefs.autoSync})}
                text={"Should automatically sync? - " + (userPrefs.autoSync? 'Yes.':'No.')}>
              </PressText>
              <Text style={s.subHeader}>Location</Text>
              <PressText 
                style={userPrefs.allowLocation? s.userPrefsContainerOn:s.userPrefsContainerOff}
                textStyle={userPrefs.allowLocation? s.userPrefsTextOn:s.userPrefsTextOff}
                onPress={()=>onChangePrefs({...userPrefs, allowLocation: !userPrefs.allowLocation})}
                text={"Use location? - " + (userPrefs.allowLocation? 'Yes.':'No.')}>
              </PressText>
            </View>
            <View style={s.logoutView}>
              <PressText text={'Logout'} textStyle={s.logoutButtonText} style={s.logoutButton} onPress={logout}></PressText>
            </View>
          </>
        :
          <View style={s.loginContainer}>
            <Text style={s.objectivesText}>
              Objectives
            </Text>
            <TextInput autoCapitalize="none" placeholder="Email" placeholderTextColor={'grey'} style={s.emailpassword} onChangeText={onChangeEmail}></TextInput>
            <TextInput autoCapitalize="none" placeholder="Password" placeholderTextColor={'grey'} style={s.emailpassword} secureTextEntry={true} onChangeText={onChangePassword}></TextInput>
            {isLogging?
            <Loading theme={dark} style={{width: 30, height: 30, margin: 10}}></Loading>
            :
            <Pressable style={s.loginButton} onPress={login}>
              <Text style={s.loginButtonText}>Login</Text>
            </Pressable>}
          </View>
        )
      }
    </View>
  );
};

export default UserView;