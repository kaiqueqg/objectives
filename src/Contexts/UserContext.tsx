// UserContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Item, Objective, MessageType, User, UserPrefs, Views, PopMessage, StoredImage, DefaultUser } from '../Types';
import { AppPalette, dark, globalStyle as gs, light } from '../Colors';
import { FontPalette, fontDark, fontPaper, fontWhite } from '../../fonts/Font';
import { useStorageContext } from './StorageContext';
import { useLogContext } from './LogContext';
import * as LocalAuthentication from 'expo-local-authentication';

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
      if(userPrefs.theme === 'dark'){
        setTheme(dark);
        setFontTheme(fontDark);
      }
      else if(userPrefs.theme === 'light'){
        setTheme(light);
        setFontTheme(fontDark);
      }
    })
    loadObjectives();
    loadLastSync();
  }, []);

  const checkUserInteg = () => {
    
  }

  const loadObjectives = async () => {
    const storageList = await storage.readObjectives();
    if(storageList) {
      setObjectives(storageList);

      const tags = ['Pin'];
      for(let i = 0; i < storageList.length; i++){
        tags.push(...storageList[i].Tags);
      }
      const uniqueTags = Array.from(new Set(tags));
      setAvailableTags(uniqueTags);
      await storage.writeAvailableTags(uniqueTags);

      const v = await storage.readSelectedTags();
      if (v) {
        const filteredTags = v.filter((tag: string) => uniqueTags.includes(tag));
        setSelectedTags(filteredTags);
        await storage.writeSelectedTags(filteredTags);
      } else {
        // log.err('no selected tags');
      }
    }
  }

  const loadAvailableTags = async (objsList: Objective[]) => {
    const storageList = await storage.readObjectives();
    if(storageList) {
      const tags = [];
      for(let i = 0; i < storageList.length; i++){
        tags.push(...storageList[i].Tags);
      }
      const uniqueTags = Array.from(new Set(tags));
      setAvailableTags(uniqueTags);
      await storage.writeAvailableTags(uniqueTags);

      const v = await storage.readSelectedTags();
      if (v) {
        const filteredTags = v.filter((tag: string) => uniqueTags.includes(tag));
        setSelectedTags(filteredTags);
        await storage.writeSelectedTags(filteredTags);
      } else {
        // log.err('no selected tags');
      }
    }
  }

  const loadLastSync = async () => {
    const v = await storage.readLastSync();
    if(v) setLastSync(v);
    else log.err('no last sync');
  }

  //^-------------------- USER
  const [user, setUser] = useState<User>(DefaultUser);
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
      setUser(DefaultUser);
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
      ObjectivesPrefs: {iconsToDisplay: [
        'Archive', 'Unarchive', 'Palette', 'Checked', 'Tags', 'Sorted', 'Pos', 'Add', 'Search', 'IsLocked'
      ]},
      warmLocationOff: true,
      singleTagSelected: false,
      shouldLockOnOpen: false,
      shouldLockOnReopen: false,
    });
  const writeUserPrefs = async (userPrefs: UserPrefs) => {
    try {
      await storage.writeUserPrefs(userPrefs);
      setUserPrefs(userPrefs);

      if(userPrefs.theme === 'dark'){
        setTheme(dark);
        setFontTheme(fontDark);
      }
      else if(userPrefs.theme === 'light'){
        setTheme(light);
        setFontTheme(fontDark);
      }
    } catch (err) {
      log.err('writeUserPrefs', 'catch] writing user prefs.');
      return null;
    }
  };

  const [theme, setTheme] = useState<AppPalette>(dark);
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
  //^-------------------- TAGS
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const writeAvailableTags = async (availableTags: string[]) => {
    try {
      const uniqueTags: string[] = Array.from(new Set(['Pin', ...availableTags]));
      await storage.writeAvailableTags(uniqueTags);
      setAvailableTags(uniqueTags);
    } catch (err) {
      log.err('AvailableTags', 'Problem writing available tags', err);
    }
  };
  const putAvailableTags = async (tags: string[]) => {
    try {
      const newTags = Array.from(new Set([...availableTags, ...tags]));
      await writeAvailableTags(newTags);
    } catch (err) {
      log.err('putAvailableTags', 'Problem putting available tags', err);
    }
  };
  const removeAvailableTags = async (tags: string[]) => {
    try {
      const newTags = availableTags.filter(t => !tags.includes(t));
      await writeAvailableTags(newTags);
    } catch (err) {
      log.err('removeAvailableTags', 'Problem removing available tags', err);
    }
  };
  const removeAvailableTagsIfUnique = async (tags: string[]) => {
    try {
      const objs = await storage.readObjectives();
      if (!objs || objs.length === 0) return;

      const requested = Array.from(new Set(tags));

      let tagsToRemove:string[] = [];

      for (let i = 0; i < requested.length; i++) {
        const tag = requested[i];
        let objsWithTag = 0;
        
        for (let j = 0; j < objs.length; j++) {
          const o = objs[j];
          if(o.Tags.includes(tag)) objsWithTag++;
        }

        if(objsWithTag === 0) tagsToRemove.push(tag); //unique
      }

      const newTags = availableTags.filter(t => !tagsToRemove.includes(t));
      await writeAvailableTags(newTags);
    } catch (err) {
      log.err('removeAvailableTags', 'Problem removing available tags', err);
    }
  }
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const writeSelectedTags = async (selectedTags: string[]) => {
    try {
      const uniqueTags: string[] = Array.from(new Set(['Pin', ...selectedTags]));
      await storage.writeSelectedTags(uniqueTags);
      setSelectedTags(uniqueTags);
    } catch (err) {
      log.err('SelectedTags', 'Problem writing selected tags', err);
    }
  };
  const putSelectedTags = async (tags: string[]) => {
    try {
      const newTags = Array.from(new Set([...selectedTags, ...tags]));
      await writeSelectedTags(newTags);
    } catch (err) {
      log.err('putSelectedTags', 'Problem putting selected tags', err);
    }
  };
  const removeSelectedTags = async (tags: string[]) => {
    try {
      const newTags = selectedTags.filter(t => !tags.includes(t));
      await writeSelectedTags(newTags);
    } catch (err) {
      log.err('removeSelectedTags', 'Problem removing selected tags', err);
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
      const sortedObjs = newObjectives.sort((a: Objective, b: Objective) => a.Pos - b.Pos);
      await storage.writeObjectives(sortedObjs);
      setObjectives(sortedObjs);
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
    await storage.clear();
    setUser(DefaultUser);
    setJwtToken(null);
    setAvailableTags(['Pin']);
    setSelectedTags(['Pin']);
    setCurrentObjectiveId('');
    setLastSync(null);
    setObjectives([]);
    setDeletedObjectives([]);
    setDeletedItems([]);
  };

  //^-------------------- IMAGES
  const [storedImages, setStoredImages] = useState<StoredImage[]>([]);
  const putStoredImages = async (images: StoredImage[]) => {
    
  };
  const deleteStoredImages = async (images: StoredImage[]) => {
    
  };
  const [storedNewImages, setStoredNewImages] = useState<StoredImage[]>([]);
  const putStoredNewImages = async (images: StoredImage[]) => {
    
  };
  const deleteStoredNewImages = async (images: StoredImage[]) => {
    
  };

  //^-------------------- Security
  const requestBiometricAuth = async (message: string, fallbackMessage: string): Promise<boolean> => {
    

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Comfirm with your fingerprint',
      fallbackLabel: 'User the code.',
    });

    return result.success;
  }

  return (
    <UserContext.Provider 
      value={{
        //^USER
        user, writeUser,
        userPrefs, writeUserPrefs,
        theme, fontTheme,
        //^JWT TOKEN
        jwtToken, writeJwtToken,
        //^VIEW
        currentView, writeCurrentView,
        currentObjectiveId, writeCurrentObjectiveId,
        //^TAGS
        availableTags, putAvailableTags, removeAvailableTags, writeAvailableTags, removeAvailableTagsIfUnique,
        selectedTags, putSelectedTags, removeSelectedTags, writeSelectedTags,
        //^SYNC
        lastSync, writeLastSync,
        //^OBJECTIVE LIST
        objectives,writeObjectives, putObjective, putObjectives, deleteObjective,
        readItems, writeItems, putItem, deleteItem, putItems,
        //^DELETED
        deletedObjectives, pushDeletedObjective, deleteDeletedObjectives,
        deletedItems, pushDeletedItem, deleteDeletedItems,
        //ÎMAGES

        //^HELPERS
        clearAllData,

        //^SECURITY
        requestBiometricAuth,
      }}>
      {children}
    </UserContext.Provider>
  );
};

