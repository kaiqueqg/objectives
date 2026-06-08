import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Loading } from '../Loading/Loading';
import ButtonView from '../ButtonView/ButtonView';
import { useUserContext } from '../Contexts/UserContext';
import { MessageType, TwoFactorAuthRequest } from '../Types';
import { useRequestContext } from '../Contexts/RequestContext';
import { useLogContext } from '../Contexts/LogContext';
import * as Clipboard from 'expo-clipboard';

interface TwoFAViewProps{
  login: (email: string, pass: string) => Promise<void>,
  back: () => void,
}

const TwoFAView: React.FC<TwoFAViewProps> = (props: TwoFAViewProps) => {
  const { theme: t, userPrefs, writeJwtToken, twoFAToken, writeUser } = useUserContext();
  const { popMessage } = useLogContext();
  const { identityApi } = useRequestContext();

  const [isRequiringTwoFA, setIsRequiringTwoFA] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>('');

  const onChangeVerificationCode = (value: string) => {
    setVerificationCode(value);
  }

  const pasteAndSend = async () => {
    const text = await Clipboard.getStringAsync();
    await sendVerificationTwoFA(text);
  }

  const sendVerificationTwoFA = async (text?: string) => {
    setIsRequiringTwoFA(true);

    const sendText = text?? verificationCode;

    if(!(/^[0-9]{6}$/.test(sendText))){
      setVerificationCode('');
      popMessage('Bad verification code. Must be 6 numbers.', {Type: MessageType.Alert});
      props.back();
      return;
    }
    
    if(twoFAToken) {
      const sendRequest: TwoFactorAuthRequest = { TwoFACode: sendText, TwoFATempToken: twoFAToken };
      const data = await identityApi.validateTwoFA(sendRequest);

      if(data && data.User && data.Token){
        await writeUser(data.User);
        writeJwtToken(data.Token);
        setIsRequiringTwoFA(false);
      }
      else{
        popMessage('Login was ok but no data was returned.', {Type: MessageType.Error});
      }
    }
    else{
      popMessage(`There's no token to try to approve 2FA code.`)
    }

    props.back();
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
    logoutView:{
      flexDirection: 'row',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
    },
    emailInput:{
      flex: 1,
      minHeight: 50,
      color: t.textcolor,
      padding: 10,

      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: t.bordercolorfade,
      borderRadius: 2,
    },
  });

  return (
    <View style={[s.container]}>
      <Text style={s.header}>{'2FA Verification code'}</Text>
      <Loading isLoading={isRequiringTwoFA}>
        <View style={s.emailContainer}>
          <TextInput autoFocus keyboardType="numeric" autoCapitalize="none" placeholder="6 digit number" placeholderTextColor={t.textcolorfade} style={s.emailInput} onChangeText={onChangeVerificationCode} onSubmitEditing={()=>{sendVerificationTwoFA()}}/>
        </View>
        <View style={s.logoutView}>
          {userPrefs.handPosition && <ButtonView text='Cancel' onPress={props.back} type="neutral"/>}
          <ButtonView text='Send' onPress={sendVerificationTwoFA} type="foward"/>
          <ButtonView text='Paste and send' onPress={pasteAndSend} type="foward"/>
          {!userPrefs.handPosition && <ButtonView text='Cancel' onPress={props.back} type="neutral"/>}
        </View>
      </Loading>
    </View>
  );
};

export default TwoFAView;