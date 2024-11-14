// UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Item, Objective, MessageType, User, UserPrefs, Views, PopMessage } from '../Types';
import { ThemePalette, dark } from '../Colors';
import { FontPalette, fontDark, fontPaper, fontWhite } from '../../fonts/Font';
import { useStorageContext } from './StorageContext';
import { useLogContext } from './LogContext';

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { storage } = useStorageContext();
  const { log } = useLogContext();

  useEffect(() => {
    storage.readUser().then((user: any) => {
      setUser(user);
    });
    storage.readUserPrefs().then((userPrefs: any) => {
      if(userPrefs) setUserPrefs(userPrefs);
    })
    loadObjectives();
    loadLastSync();
  }, []);

  const loadObjectives = async () => {
    const storageList = await storage.readObjectives();
    if(storageList) setObjectives(storageList);
  }

  const loadLastSync = async () => {
    const v = await storage.readLastSync();
    if(v) setLastSync(v);
    else log.err('no last sync');
  }

  //^-------------------- USER
  const [user, setUser] = useState<User|null>(null);
  const writeUser = async (user: User) => {
    try {
      await storage.writeUser(user);
      setUser(user);
    } catch (err) {
      log.err('writeUser', 'catch] writing user.');
      return null;
    }
  };
  const deleteUser = async () => {
    try {
      await storage.deleteUser();
      await storage.deleteJwtToken();
      setUser(null);
      setJwtToken(null);
    } catch (error) {
      log.err('deleteUser', '[catch] deleting user.');
    }
  };

  const [userPrefs, setUserPrefs] = useState<UserPrefs>(
    {
      theme: 'dark',
      allowLocation: false,
      vibrate: true,
      autoSync: false, 
    });
  const writeUserPrefs = async (userPrefs: UserPrefs) => {
    try {
      await storage.writeUserPrefs(userPrefs);
      setUserPrefs(userPrefs);

      if(userPrefs.theme === 'dark'){
        setTheme(dark);
        setFontTheme(fontDark);
      }
      else{
        setTheme(dark);
        setFontTheme(fontDark);
      }
    } catch (err) {
      log.err('writeUserPrefs', 'catch] writing user prefs.');
      return null;
    }
  };

  const [theme, setTheme] = useState<ThemePalette>(dark);
  const [fontTheme, setFontTheme] = useState<FontPalette>(fontDark);

  //^-------------------- JWT TOKEN
  const [jwtToken, setJwtToken] = useState<string|null>(null);
  const writeJwtToken = async (token: string) => {
    try {
      await storage.writeJwtToken(token);
      setJwtToken(token);
    } catch (err) {
      log.err('writeJwtToken', '[catch] error: ' + err);
    }
  };
  const deleteJwtToken = async () => {
    try {
      await storage.deleteJwtToken();
      setJwtToken(null);
    } catch (error) {
      log.err('deleteJwtToken', '[catch] deleting jwt token.');
    }
  };

  //^-------------------- VIEW
  const [currentView, setCurrentView] = useState<Views>(Views.ListView);
  const writeCurrentView = async (view: Views) => {
    try {
      await storage.writeCurrentView(view);
      setCurrentView(view);
    } catch (err) {
      log.err('writeCurrentView', 'Problem writing current view', err);
    }
  };

  //^-------------------- CURRENT OBJECTIVE
  const [currentObjectiveId, setCurrentObjectiveId] = useState<string>('');
  const writeCurrentObjectiveId = async (id: string) => {
    try {
      await storage.writeCurrentObjectiveId(id);
      setCurrentObjectiveId(id);
    } catch (err) {
      log.err('writeCurrentView', 'Problem writing current objective id', err);
    }
  };
  const deleteCurrentObjectiveId = async () => {
    try {
      await storage.deleteCurrentObjectiveId();
      setCurrentObjectiveId('');
    } catch (error) {
      log.err('deleteCurrentObjective', '[catch] deleting current objective id.');
    }
  }
  //^-------------------- SYNC
  const [lastSync, setLastSync] = useState<Date|null>(new Date());
  const writeLastSync = async (value: Date) => {
    try {
      await storage.writeLastSync(value);
      setLastSync(value);
    } catch (err) {
      log.err('writeLastSync', 'Problem writing last sync.', err);
    }
  }
  //^-------------------- OBJECTIVES
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const writeObjectives = async (objectives: Objective[]) => {
    try {
      for(let i = 0; i < objectives.length; i++){
        objectives[i].LastModified = (new Date()).toISOString();
      }
      await storage.writeObjectives(objectives);
      setObjectives(objectives);
    } catch (err) {
      log.err('writeObjectives', 'Problem writing objectives.', err);
    }
  };
  const putObjective = async (objective: Objective): Promise<void> => {
    try {
      let newObjs: Objective[] = [...objectives];
      let updated = false;
      for(let i = 0; i < newObjs.length; i++){
        if(newObjs[i].ObjectiveId === objective.ObjectiveId){
          newObjs[i] = objective;
          newObjs[i].LastModified = (new Date()).toISOString();
          updated = true;
        }
      }

      if(!updated){
        objective.LastModified = (new Date()).toISOString();
        newObjs.push(objective);
      }
      await writeObjectives(newObjs);
    } catch (err) {
      log.err('putObjective', 'Problem putting objective', err);
    }
  };
  const deleteObjective = async (objective: Objective) => {
    try {
      let newObjs: Objective[] = objectives.filter((o: Objective) => o.ObjectiveId !== objective.ObjectiveId);

      const dbItems = await storage.readItems(objective.ObjectiveId);
      if(dbItems) {
        let itemsToDelete = dbItems.filter((item: Item) => {
          return objective.ObjectiveId === item.UserIdObjectiveId.slice(-40);
        });
        
        for(let i = 0; i < itemsToDelete.length; i++){
          await deleteItem(itemsToDelete[i]);
        }
      }

      //!Write new objectives
      await storage.writeObjectives(newObjs);
      setObjectives(newObjs);

      //!Adding to deteled
      let newDeletedObj = [...deletedObjectives];
      newDeletedObj.push(objective);
      setDeletedObjectives(newDeletedObj);
      await storage.writeDeletedObjectives(newDeletedObj);
    } catch (err) {
      log.err('deleteObjective', 'Problem deleting objective', err);
    } 
  };
  const clearObjectives = async () => {
    try {
      await storage.clear();
    } catch (err) {
      log.err('deleteObjectives', 'Problem deleting objectives', err);
    }
  };
  const putObjectives = async (objs: Objective[]) => {
    try {
      for(let i = 0; i < objs.length; i++){
        objs[i].LastModified = (new Date()).toISOString();
      }
      let newObjectives: Objective[] = [...objectives];
      for (let i = 0; i < objs.length; i++) {
        let updated = false;
        for(let j = 0; j < newObjectives.length; j++){
          if(newObjectives[j].ObjectiveId === objs[i].ObjectiveId){
            newObjectives[j] = {...newObjectives[j], ...objs[i]};
            updated = true;
          }
        }
        if(!updated){
          newObjectives.push({...objs[i]});
        }
      }
      await storage.writeObjectives(newObjectives);
      setObjectives(newObjectives);
    } catch (err) {
      log.err('putItem', 'Problem putting objectives', err);
    }
  };

  //^-------------------- ITEM
  const readItems = async (objectiveId: string) => {
    try {
      const items = await storage.readItems(objectiveId);
      if(items) return items;
      else return [];
    } catch (err) {
      log.err('readItems', 'Problem reading items.', err);
      return [];
    }
  }
  const writeItems = async (objectiveId: string, items: Item[]): Promise<void> => {
    try {
      await storage.writeItems(objectiveId, items);
    } catch (err) {
      log.err('writeItems', 'Problem writing items.', err);
    }
  }
  const putItem = async (item: Item) => {
    try {
      const dbItems = await storage.readItems(item.UserIdObjectiveId.slice(40));
      let newItems: Item[] = [];
      if(dbItems) {
        newItems = [...dbItems];
        let updated = false;
        
        for(let i = 0; i < newItems.length; i++){
          if(newItems[i].ItemId === item.ItemId && newItems[i].UserIdObjectiveId === item.UserIdObjectiveId){
            newItems[i] = {...newItems[i], ...item};
            newItems[i].LastModified = (new Date()).toISOString();
            updated = true;
          }
        }
        if(!updated){
          item.LastModified = (new Date()).toISOString();
          newItems.push({...item});
        }
      }
      else{
        newItems.push({...item});
      }

      await storage.writeItems(item.UserIdObjectiveId.slice(40), newItems);
    } catch (err) {
      log.err('putItem', 'Problem putting items', err);
    }
  };
  const deleteItem = async (item: Item) => {
    try {
      const dbItems = await storage.readItems(item.UserIdObjectiveId.slice(40));
      if(!dbItems) return;

      let newItems: Item[] = dbItems.filter((s: Item) => item.ItemId !== s.ItemId);
      await storage.writeItems(item.UserIdObjectiveId.slice(40), newItems);
      
      let newDeleted = [...deletedItems];
      newDeleted.push(item);
      setDeletedItems(newDeleted);
      await storage.writeDeletedItems(newDeleted);
    } catch (err) {
      log.err('deleteItem', 'Problem deleting item', err);
    }
  };
  const putItems = async (objectiveId: string, its: Item[]) => {
    try {
      for(let i = 0; i < its.length; i++){
        its[i].LastModified = (new Date()).toISOString();
      }
      const dbItems = await storage.readItems(objectiveId);
      let newItems: Item[] = [];

      if(dbItems){
        newItems = [...dbItems];
        for (let i = 0; i < its.length; i++) {
          let updated = false;
          for(let j = 0; j < newItems.length; j++){
            if(newItems[j].ItemId === its[i].ItemId){
              newItems[j] = {...newItems[j], ...its[i]};
              updated = true;
            }
          }
          if(!updated){
            newItems.push({...its[i]});
          }
        }
      }
      else{
        its.forEach((item)=>{
          newItems.push(item);
        })
      }

      await storage.writeItems(objectiveId, newItems);
    } catch (err) {
      log.err('putItem', 'Problem putting item', err);
    }
  };
  //^-------------------- DELETED
  const [deletedObjectives, setDeletedObjectives] = useState<Objective[]>([]);
  const [deletedItems, setDeletedItems] = useState<Item[]>([]);
  const pushDeletedObjective = async (obj: Objective) => {
    try {
      let newObjs = {...deletedObjectives};
      newObjs.push(obj);
  
      await storage.writeDeletedObjectives(newObjs);
      setDeletedObjectives(newObjs);
    } catch (err) {
      log.err('pushDeletedObjective', 'Problem putting deleted item', err);
    }
  };
  const deleteDeletedObjectives = async () => {
    try {
      await storage.deleteDeletedObjectives();
      await setDeletedObjectives([]);
    } catch (err) {
      log.err('deleteDeletedObjectives', 'Problem deleting deleted objectives', err);
    }
  };
  const pushDeletedItem = async (item: Item) => {
    try {
      let newItems = {...deletedItems};
      newItems.push(item);
  
      await storage.writeDeletedItems(newItems);
      setDeletedItems(newItems);
    } catch (err) {
      log.err('pushDeletedItem', 'Problem putting deleted item', err);
    }
  };
  const deleteDeletedItems = async () => {
    try {
      await storage.deleteDeletedItems();
      await setDeletedItems([]);
    } catch (err) {
      log.err('deleteDeletedItems', 'Problem deleting deleted item', err);
    }
  };
  const clearAllData = async () =>{ 
    await deleteJwtToken();
    await deleteUser();
    await clearObjectives();
  };

  return (
    <UserContext.Provider 
      value={{
        user, writeUser, deleteUser,
        userPrefs, writeUserPrefs,
        theme, fontTheme,
        currentView, writeCurrentView, 
        currentObjectiveId, writeCurrentObjectiveId, deleteCurrentObjectiveId,
        jwtToken, writeJwtToken, deleteJwtToken,
        lastSync, writeLastSync,
        objectives,writeObjectives, deleteObjectives: clearObjectives, putObjective, putObjectives, deleteObjective,
        readItems, writeItems, putItem, deleteItem, putItems,
        deletedObjectives, pushDeletedObjective, deleteDeletedObjectives,
        deletedItems, pushDeletedItem, deleteDeletedItems,
        clearAllData,
      }}>
      {children}
    </UserContext.Provider>
  );
};