interface UserContextType {
  //^USER
  user: User, writeUser: (user: User) => void,
  userPrefs: UserPrefs,  writeUserPrefs: (userPrefs: UserPrefs) => void,
  theme: AppPalette, fontTheme: FontPalette,
  //^JWT TOKEN
  jwtToken: string|null, writeJwtToken: (token: string) => void, 
  //^VIEW
  currentView: Views, writeCurrentView: (view: Views) => void,
  currentObjectiveId: string, writeCurrentObjectiveId: (view: string) => void,
  //^TAGS
  availableTags: string[], writeAvailableTags: (availableTags: string[]) => void, putAvailableTags: (tag: string[]) => void, removeAvailableTags: (tag: string[]) => void,
  selectedTags: string[], writeSelectedTags: (selectedTags: string[]) => void, putSelectedTags: (tags: string[]) => void, removeSelectedTags: (tags: string[]) => void, removeAvailableTagsIfUnique: (tags: string[]) => void
  //^SYNC
  lastSync: Date|null, writeLastSync: (date: Date) => void,
  //^OBJECTIVE LIST
  objectives: Objective[],
  writeObjectives: (objective: Objective[]) => void, putObjective: (objective: Objective) => void, putObjectives: (objectives: Objective[]) => void,
  deleteObjective: (objective: Objective) => void,
  readItems: (objectiveId: string) => Promise<Item[]>, writeItems: (objectiveId: string, items: Item[]) => void, putItem: (item: Item) => void,
  deleteItem: (item: Item) => void, putItems: (objectiveId: string, items: Item[]) => void,
  //^DELETED
  deletedObjectives: Objective[], pushDeletedObjective: (obj: Objective) => void, deleteDeletedObjectives: () => void,
  deletedItems: Item[], pushDeletedItem: (item: Item) => void,  deleteDeletedItems: () => void,
  //^HELPERS
  clearAllData: () => void,
  //^SECURITY
  requestBiometricAuth: () => Promise<boolean>
}

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
