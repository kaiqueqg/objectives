// LogContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Item, ItemImage, LogLevel, LoginModel, Objective, Step, StorageInfo, User, UserPrefs, Views } from "../Types";
import { useLogContext } from './LogContext';

interface StorageProviderProps {
  children: ReactNode;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);
const currentLogLevel = LogLevel.Dev;

export const StorageProvider: React.FC<StorageProviderProps> = ({ children }) => {
  const { log, popMessage } = useLogContext();
  type StorageKeys = {
    User: string,
    UserPrefs: string,
    JwtToken: string,
    CurrentView: string,
    AvailableTags: string,
    SelectedTags: string,
    CurrentObjectiveId: string,
    LastSync: string,
    Objectives: string,
    Items: string,
    DeletedObjectives: string,
    DeletedItems: string,
    Images: string,
    NewImages: string,
  };
  
  const keys: StorageKeys = {
    User: '@Objectives:user',
    UserPrefs: '@Objectives:userprefs',
    JwtToken: '@Objectives:jwt',
    CurrentView: '@Objectives:CurrentView',
    AvailableTags: '@Objectives:AvailableTags',
    SelectedTags: '@Objectives:SelectedTags',
    CurrentObjectiveId: '@Objectives:CurrentObjectiveId',
    LastSync: '@Objectives:LastSync',
    Objectives: '@Objectives:Objectives',
    Items: '@Objectives:Items',
    DeletedObjectives: '@Objectives:DeletedObjectives',
    DeletedItems: '@Objectives:DeletedItems',
    Images: '@Objectives:Images',
    NewImages: '@Objectives:NewImages',
  };

  const storage = {
  
    randomId(size?: number){
      const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let randomString = "";
      const amount = size ?? 40;
      for (let i = 0; i < amount; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset.charAt(randomIndex);
      }
      return randomString;
    },
  
    async writeUser(user: User){
      try {
        await AsyncStorage.setItem(keys.User, JSON.stringify(user));
      } catch (err) {
        log.err('writeUser', 'catch] writing user.');
        return null;
      }
    },
  
    async readUser(){
      try {
        const user = await AsyncStorage.getItem(keys.User);
        if(user !== null){
          try {
            const parsedUser: User = JSON.parse(user);
            return parsedUser;
          } catch (err) {
            log.err('readUser', 'Error parsing json');
          }
        }
        log.err('readUser', 'returning null')
        return null;
      } catch (err) {
        log.err('readUser', '[catch] reading user.');
        return null;
      }
    },
  
    async deleteUser(){
      try {
        await AsyncStorage.removeItem(keys.User);
      } catch (error) {
        log.err('deleteUser', '[catch] deleting user.');
      }
    },
    
    async writeJwtToken(token: string){
      try {
        await AsyncStorage.setItem(keys.JwtToken, token);
      } catch (err) {
        log.err('writeJwtToken', '[catch] error: ' + err);
        popMessage('Error getting saved login info.');
      }
    },
    
    async readJwtToken(){
      try {
        const token = await AsyncStorage.getItem(keys.JwtToken);
        if(token === null){
          return null;
        }
        else{
          return token;
        }
      } catch (err) {
        log.war('readJwtToken', '[catch] error: ' + err);
        return null
      }
    },
  
    async deleteJwtToken(){
      try {
        await AsyncStorage.removeItem(keys.JwtToken);
      } catch (error) {
        log.err('readJwtToken', '[catch] deleting jwt token.');
      }
    },
  
    async writeUserPrefs(userPrefs: UserPrefs){
      try{
        await AsyncStorage.setItem(keys.UserPrefs, JSON.stringify(userPrefs));
      } catch (err){
        log.err('writeUserPrefs', '[catch] writing user prefs.');
        log.pop('Error getting user preferences.');
      }
    },
  
    async readUserPrefs(){
      try {
        const userPrefs = await AsyncStorage.getItem(keys.UserPrefs);
      
        if(userPrefs === null){
          return null;
        }
        else{
          const parsedUserPrefs: UserPrefs = JSON.parse(userPrefs);
          return parsedUserPrefs;
        }
      } catch (err) {
        log.err('readJwtToken', '[catch] reading jwt token.');
        return null
      }
    },
  
    //^-------------------- CURRENT VIEW
    async writeCurrentView(view: Views): Promise<void> {
      try {
        await AsyncStorage.setItem(keys.CurrentView, JSON.stringify(view));
      } catch (err) {
        log.err('stg writeCurrentView', '[catch] writing current view.');
      }
    },
    async readCurrentView(): Promise<Views|null> {
      try {
        const data = await AsyncStorage.getItem(keys.CurrentView);
        if(data !== null){
          try {
            const parsedData: Views = JSON.parse(data);
            return parsedData;
          } catch (err) {
            log.err('stg readCurrentView', 'Error parsing json');
          }
        }
        return null;
      } catch (err) {
        log.err('stg readCurrentView', '[catch] reading current view.');
        return null;
      }
    },
    async deleteCurrentView(): Promise<void> {
      try {
        await AsyncStorage.removeItem(keys.CurrentView);
      } catch (err) {
        log.err('deleteCurrentView', '[catch] deleting current view.');
      }
    },
  
    async writeCurrentObjectiveId(id: string): Promise<void> {
      try {
        await AsyncStorage.setItem(keys.CurrentObjectiveId, JSON.stringify(id));
      } catch (err) {
        log.err('writeCurrentObjectiveId', '[catch] writing current objective.');
      }
    },
    async readCurrentObjectiveId(): Promise<string|null> {
      try {
        const data = await AsyncStorage.getItem(keys.CurrentObjectiveId);
        if(data !== null){
          try {
            const parsedData: string = JSON.parse(data);
            return parsedData;
          } catch (err) {
            log.err('readCurrentObjectiveId', 'Error parsing json');
          }
        }
        return null;
      } catch (err) {
        log.err('readCurrentObjective', '[catch] reading current objective.');
        return null;
      }
    },
    async deleteCurrentObjectiveId(): Promise<void> {
      try {
        await AsyncStorage.removeItem(keys.CurrentObjectiveId);
      } catch (err) {
        log.err('deleteCurrentObjectiveId', '[catch] deleting current objective.');
      }
    },
    //^-------------------- TAGS
    async writeAvailableTags(tags: string[]): Promise<void> {
      try {
        await AsyncStorage.setItem(keys.AvailableTags, JSON.stringify(tags));
      } catch (err) {
        log.err('stg writeAvailableTags', '[catch] writing available tags.');
      }
    },
    async readAvailableTags(): Promise<string[]|null> {
      try {
        const data = await AsyncStorage.getItem(keys.AvailableTags);
        if(data !== null){
          try {
            const parsedData: string[] = JSON.parse(data);
            return parsedData;
          } catch (err) {
            log.err('stg readAvailableTags', 'Error parsing json');
          }
        }
        return null;
      } catch (err) {
        log.err('stg readAvailableTags', '[catch] reading available tags.');
        return null;
      }
    },
    async writeSelectedTags(tags: string[]): Promise<void> {
      try {
        await AsyncStorage.setItem(keys.SelectedTags, JSON.stringify(tags));
      } catch (err) {
        log.err('stg writeSelectedTags', '[catch] writing selected tags.');
      }
    },
    async readSelectedTags(): Promise<string[]|null> {
      try {
        const data = await AsyncStorage.getItem(keys.SelectedTags);
        if(data !== null){
          try {
            const parsedData: string[] = JSON.parse(data);
            return parsedData;
          } catch (err) {
            log.err('stg readSelectedTags', 'Error parsing json');
          }
        }
        return null;
      } catch (err) {
        log.err('stg readSelectedTags', '[catch] reading selected tags.');
        return null;
      }
    },
    //^-------------------- SYNC
    async readLastSync(): Promise<Date|null> {
      try {
        const data = await AsyncStorage.getItem(keys.LastSync);
        if(data !== null){
          try {
            const parsedData: string = JSON.parse(data);
            return new Date(parsedData);
          } catch (err) {
            log.err('readLastSync', 'Error parsing json');
          }
        }
  
        return null;
      } catch (err) {
        log.err('readLastSync', '[catch] reading last sync.');
        return null;
      }
    },
    async writeLastSync(now: Date): Promise<void> {
      try {
        await AsyncStorage.setItem(keys.LastSync, JSON.stringify(now));
      } catch (err) {
        log.err('deleteCurrentObjectiveId', '[catch] writing current last sync.');
      }
    },
    //^-------------------- OBJECTIVES
    async readObjectives(): Promise<Objective[]|null> {
      try {
        const data = await AsyncStorage.getItem(keys.Objectives);
        if(data !== null){
          try {
            const parsedData: Objective[] = JSON.parse(data);
            return parsedData;
          } catch (err) {
            log.err('readObjectives', 'Error parsing json');
          }
        }
  
        return null;
      } catch (err) {
        log.err('readObjectives', '[catch] reading objectives.');
        return null;
      }
    },
    async writeObjectives(objs: Objective[]): Promise<void> {
      try {
        await AsyncStorage.setItem(keys.Objectives, JSON.stringify(objs));
      } catch (err) {
        log.err('writeObjectives', '[catch] writing objectives.');
      }
    },
    async deleteObjectives(): Promise<void> {
      try {
        await AsyncStorage.removeItem(keys.Objectives);
      } catch (err) {
        log.err('deleteObjectives', '[catch] deleting objectives.');
      }
    },
    //^-------------------- ITEMS
    async readItems(objectiveId?: string): Promise<Item[]|null> {
      try {
        if(objectiveId){
          const data = await AsyncStorage.getItem(keys.Items+':'+objectiveId);
          if(data !== null){
            try {
              const parsedData: Item[] = JSON.parse(data);
              return parsedData;
            } catch (err) {
              log.err('readItems', 'Error parsing json');
            }
          }
        }
        else{
          const objectives = await this.readObjectives();

          if(objectives){
            let allItems: Item[] = [];

            for (let i = 0; i < objectives.length; i++) {
              const obj = objectives[i];
              const data = await AsyncStorage.getItem(keys.Items + ':' + obj.ObjectiveId);
              if (data !== null) {
                try {
                  const parsedData: Item[] = JSON.parse(data);
                  allItems = allItems.concat(parsedData);
                } catch (err) {
                  log.err('readItems', `Error parsing json for objective ${obj.ObjectiveId}`);
                }
              }
            }

            return allItems;
          }
        }

        
        return null;
      } catch (err) {
        log.err('readItems', '[catch] reading items.');
        return null;
      }
    },
    async writeItems(objectiveId: string, items: Item[]): Promise<void> {
      try {
        await AsyncStorage.setItem(keys.Items + ':' + objectiveId, JSON.stringify(items));
      } catch (err) {
        log.err('writeItems', '[catch] writing items.');
      }
    },
    async deleteItems(): Promise<void> {
      try {
        await AsyncStorage.removeItem(keys.Items);
      } catch (err) {
        log.err('deleteItems', '[catch] deleting items.');
      }
    },
    async clear() {
      await AsyncStorage.clear();
    },
    //^-------------------- DELETED
    async readDeletedObjectives(): Promise<Objective[]|null> {
      try {
        const data = await AsyncStorage.getItem(keys.DeletedObjectives);
        if(data !== null){
          try {
            const parsedData: Objective[] = JSON.parse(data);
            return parsedData;
          } catch (err) {
            log.err('readDeletedObjectives', 'Error parsing json');
          }
        }
        return null;
      } catch (err) {
        log.err('readDeletedObjectives', '[catch] reading deleted objectives.');
        return null;
      }
    },
    async writeDeletedObjectives(objectives: Objective[]): Promise<void> {
      try {
        await AsyncStorage.setItem(keys.DeletedObjectives, JSON.stringify(objectives));
      } catch (err) {
        log.err('writeDeleteObjectives', '[catch] writing deleted objectives.');
      }
    },
    async deleteDeletedObjectives(): Promise<void> {
      try {
        await AsyncStorage.removeItem(keys.DeletedObjectives);
      } catch (err) {
        log.err('deleteDeletedObjectives', '[catch] deleting deleted objectives.');
      }
    },
    async readDeletedItems(): Promise<Item[]|null> {
      try {
        const data = await AsyncStorage.getItem(keys.DeletedItems);
        if(data !== null){
          try {
            const parsedData: Item[] = JSON.parse(data);
            return parsedData;
          } catch (err) {
            log.err('readDeletedItems', 'Error parsing json');
          }
        }
        return null;
      } catch (err) {
        log.err('readDeletedObjectives', '[catch] reading deleted items.');
        return null;
      }
    },
    async writeDeletedItems(items: Item[]): Promise<void> {
      try {
        await AsyncStorage.setItem(keys.DeletedObjectives, JSON.stringify(items));
      } catch (err) {
        log.err('writeDeletedItems', '[catch] writing deleted items.');
      }
    },
    async deleteDeletedItems(): Promise<void> {
      try {
        await AsyncStorage.removeItem(keys.DeletedItems);
      } catch (err) {
        log.err('deleteDeletedItems', '[catch] deleting deleted items.');
      }
    },
    //^-------------------- IMAGES
    async readImages(): Promise<ItemImage[]|null> {
      try {
        const data = await AsyncStorage.getItem(keys.Images);
        if(data !== null){
          try {
            const parsedData: ItemImage[] = JSON.parse(data);
            return parsedData;
          } catch (err) {
            log.err('readImages', 'Error parsing json');
          }
        }
        return null;
      } catch (err) {
        log.err('readImages', '[catch] reading images.');
        return null;
      }
    },
    async writeImages(images: ItemImage[]): Promise<void> {
      try {
        await AsyncStorage.setItem(keys.Images, JSON.stringify(images));
      } catch (err) {
        log.err('writeImages', '[catch] writing images.');
      }
    },
    async deleteImages(): Promise<void> {
      try {
        await AsyncStorage.removeItem(keys.Images);
      } catch (err) {
        log.err('deleteImages', '[catch] deleting images.');
      }
    },
    async readNewImages(): Promise<ItemImage[]|null> {
      try {
        const data = await AsyncStorage.getItem(keys.NewImages);
        if(data !== null){
          try {
            const parsedData: ItemImage[] = JSON.parse(data);
            return parsedData;
          } catch (err) {
            log.err('readNewImages', 'Error parsing json');
          }
        }
        return null;
      } catch (err) {
        log.err('readNewImages', '[catch] reading new images.');
        return null;
      }
    },
    async writeNewImages(images: ItemImage[]): Promise<void> {
      try {
        await AsyncStorage.setItem(keys.NewImages, JSON.stringify(images));
      } catch (err) {
        log.err('writeNewImages', '[catch] writing new images.');
      }
    },
    async deleteNewImages(): Promise<void> {
      try {
        await AsyncStorage.removeItem(keys.NewImages);
      } catch (err) {
        log.err('deleteNewImages', '[catch] deleting new images.');
      }
    },
  }
  return (
    <StorageContext.Provider 
    value={{
      storage,
    }}>
    {children}
    </StorageContext.Provider>
  );
};

interface StorageContextType {
  storage:any,
}

export const useStorageContext = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorageContext must be used within a StorageProvider');
  }
  return context;
};
