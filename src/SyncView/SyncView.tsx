import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUserContext } from '../Contexts/UserContext';
import { Item, Objective } from '../Types';
import { LoginView } from '../LoginView/LoginView';

interface SyncViewProps {
}

const SyncView: React.FC<SyncViewProps> = (props: SyncViewProps) => {
  const  { theme: t, deletedItems, readItems, lastSync, objectives } = useUserContext();
  const [itemsToSend, setItemsToSend] = useState<string>("0");

  useEffect(() => {
    const load = async () => {
      const result = await getItemsToSend();
      setItemsToSend(result);
    };

    load();
  }, []);

  const getItemsToSend = async (): Promise<string> => {
    let syncItems: Item[] = [];
    let syncObjectives: Objective[] = [];
    if(lastSync){ //^ If there is a last sync date, sync only the new objectives and items
      for(let i = 0; i < objectives.length; i++){
        const current = objectives[i];
        if(current.LastModified > lastSync){
          syncObjectives.push(current);
        }
        else{
        }
        const objItems = await readItems(objectives[i].ObjectiveId);
  
        for(let j = 0; j < objItems.length; j++) {
          const currentItem = objItems[j];
          if(currentItem.LastModified > lastSync){
            syncItems.push(currentItem);
          }
          else{
          }
        }
      }
    }

    return await syncItems.length.toString();
  }

  const getLastSyncText = () => {
    if(!lastSync) return 'No last sync.';

    const formatted = new Date(lastSync).toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });

    return formatted;
  }

  const s = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',

      backgroundColor: t.backgroundcolor,
      paddingVertical: 2,
      paddingHorizontal: 5,

      // borderColor: 'red',
      // borderWidth: 1,
      // borderRadius: 5,
      // borderStyle: 'solid',
    },
    title:{
      color: t.textcolor,
      fontSize: 18,
      fontFamily: 'sans-serif-light',
    },
    infoView:{
      flex: 1,
    },
    buttonsView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={s.container}>
      <View style={s.infoView}>
        <Text style={s.title}>Last sync: {getLastSyncText()}</Text>
        <Text style={s.title}>Items to send: {itemsToSend}</Text>
        <Text style={s.title}>Items to delete: {deletedItems.length}</Text>
      </View>
      <View style={s.buttonsView}>
        <LoginView viewType='Image'/>
      </View>
    </View>
  );
};

export default SyncView;