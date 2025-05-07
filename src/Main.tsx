import { View, StyleSheet, Text, StatusBar, Vibration, BackHandler, Platform, AppState, AppStateStatus, FlatList  } from "react-native";
import { Item, MessageType, Objective, ObjectiveList, Pattern, PopMessage, Step, UserPrefs, Views } from "./Types";
import { FontPalette } from "../fonts/Font";
import { ThemePalette, colorPalette } from "./Colors";
import BottomBar from "./BottomBar/BottomBar";
import { useUserContext } from "./Contexts/UserContext";
import React, { useEffect, useState } from "react";
import ObjectiveView from "./ObjectivesList/ObjetiveView/ObjetiveView";
import UserView from "./UserView/UserView";
import PopMessageContainer from "./Log/PopMessageContainer";
import ObjsListView from "./ObjsListView/ObjsListView";
import DevView from "./DevView/DevView";
import { useLogContext } from "./Contexts/LogContext";
import { useStorageContext } from "./Contexts/StorageContext";
import { useRequestContext } from "./Contexts/RequestContext";
import TagsView from "./TagsView/TagsView";
import ArchivedView from "./ArchivedView/ArchivedView";

export interface MainProps{
}

const Main = (props: MainProps) => {
  const { messageList, popMessage, log } = useLogContext();
  const { storage } = useStorageContext();
  const { objectivesApi } = useRequestContext();

  const {
    user, userPrefs, 
    currentView, writeCurrentView,
    theme: t, fontTheme: f,
    writeObjectives, writeItems, readItems, deleteDeletedObjectives, deleteDeletedItems,
    lastSync, writeLastSync,
    objectives, deletedObjectives, deletedItems,
    currentObjectiveId,
    availableTags, selectedTags, writeAvailableTags, writeSelectedTags, clearAllData
  } = useUserContext();

  const [currentObjective, setCurrentObjective] = useState<Objective|null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [doneSync, setDoneSync] = useState<boolean>(false);
  const [failedSync, setFailedSync] = useState<boolean>(false);
  const [isLambdaCold, setIsLambdaCold] = useState<boolean>(false);
  const [isServerUp, setIsServerUp] = useState<boolean>(false);

  useEffect(() => {
    storage.readUserPrefs().then((startupPrefs: any)=>{
      if(startupPrefs && startupPrefs.autoSync) {
        syncObjectivesList();
      }
    });

    // const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
    //   if(currentView === Views.IndividualView || currentView === Views.UserView || currentView === Views.AllView)
    //     writeCurrentView(Views.ListView);
    //   else
    //     BackHandler.exitApp();
      
    //   return true;
    // });
    // return () => {
    //   subscription.remove();
    // };
  }, []);
  
  useEffect(()=>{
    loadCurrentObject();
  }, [objectives, currentObjective, currentObjectiveId, currentView, messageList]);


  const loadCurrentObject = () => {
    const currentObj = objectives.find((obj)=>obj.ObjectiveId === currentObjectiveId);
    if(currentObj) setCurrentObjective(currentObj);
  }

  const getContent = (): 'default' | 'light-content' | 'dark-content' => {
    if(userPrefs.theme === 'dark') return 'light-content';
    if(userPrefs.theme === 'white') return 'dark-content';
    if(userPrefs.theme === 'paper') return 'dark-content';

    return 'dark-content';
  }

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
  
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Use 24-hour format
      timeZone: 'America/Sao_Paulo' // Set time zone to Brazil
    });
  
    return formatter.format(date);
  };

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

  const wakeupLambda = async () => {
    setIsLambdaCold(true);
    const wakeup = await objectivesApi.wakeupSync();
    setIsLambdaCold(false);
  }

  const syncObjectivesList = async () => {
    try {
      if(userPrefs.vibrate) Vibration.vibrate(Pattern.Ok);
      setFailedSync(false);
      setDoneSync(false);
      
      await wakeupLambda();
  
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
      const data = await objectivesApi.syncObjectivesList(objectiveList, async () => {
        setIsSyncing(false);
        await objectivesApi.isUpObjective(() => {
          popMessage('Server or internet is down!', MessageType.Error, 5);
          setIsServerUp(false);
        });
      });
  
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

  const getCurrentView = () => {
    if(currentView === Views.UserView){
      return <UserView syncObjectivesList={syncObjectivesList}></UserView>;
    }
    else if(currentView === Views.ArchivedView){
      return <ArchivedView></ArchivedView>
    }
    else if(currentView === Views.ListView){
      return <ObjsListView></ObjsListView>
    }
    else if(currentView === Views.DevView){
      return <DevView syncObjectivesList={syncObjectivesList}></DevView>
    }
    else if(currentView === Views.TagsView){
      return <TagsView></TagsView>
    }
    else if(currentObjective){
      return <ObjectiveView obj={currentObjective}></ObjectiveView>
    }
  }

  const s = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: t.backgroundcolor,
    },
    mainContent: {
      flex: 1,
    },
  });

  return (
    <View style={s.container}>
      <PopMessageContainer></PopMessageContainer>
      <View style={s.mainContent}>
        {getCurrentView()}
      </View>
      <BottomBar
        isSyncing={isSyncing}
        failedSync={failedSync}
        doneSync={doneSync}
        syncObjectivesList={syncObjectivesList}
        isLambdaCold={isLambdaCold}
        isServerUp={isServerUp}
      ></BottomBar>
      <StatusBar backgroundColor={t.backgroundcolor} barStyle={getContent()}/>
    </View>
  );
};



export default Main;