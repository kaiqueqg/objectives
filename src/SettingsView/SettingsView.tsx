import { View, Text, Vibration, StyleSheet, ScrollView } from 'react-native';
import PressText from '../PressText/PressText';
import { HandPosition, ObjBottomIcons, Pattern, Themes, UserPrefs } from '../Types';
import { useLogContext } from '../Contexts/LogContext';
import { useUserContext } from '../Contexts/UserContext';
import { useStorageContext } from '../Contexts/StorageContext';
import { Images } from '../Images';
import { globalStyle as gs } from "../Colors";
import PressImage from '../PressImage/PressImage';
import ObjectiveView from '../ObjectivesList/ObjetiveView/ObjetiveView';
import { useState } from 'react';

interface SettingsViewProps {
}
export const SettingsView: React.FC<SettingsViewProps> = (props: SettingsViewProps) => {
  const { theme: t, fontTheme: f, userPrefs, writeUserPrefs } = useUserContext();
//   const [contentHeight, setContentHeight] = useState<number>(0);
//   const [layoutHeight, setLayoutHeight] = useState<number>(0);
//   const [offsetY, setOffsetY] = useState<number>(0);

// const hasMoreContent = offsetY + layoutHeight < contentHeight;
  
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

  const onChangePrefs = (newPrefs: UserPrefs) => {
    if(newPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
    writeUserPrefs(newPrefs);
  }

  const getPosText = (icon: ObjBottomIcons) => {
    const icons = userPrefs.ObjectivesPrefs.iconsToDisplay;
    const iconPos = (icons.findIndex((s)=> {return s===ObjBottomIcons[icon]})+1);

    return iconPos === 0? '':iconPos.toString()+'º';
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
  
  const getIconImage = (icon: ObjBottomIcons, source:any) => {
    const shouldFade = !userPrefs.ObjectivesPrefs.iconsToDisplay.includes(icon);
    return(
      <PressImage 
        key={icon+shouldFade}
        onPress={()=>onAddIconToDisplay(ObjBottomIcons[icon])}
        source={source}
        fade={shouldFade}
        // text={getPosText(icon)}
        raw={icon === ObjBottomIcons.IsLocked && !shouldFade}
        />
    )
  }

  const objBottomIconImageRecord: Record<ObjBottomIcons, any> = {
    [ObjBottomIcons.Menu]: Images.Menu,
    [ObjBottomIcons.Archive]: Images.Archive,
    [ObjBottomIcons.Unarchive]: Images.Unarchive,
    [ObjBottomIcons.Palette]: Images.Palette,
    [ObjBottomIcons.Checked]: Images.Checked,
    [ObjBottomIcons.Tags]: Images.Tag,
    [ObjBottomIcons.Sorted]: Images.Sort,
    [ObjBottomIcons.Pos]: Images.Change,
    [ObjBottomIcons.Add]: Images.Add,
    [ObjBottomIcons.Search]: Images.Search,
    [ObjBottomIcons.IsLocked]: Images.Lock,
    [ObjBottomIcons.FoldUnfoldAll]: Images.DoubleDownChevron,
    [ObjBottomIcons.GoingTopDown]: Images.ToBottom,
  }

  const getObjectiveIconsDisplayView = () => {
    let itemsToDisplay: any[] = [];
    let itemsToHide: any = [];

    for(const v of Object.values(ObjBottomIcons)){
      let should = userPrefs.ObjectivesPrefs.iconsToDisplay.includes(v);
      if(v === ObjBottomIcons.Menu) should = false;
      if(should){
        itemsToDisplay.push(getIconImage(v, objBottomIconImageRecord[v]));
      }
      else{
        itemsToHide.push(getIconImage(v, objBottomIconImageRecord[v]));
      }
    }

    return itemsToDisplay;
  }

  const getObjectiveIconsFadeView = () => {
    let itemsToDisplay: any[] = [];
    let itemsToHide: any = [];

    for(const v of Object.values(ObjBottomIcons)){
      const should = !userPrefs.ObjectivesPrefs.iconsToDisplay.includes(v);
      if(should){
        itemsToDisplay.push(getIconImage(v, objBottomIconImageRecord[v]));
      }
      else{
        itemsToHide.push(getIconImage(v, objBottomIconImageRecord[v]));
      }
    }

    return itemsToDisplay;
  }

  const changeTheme = () => {
    switch(userPrefs.theme){
      case Themes.Auto:
        return Themes.Dark;
      case Themes.Dark:
        return Themes.Light;
      case Themes.Light:
        return Themes.Dark;
      default:
        return Themes.Dark;
    }
  }

  const getThemeBottomIcon = () => {
    switch(userPrefs.theme){
      case Themes.Auto:
        return Images.Theme
      case Themes.Dark:
        return Images.DarkMode
      case Themes.Light:
        return Images.LightMode
      default:
        return Images.Theme
    }
  }

  const onChangeHandPosition = () => {
    let newHandPos: HandPosition = HandPosition.Left;

    switch(userPrefs.handPosition) {
      case HandPosition.Right:
        newHandPos = HandPosition.Left;
        break;
      case HandPosition.Left:
        newHandPos = HandPosition.Center;
        break;
      case HandPosition.Center:
        newHandPos = HandPosition.Right;
        break;
    }

    onChangePrefs({...userPrefs, handPosition: newHandPos});
  }

  const s = StyleSheet.create({
    settingsContainer:{
      flex: 1,
      backgroundColor: t.backgroundcolor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollView:{
      width: '100%',
      paddingBottom: 25,
      paddingTop: 10,
      paddingHorizontal: 10,

      // borderColor: hasMoreContent ?'red':'blue',
      // borderWidth: 1,
      // borderRadius: 5,
      // borderStyle: 'solid',
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
      fontWeight: 'bold',
      fontSize: 15,
      margin: 10,
    },
    subSubHeader:{
      textAlign: 'center',
      color: t.textcolorfade,
      fontSize: 13,
      margin: 10,
    },
    userPrefsContainerOn:{
      flexDirection: 'row',
      padding: 5,
      marginTop: 5,
      paddingLeft: 10,
      backgroundColor: t.backgroundcolordarker,
      alignItems: "center",

      borderRadius: 2,
      borderColor: t.bordercolorfade,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    userPrefsContainerOff:{
      flexDirection: 'row',
      padding: 5,
      marginTop: 5,
      paddingLeft: 10,
      alignItems: "center",

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
      paddingLeft: 10,
      color: t.textcolor,
    },
    userPrefsTextOff:{
      flex: 1,
      flexWrap: "wrap",
      marginVertical: 5,
      marginHorizontal: 5,
      paddingLeft: 10,
      color: t.textcolorfade,
    },
    contentDivider:{
      marginTop: 20,
      marginBottom: 9,
      width: '100%',

      borderColor: t.bordercolorfade,
      borderTopWidth: 1,
      borderStyle: 'solid',
    },
    image:{
      ...gs.baseImage,
      tintColor: t.icontint,
    },
    imageSmall:{
      ...gs.baseSmallImage,
      tintColor: t.icontint,
    },
    objectiveIconContainer:{
      flexDirection: 'row',
      flexWrap: "wrap",
      justifyContent: userPrefs.handPosition?'flex-end':'flex-start',
      minHeight: 45,
    },
  })

  return (
    <View style={s.settingsContainer}>
      <ScrollView style={s.scrollView}
      // onContentSizeChange={(w, h) => setContentHeight(h)}
      // onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}
      // onScroll={(e) => setOffsetY(e.nativeEvent.contentOffset.y)}
      // scrollEventThrottle={16}
       persistentScrollbar={true}>
        <Text style={s.header}>SETTINGS:</Text>
          <Text style={s.subHeader}>General</Text>
          <PressText
            style={s.userPrefsContainerOn}
            textStyle={s.userPrefsTextOn}
            onPress={() => {onChangePrefs({...userPrefs, theme: changeTheme()})}}
            imageStyle={s.image}
            imageSource={getThemeBottomIcon()}
            text={"Which theme? - " + userPrefs.theme}>
          </PressText>
          <PressText
            style={s.userPrefsContainerOn}
            textStyle={s.userPrefsTextOn}
            onPress={onChangeHandPosition}
            imageStyle={s.image}
            imageSource={userPrefs.handPosition?Images.RightHand:Images.LeftHand}
            text={"Which hand? - " + userPrefs.handPosition + ' hand.'}>
          </PressText>
          <PressText 
            style={userPrefs.shouldLockOnOpen? s.userPrefsContainerOn:s.userPrefsContainerOff}
            textStyle={userPrefs.shouldLockOnOpen? s.userPrefsTextOn:s.userPrefsTextOff}
            onPress={inChangeLockOpen}
            imageStyle={s.image}
            imageSource={Images.Fingerprint}
            text={"Should lock app on first open? - " + (userPrefs.shouldLockOnOpen? 'Yes.':'No.')}>
          </PressText>
          <PressText 
            style={userPrefs.shouldLockOnReopen? s.userPrefsContainerOn:s.userPrefsContainerOff}
            textStyle={userPrefs.shouldLockOnReopen? s.userPrefsTextOn:s.userPrefsTextOff}
            onPress={onChangeLockReopen}
            imageStyle={s.image}
            imageSource={Images.Fingerprint}
            text={"Should lock app every times it's open? - " + (userPrefs.shouldLockOnReopen? 'Yes.':'No.')}>
          </PressText>
          <PressText 
            style={userPrefs.vibrate? s.userPrefsContainerOn:s.userPrefsContainerOff}
            textStyle={userPrefs.vibrate? s.userPrefsTextOn:s.userPrefsTextOff}
            onPress={() => {onChangePrefs({...userPrefs, vibrate: !userPrefs.vibrate})}}
            imageStyle={s.image}
            imageSource={Images.Vibrate}
            text={"Should button vibrate? - " + (userPrefs.vibrate? 'Yes.':'No.')}>
          </PressText>
          <PressText 
            style={userPrefs.autoSync? s.userPrefsContainerOn:s.userPrefsContainerOff}
            textStyle={userPrefs.autoSync? s.userPrefsTextOn:s.userPrefsTextOff}
            onPress={() => {onChangePrefs({...userPrefs, autoSync: !userPrefs.autoSync})}}
            imageStyle={s.imageSmall}
            imageSource={Images.Sync}
            text={"Should automatically sync? - " + (userPrefs.autoSync? 'Yes.':'No.')}>
          </PressText>
          <PressText 
            style={userPrefs.openLastObjectiveOnStart? s.userPrefsContainerOn:s.userPrefsContainerOff}
            textStyle={userPrefs.openLastObjectiveOnStart? s.userPrefsTextOn:s.userPrefsTextOff}
            onPress={() => {onChangePrefs({...userPrefs, openLastObjectiveOnStart: !userPrefs.openLastObjectiveOnStart})}}
            imageStyle={s.imageSmall}
            imageSource={Images.File}
            text={"On start, should open last objective? - " + (userPrefs.openLastObjectiveOnStart? 'Yes.':'No.')}>
          </PressText>
          <View style={s.contentDivider}></View>
          <Text style={s.subHeader}>Objective bottom icons to display</Text>
          <View style={s.objectiveIconContainer}>
            {getObjectiveIconsDisplayView()}
          </View>
          <View style={s.objectiveIconContainer}>
            {getObjectiveIconsFadeView()}
          </View>
          <View style={s.contentDivider}></View>
          <Text style={s.subHeader}>Location</Text>
          <PressText 
            style={userPrefs.allowLocation? s.userPrefsContainerOn:s.userPrefsContainerOff}
            textStyle={userPrefs.allowLocation? s.userPrefsTextOn:s.userPrefsTextOff}
            onPress={()=>{onChangePrefs({...userPrefs, allowLocation: !userPrefs.allowLocation})}}
            imageStyle={s.imageSmall}
            imageSource={Images.LocationFilled}
            text={"Use location? - " + (userPrefs.allowLocation? 'Yes.':'No.')}>
          </PressText>
          <PressText 
            style={userPrefs.warmLocationOff? s.userPrefsContainerOn:s.userPrefsContainerOff}
            textStyle={userPrefs.warmLocationOff? s.userPrefsTextOn:s.userPrefsTextOff}
            onPress={()=>{onChangePrefs({...userPrefs, warmLocationOff: !userPrefs.warmLocationOff})}}
            imageStyle={s.imageSmall}
            imageSource={Images.Location}
            ellipsizeMode="head"
            numberOfLines={3}
            text={"Warm about necessity of location of proximity of location? - " + (userPrefs.warmLocationOff? 'Yes.':'No.')}>
          </PressText>
          <View style={{height: 100}}></View>
        </ScrollView>
    </View>
  );
};