interface UserContextType {
  //^USER
  user: User|null,
  writeUser: (user: User) => void,
  deleteUser: () => void,
  userPrefs: UserPrefs, 
  writeUserPrefs: (userPrefs: UserPrefs) => void,
  theme: ThemePalette,
  fontTheme: FontPalette,
  //^VIEW
  currentView: Views,
  writeCurrentView: (view: Views) => void,
  currentObjectiveId: string,
  writeCurrentObjectiveId: (view: string) => void,
  deleteCurrentObjectiveId: () => void,
  //^JWT TOKEN
  jwtToken: string|null,
  writeJwtToken: (token: string) => void, 
  deleteJwtToken: () => void,
  //^SYNC
  lastSync: Date|null,
  writeLastSync: (date: Date) => void,
  //^OBJECTIVE LIST
  objectives: Objective[],
  writeObjectives: (objective: Objective[]) => void,
  putObjective: (objective: Objective) => void,
  putObjectives: (objectives: Objective[]) => void,
  deleteObjective: (objective: Objective) => void,
  deleteObjectives: () => void,
  readItems: (objectiveId: string) => Promise<Item[]>,
  writeItems: (objectiveId: string, items: Item[]) => void,
  putItem: (item: Item) => void,
  deleteItem: (item: Item) => void,
  putItems: (objectiveId: string, items: Item[]) => void,
  //Deleted
  deletedObjectives: Objective[],
  pushDeletedObjective: (obj: Objective) => void, 
  deleteDeletedObjectives: () => void,
  deletedItems: Item[],
  pushDeletedItem: (item: Item) => void, 
  deleteDeletedItems: () => void,
  clearAllData: () => void,
}

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
