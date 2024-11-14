import { View, StyleSheet, Text, Vibration, Alert } from "react-native";
import { ThemePalette, dark } from "../Colors";
import { FontPalette } from "../../fonts/Font";
import { MessageType, Pattern, Views } from "../Types";
import PressImage from "../PressImage/PressImage";
import { useUserContext } from "../Contexts/UserContext";
import Loading from "../Loading/Loading";
import { useLogContext } from "../Contexts/LogContext";

export interface BottomBarProps {
  isSyncing: boolean,
  doneSync: boolean,
  failedSync: boolean,
  isServerUp: boolean,
  syncObjectivesList: () => void,
}

const BottomBar = (props: BottomBarProps) => {
  const { user, userPrefs, theme: t, fontTheme: f, currentView, writeCurrentView,
    deleteObjectives } = useUserContext();

  const { isSyncing, doneSync, failedSync, syncObjectivesList } = props;

  const deleteAll = async () => {
    Alert.alert('', 'Do you really want to delete?', [
      { text: 'NO', onPress: () => {}},
      { text: 'YES', onPress: async () => {await deleteObjectives();} }
    ]);
  }

  const onChangeToList = (view: Views) => {
    if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    writeCurrentView(view);
  }

  const s = StyleSheet.create({
    container: {
      flexDirection: 'row',
      height: 50,
      backgroundColor: t.backgroundcolordark,
      borderStyle: 'solid',
      
      borderWidth: 1,
      borderColor: t.boxborderfade,
    },
    leftContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '50%',
    },
    rightContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '50%',
    },
    imageContainer:{
    },
    imageContainerSelected:{
      borderColor: 'beige',
      borderTopWidth: 1,
      borderStyle: 'solid',
    },
    bottomImage: {
      margin: 10,
      width: 30,
      height: 30,
    },
    offImage:{
      tintColor: t.cancelicontint,
    },
    loadingImage:{
    },
  });

  return (
    <View style={s.container}>
      <View style={s.leftContainer}>
        <PressImage pressStyle={currentView === Views.UserView? s.imageContainerSelected:s.imageContainer} style={[s.bottomImage, {tintColor: user? t.doneicontint:t.cancelicontint}]} onPress={() => onChangeToList(Views.UserView)} source={require('../../public/images/user.png')}></PressImage>
        <PressImage pressStyle={currentView === Views.DevView? s.imageContainerSelected:s.imageContainer} style={[s.bottomImage, {tintColor:'beige'}]} onPress={() => onChangeToList(Views.DevView)} source={require('../../public/images/dev.png')}></PressImage>
        {user?
          <>
            {isSyncing?
              <Loading style={s.loadingImage} theme={dark}></Loading>
              :
              <PressImage style={[s.bottomImage, doneSync?{tintColor: t.doneicontint}:(failedSync?{tintColor: t.cancelicontint}:{tintColor:'beige'})]} onPress={syncObjectivesList} source={require('../../public/images/sync.png')}></PressImage>
            }
          </>
          :
          <PressImage style={s.bottomImage} onPress={syncObjectivesList} source={require('../../public/images/cloud-offline.png')}></PressImage>
        }
      </View>
      <View style={s.rightContainer}>
        <PressImage pressStyle={currentView === Views.ListView? s.imageContainerSelected:s.imageContainer} style={s.bottomImage} onPress={() => currentView === Views.IndividualView?onChangeToList(Views.ListView):onChangeToList(Views.IndividualView)} source={require('../../public/images/list.png')}></PressImage>
      </View>
    </View>
  );
};

export default BottomBar;