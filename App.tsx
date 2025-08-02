import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import * as Font from 'expo-font';
import React, { useEffect, useState } from 'react';
import { UserProvider } from './src/Contexts/UserContext';
import Main from './src/Main';
import { colorPalette, dark } from './src/Colors';
import { StorageProvider } from './src/Contexts/StorageContext';
import { LogProvider } from './src/Contexts/LogContext';
import { RequestProvider } from './src/Contexts/RequestContext';

export default function App() {
  const [isLoadingFont, setIsLoadingFont] = useState<boolean>(false);


  useEffect(() => {
    //loadFonts();
  }, []);

  const loadFonts = async () => {
    // await Font.loadAsync({
    //   'Mao1': require('./fonts/CaveatBrush-Regular.ttf'), //muito boa
    //   'Mao2': require('./fonts/Caveat-VariableFont_wght.ttf'), //gostei
    //   'Mao3': require('./fonts/IndieFlower-Regular.ttf'), // meio ilegível
    //   'Mao4': require('./fonts/PlaywriteESDeco-VariableFont_wght.ttf'), //horrivel

    //   'Mao5': require('./fonts/Kalam-Light.ttf'),
    //   'Mao6': require('./fonts/Kalam-Regular.ttf'), //gostei
    //   'Mao7': require('./fonts/Kalam-Bold.ttf'),

    //   'Mao8': require('./fonts/GreatVibes-Regular.ttf'), //ilegivel
    //   'Mao9': require('./fonts/DancingScript-VariableFont_wght.ttf'), //meio ilegivel
    //   'Mao10': require('./fonts/ReenieBeanie-Regular.ttf'), // boa mas pequena

    //   'Seria1': require('./fonts/RobotoSerif-VariableFont_GRAD,opsz,wdth,wght.ttf'), //gostei mas bem fina
    //   'Seria2': require('./fonts/Lato-Bold.ttf'), //gostei
    // });
    setIsLoadingFont(false);
  }
  const s = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'beige',//colorPalette.bluedarkerdarker,
    },
    loading: {
      color: colorPalette.beige,
      fontWeight: 'bold',
      fontSize: 20,
    },
  });

  return (
    <View style={s.container}>
      <LogProvider>
        <StorageProvider>
          <RequestProvider>
            <UserProvider>
              <Main></Main>
              {/* {isLoadingFont?
                <Text style={s.loading}>Loading...</Text>
                :
              } */}
            </UserProvider>

          </RequestProvider>
        </StorageProvider>
      </LogProvider>
    </View>
  );
}


