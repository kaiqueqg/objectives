import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Loading } from '../Loading/Loading';
import ButtonView from '../ButtonView/ButtonView';
import { useUserContext } from '../Contexts/UserContext';
import PressImage from '../PressImage/PressImage';
import { Images } from '../Images';

interface ReloggingViewProps {
  login: (email: string, pass: string) => Promise<void>,
  logout: () => Promise<void>,
  email: string,
}

const ReloggingView: React.FC<ReloggingViewProps> = (props: ReloggingViewProps) => {
  const { theme: t, userPrefs } = useUserContext();
  const [inputPass, setInputPass] = useState<string>('');
  const [isLogging, setIsLogging] = useState<boolean>(false);
  const [isEmailWrong, setIsEmailWrong] = useState<boolean>(false);
  const [isShowingPassword, setIsShowingPassword] = useState<boolean>(false);
  const [isPasswordWrong, setIsPasswordWrong] = useState<boolean>(false);

  const passRef = useRef<TextInput>(null);

  const onChangePassword = (value: string) => {
    setIsPasswordWrong(false);
    setInputPass(value);
  }

  const onPressLogin = async () => {
    setIsLogging(true);
    await props.login(props.email, inputPass);
    setIsLogging(false);
  }

  const s = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      
      paddingHorizontal: 10,
      paddingVertical: 20,
    },
    header:{
      color: t.textcolor,
      fontSize: 25,
      fontWeight: 'bold',
      paddingVertical: 15,
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
    logoutView:{
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
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
  });

  return (
    <View style={s.container}>
      <Text style={s.header}>{'RELOGIN'}</Text> 
        <Loading isLoading={isLogging}>
          <>
            <View style={s.emailContainer}>
              <TextInput style={s.emailInput} value={props.email} editable={false}/>
            </View>
            <View style={s.passwordContainer}>
              {!userPrefs.handPosition && <PressImage onPress={()=>{setIsShowingPassword(!isShowingPassword)}} source={isShowingPassword?Images.Hide:Images.Show}/>}
              <TextInput ref={passRef} autoCapitalize="none" placeholder="Password" placeholderTextColor={t.textcolorfade} style={s.passwordInput} secureTextEntry={!isShowingPassword} onChangeText={onChangePassword} onSubmitEditing={onPressLogin}></TextInput>
              {userPrefs.handPosition && <PressImage onPress={()=>{setIsShowingPassword(!isShowingPassword)}} source={isShowingPassword?Images.Hide:Images.Show}/>}
            </View>
            <View style={s.logoutView}>
              <ButtonView text={'Logout'} onPress={props.logout} type='reset'/>
              <ButtonView text={'Login'} onPress={onPressLogin} type='foward'/>
            </View>
          </>
        </Loading>
    </View>
  );
};

export default ReloggingView;