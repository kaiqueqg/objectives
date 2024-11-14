import { View, StyleSheet, Text, Vibration, Alert, Linking } from "react-native";
import { Item, Location, MessageType, ItemViewProps } from "../../../Types";
import { ObjectivePallete, ThemePalette } from "../../../Colors";
import { FontPalette } from "../../../../fonts/Font";
import { useUserContext } from "../../../Contexts/UserContext";
import PressImage from "../../../PressImage/PressImage";
import PressInput from "../../../PressInput/PressInput";
import { useEffect, useState } from "react";
import * as ExpoLocation from 'expo-location';
import { getDistance } from "geolib";
import { useLogContext } from "../../../Contexts/LogContext";

export interface LocationViewProps extends ItemViewProps {
  location: Location,
}
const LocationView = (props: LocationViewProps) => {
  const { popMessage } = useLogContext();
  const { theme: t, fontTheme: f, putItem, userPrefs } = useUserContext();
  const { objTheme: o, isEditingPos, onDeleteItem, loadMyItems, location } = props;

  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<any>();
  const [currentDistance, setCurrentDistance] = useState<string>('');

  useEffect(() => {
    fillCurrentLocation();
  }, [location]);

  const fillCurrentLocation = async () => {
    if(userPrefs.allowLocation){
      const isEnabled = await ExpoLocation.hasServicesEnabledAsync();
      if(!isEnabled){
        setCurrentLocation(undefined);
        return;
      }

      (async () => {
        try {
          let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
          if (status !== 'granted') return;
    
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
        } catch (err) {}
      })();
    }
  }

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

  const onChangeTitle = async (newText: string) => {
    const newLocation = {...location, Title: newText.trim()};
    await putItem(newLocation);
    loadMyItems();
  };

  const onEditingTitle = (editingState: boolean) => {
    setIsEditingTitle(editingState);
  };

  const onChangeUrl = async (newUrl: string) => {
    const newLocation = {...location, Url: newUrl.trim()};
    await putItem(newLocation);
    loadMyItems();
  };

  const openUrl = async () => {
    if(location.Url && location.Url.trim()) {
      Linking.openURL(location.Url).catch(err => console.error('Error opening Google Maps:', err));
    }
    else{
    }
  };

  const addCurrentLocation = async () => {
    if(!userPrefs.allowLocation){
      popMessage('Allow location on preferences...', MessageType.Error, 5);
      return;
    }

    const isEnabled = await ExpoLocation.hasServicesEnabledAsync();
    if(!isEnabled){
      popMessage('Turn on phone GPS to get current location!', MessageType.Alert, 3);
        setCurrentLocation(undefined);
        return;
    }

    fillCurrentLocation();
    
    if(!currentLocation){
      popMessage('Current location wasn\'t available.', MessageType.Error, 5);
      return;
    }

    let newUrl = 'https://www.google.com/maps/search/?api=1&query=' + currentLocation.coords.latitude+','+currentLocation.coords.longitude;
    const newLocation = {...location, Url: newUrl.trim()};
    await putItem(newLocation);
    loadMyItems();

    onEditingTitle(true);
  }

  const s = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
      marginHorizontal: 6,
    },
    titleUrlContainer:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: o.stepbk,
      
      borderRadius: 5,
      borderColor: o.bordercolor,
      borderWidth: 1,
      borderStyle: 'solid',
    },
    titleUrlContainerSelected:{
      borderStyle: 'dashed',
      borderColor: o.bordercolorselected,
    },
    titleUrlContainerEnding:{
      borderStyle: 'solid',
      borderColor: o.bordercolorselected,
    },
    titleLine:{
      flexDirection: 'row',
      alignItems: 'center',
    },
    urlLine:{
      flexDirection: 'row',
      alignItems: 'center',
    },
    title:{
      color: o.locationtext,
    },
    titleFade:{
      color: 'grey',
    },
    inputStyle: {
      color: o.locationtext,
      borderColor: o.locationtext,
    },
    imageContainer:{
      height: 40,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image:{
      height: 20,
      width: 20,
      tintColor: o.icontintcolor,
    },
    imageFade:{
      height: 20,
      width: 20,
      tintColor: o.icontintcolorfade,
    },
    locationDoneImage:{
      tintColor: o.doneicontintlocation,
    },
    urlText:{
      color: o.locationtext,
      margin: 10,
    },
    distanceText:{
      color: o.locationtext,
    },
    imageMoveContainer:{
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 5,
      width: 40,
      height: 40,
    },
    imageMove:{
      height: 20,
      width: 20,
      tintColor: o.icontintcolor,
    },
  });

  return (
    <View style={s.container}>
    <View style={[s.titleUrlContainer, props.isSelected && s.titleUrlContainerSelected, props.isSelected && props.isEndingPos && s.titleUrlContainerEnding]}>
      {/*Title View*/}
      <View style={s.titleLine}>
        <PressInput 
          objTheme={o}
          text={location.Title}
          onDelete={onDelete}
          onDone={onChangeTitle}
          onEditingState={onEditingTitle}
          uneditable={isEditingPos}
          
          textStyle={s.title}
          defaultStyle={s.title}
          inputStyle={s.inputStyle}
          doneImageStyle={s.locationDoneImage}
          trashImageStyle={{tintColor: o.trashicontintlocation}}
          >
        </PressInput>
        {currentDistance && 
          <Text style={s.distanceText}>
            {currentDistance}
          </Text>
        }
        {!isEditingTitle && 
          (location.Url.trim() === ''?
            <PressImage pressStyle={s.imageContainer} style={s.image} source={require('../../../../public/images/location.png')} onPress={() => {if(!isEditingPos)addCurrentLocation();}}></PressImage>
            :
            <PressImage pressStyle={s.imageContainer} style={s.image} source={require('../../../../public/images/location-filled.png')} onPress={() => {if(!isEditingPos)openUrl();}}></PressImage>
          )
        }
      </View>
      {/*URL View*/}
      {isEditingTitle && 
        <View style={s.urlLine}>
          <Text style={s.urlText}>URL: </Text>
          <PressInput 
            objTheme={o}
            text={location.Url}
            onDone={onChangeUrl}
            uneditable={isEditingPos}
            
            textStyle={s.urlLine}
            inputStyle={s.inputStyle}
            doneImageStyle={s.locationDoneImage}
            trashImageStyle={{tintColor: o.trashicontintlocation}}
            >
          </PressInput>
        </View>
      }
      </View>
    </View>
  );
};

export default LocationView;