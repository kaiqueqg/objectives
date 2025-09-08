import { View, StyleSheet, Vibration, Alert, Linking, TextInput, Text, Keyboard, BackHandler,  } from "react-native";
import { Item, Location, MessageType, ItemViewProps, ItemType, Pattern } from "../../../Types";
import { colorPalette, dark, globalStyle as gs } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import PressImage from "../../../PressImage/PressImage";
import PressInput from "../../../PressInput/PressInput";
import { useEffect, useRef, useState } from "react";
import * as ExpoLocation from 'expo-location';
import { getDistance } from "geolib";
import { useLogContext } from "../../../Contexts/LogContext";
import PressText from "../../../PressText/PressText";
import Loading from "../../../Loading/Loading";

export const New = () => {
  return(
    {
      Title: '',
      Url: '',
    }
  )
}

export interface LocationViewProps extends ItemViewProps {
  location: Location,
}
const LocationView = (props: LocationViewProps) => {
  const { popMessage, log } = useLogContext();
  const { theme: t, fontTheme: f, putItem, userPrefs } = useUserContext();
  const { objTheme: o, isEditingPos, onDeleteItem, loadMyItems, location } = props;

  const [isEditingLocation, setIsEditingLocation] = useState<boolean>(false);
  const [tempLocation, setTempLocation] = useState<Location>(props.location);
  const [currentLocation, setCurrentLocation] = useState<any>();
  const [currentDistance, setCurrentDistance] = useState<string>('');
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState<boolean>(false);

  const inputRef = useRef<TextInput>(null);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
    
  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => {setKeyboardVisible(true);});
    const hide = Keyboard.addListener("keyboardDidHide", () => {setKeyboardVisible(false);});

    const backAction = () => {
      if (keyboardVisible) {
        Keyboard.dismiss();
        return true;
      }
      
      onCancelLocation();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
      show.remove();
      hide.remove();
    };
  }, [keyboardVisible]);

  useEffect(() => {
    fillCurrentLocation();
  }, [location, tempLocation]);

  const extractCoordinates = (url: string) => {
    // Regex for the query pattern (e.g., ?query=-23.6068458,-46.6110111)
    const queryRegex = /query=(-?\d+\.\d+),(-?\d+\.\d+)/;
    const queryMatches = url.match(queryRegex);
  
    // Regex for the @latitude,longitude pattern (e.g., @45.434237,12.3367596)
    const atRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const atMatches = url.match(atRegex);
  
    if (queryMatches) {
      const latitude = parseFloat(queryMatches[1]);
      const longitude = parseFloat(queryMatches[2]);
      return { latitude, longitude };
    } else if (atMatches) {
      const latitude = parseFloat(atMatches[1]);
      const longitude = parseFloat(atMatches[2]);
      return { latitude, longitude };
    } else {
      return null;
    }
  };

  const onDelete = async () => {
    await onDeleteItem(location);
  };

  const onDoneLocation = async () => {
    let newLocation = {...tempLocation};
    newLocation.Title = newLocation.Title.trim();
    newLocation.Url = newLocation.Url?.trim();
    await putItem(newLocation);
    setIsEditingLocation(false);
    loadMyItems();
  }

  const onCancelLocation = async () => {
    setIsEditingLocation(false);
  }

  const openUrl = async () => {
    if(location.Url && location.Url.trim()) {
      Linking.openURL(location.Url).catch(err => console.error('Error opening Google Maps:', err));
    }
    else{
    }
  };

  const addCurrentLocation = async () => {
    setIsGettingCurrentLocation(true);
    if(!userPrefs.allowLocation){
      popMessage('Allow location on preferences...', MessageType.Error, 5);
      setIsGettingCurrentLocation(false);
      return;
    }

    const isEnabled = await ExpoLocation.hasServicesEnabledAsync();
    if(!isEnabled){
      popMessage('Turn on phone GPS to get current location!', MessageType.Alert, 3);
      setCurrentLocation(undefined);
      setIsGettingCurrentLocation(false);
      return;
    }

    const location = await fillCurrentLocation();

    if(!currentLocation){
      popMessage('Current location wasn\'t available.', MessageType.Error, 5);
    }
    else{
      let newUrl = 'https://www.google.com/maps/search/?api=1&query=' + currentLocation.coords.latitude+','+currentLocation.coords.longitude;
      setTempLocation({...tempLocation, Url: newUrl});
      inputRef.current?.setNativeProps({ text: newUrl });
    }

    setIsGettingCurrentLocation(false);
  }

  
  const fillCurrentLocation = async (): Promise<ExpoLocation.LocationObject|null> => {
    if(userPrefs.allowLocation){
      const isEnabled = await ExpoLocation.hasServicesEnabledAsync();
      if(!isEnabled){
        setCurrentLocation(undefined);
        return null;
      }

      try {
        let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
        if (status !== 'granted') return null;
  
        let currentLocation = await ExpoLocation.getCurrentPositionAsync({});
        setCurrentLocation(currentLocation);
        
        if(location.Url !== ''){
          const pointA = {latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude};
          const pointB = extractCoordinates(location.Url);
  
          if(pointA && pointB) {
            const distanceInMeters = getDistance(pointA, pointB);
            setCurrentDistance(distanceInMeters > 1000? ((distanceInMeters/1000).toFixed(2) + 'km'):distanceInMeters.toString()+'m');
          }
        }

        return currentLocation;
      } catch (err) {}
    }

    return null;
  }

  const onEditingLocation = () => {
    if(!isEditingPos && !props.isLocked)setIsEditingLocation(!isEditingLocation)
    else Vibration.vibrate(Pattern.Wrong);
  }

  const s = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: o.marginHorizontal,
      marginVertical: o.marginVertical,
    },
    locationContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: location.Url.trim() !== ''? o.objbk:o.itembk,
      
      borderColor: location.Url.trim() !== ''?colorPalette.transparent:o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
      borderRadius: o.borderRadius,
    },
    locationContainerSelected:{
      borderStyle: 'dashed',
      borderColor: o.bordercolorselected,
    },
    locationContainerEnding:{
      borderStyle: 'solid',
      borderColor: o.bordercolorselected,
    },
    titleContainer:{
      flex: 1,
      justifyContent: 'center',

      minHeight: 40,
      margin: 2,
      paddingLeft: 10,
      color: 'beige',
    },
    title:{
      color: o.itemtext,
    },
    titleFade:{
      color: o.itemtextfade,
    },
    displayContainer:{
      flex: 1,
      flexDirection: 'row',
    },
    displayLeft:{
      flex: 1,
    },
    displayRight:{
      flexDirection: 'row',
    },
    urlInputContainer:{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    displayDistance:{
      verticalAlign: 'middle',
      height: '100%',
      color: o.itemtext,
      paddingHorizontal: 5,
    },
    image:{
      ...gs.baseImage,
      tintColor: o.icontintcolor,
    },
    imageDone:{
      tintColor: o.doneicontint,
    },
    imageCancel:{
      tintColor: o.cancelicontint,
    },
    imageDelete:{
      tintColor: o.trashicontint,
    },
    imageFade:{
      ...gs.baseImage,
      tintColor: o.itemtextfade,
    },
    groceryDoneImage:{
      tintColor: o.doneicontint,
    },
    inputsContainer:{
      flex: 1,
      flexDirection: 'row',
    },
    inputsLeft:{
      width: '15%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputsCenter:{
      width: '70%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputsRight:{
      width: '15%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputStyle:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',

      width: '100%',
      minHeight: 40,
      margin: 2,
      paddingLeft: 10,
      color: o.itemtext,

      borderRadius: 5,
      borderColor: o.icontintcolor,
      borderBottomWidth: 1,
      borderStyle: 'solid',
    },
  });

  return(
    <View style={s.container}>
      <View style={[s.locationContainer, props.isSelected && s.locationContainerSelected, props.isSelected && props.isEndingPos && s.locationContainerEnding]}>
        {!isEditingPos && isEditingLocation?
          <View style={s.inputsContainer}>
            <View style={s.inputsLeft}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDelete]} confirm={true} source={require('../../../../public/images/trash.png')} onPress={onDelete}></PressImage>
            </View>
            <View style={s.inputsCenter}>
              <TextInput 
                style={s.inputStyle}
                placeholderTextColor={o.itemtextfade}
                placeholder="Title"
                defaultValue={location.Title}
                onChangeText={(value: string)=>{setTempLocation({...tempLocation, Title: value})}} autoFocus
                onSubmitEditing={onDoneLocation}></TextInput>
              <View style={s.urlInputContainer}>
                <TextInput
                  ref={inputRef}
                  style={s.inputStyle}
                  placeholderTextColor={o.itemtextfade}
                  placeholder="Url"
                  defaultValue={location.Url}
                  onChangeText={(value: string)=>{setTempLocation({...tempLocation, Url: value})}}
                  onSubmitEditing={onDoneLocation}></TextInput>
                {isGettingCurrentLocation?
                  <Loading theme={dark}></Loading>
                  :
                  <PressImage pressStyle={gs.baseImageContainer} style={[s.image]} source={require('../../../../public/images/location-filled.png')} onPress={addCurrentLocation}></PressImage>
                }
              </View>
            </View>
            <View style={s.inputsRight}>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageDone]} source={require('../../../../public/images/done.png')} onPress={onDoneLocation}></PressImage>
              <PressImage pressStyle={gs.baseImageContainer} style={[s.image, s.imageCancel]} source={require('../../../../public/images/cancel.png')} onPress={onCancelLocation}></PressImage>
            </View>
          </View>
          :
          <View style={s.displayContainer}>
            <View style={s.displayLeft}>
              <PressText
              style={s.titleContainer}
              textStyle={s.title}
              text={location.Title}
              onPress={()=>{onEditingLocation()}}
              defaultStyle={o}
              ></PressText>
            </View>
            <View style={s.displayRight}>
              <Text style={s.displayDistance}>{currentDistance}</Text>
              {location.Url.trim() === ''?
                <PressImage pressStyle={gs.baseImageContainer} style={s.image} source={require('../../../../public/images/location.png')}></PressImage>
                :
                <PressImage pressStyle={gs.baseImageContainer} style={s.image} source={require('../../../../public/images/location-filled.png')} onPress={() => {if(!isEditingPos)openUrl();}}></PressImage>
              }
            </View>
          </View>
        }
      </View>
    </View>
  )
};

export default LocationView;