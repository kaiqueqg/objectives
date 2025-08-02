// LogContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Item, LogLevel, LoginModel, Objective, ObjectiveList, Step, User, UserPrefs, Views, Response, MessageType, ImageInfo, PresignedUrl } from "../Types";
import { useLogContext } from './LogContext';
import { useStorageContext } from './StorageContext';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';

interface RequestProviderProps {
  children: ReactNode;
}

interface RequestContextType {
  identityApi: {
    isUp: (body?: string, fError?: () => void) => Promise<any>,
    login: (body?: string, fError?: () => void) => Promise<LoginModel | null>,
    requestIdentity: <T>(endpoint: string, method: string, body?: string, fError?: () => void) => Promise<T | null>,
  },
  objectivesApi: {
    isUpObjective: (fError?: () => void) => Promise<any>,
    wakeupSync: (fError?: () => void) => Promise<any>,
    getObjectivesList: (fError?: () => void) => Promise<ObjectiveList>,
    syncObjectivesList: (objectivesList: ObjectiveList, fError?: () => void) => Promise<ObjectiveList>,
    backupData: (fError?: () => void) => Promise<boolean>,
    generateGetPresignedUrl: (fileInfo: ImageInfo, fError?: () => void) => Promise<PresignedUrl>,
    generatePutPresignedUrl: (fileInfo: ImageInfo, fError?: () => void) => Promise<PresignedUrl>,
    generateDeletePresignedUrl: (fileInfo: ImageInfo, fError?: () => void) => Promise<PresignedUrl>,
    getImage: (imageInfo: ImageInfo, fError?: () => void) => Promise<string | null>,
    sendImage: (itemId: string, file: File, fError?: () => void) => Promise<boolean>,
    deleteImage: (itemId: string, file: File, fError?: () => void) => Promise<boolean>,
    requestObjectivesList: <T>(endpoint: string, method: string, body?: string, fError?: () => void, wakeup?: boolean) => Promise<T | null>,
  }
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);
const currentLogLevel = LogLevel.Dev;

export const RequestProvider: React.FC<RequestProviderProps> = ({ children }) => {
  const config = Constants.expoConfig?.extra ?? {};
  const { identityUrl, objectivesListUrl } = config;
  const { log, popMessage } = useLogContext();
  const { storage } = useStorageContext();
  
  const errorsWithMessageInResponse = [400, 401, 404, 409, 500, 503];

  const request = async (url: string, endpoint: string, method: string, body?: string, fError?: () => void, wakeup?: boolean): Promise<any> => {
    
    //^Headers
    const headers: {[key: string]: string} = {};
    headers['Content-Type'] = 'application/json';

    //^Authorization
    const token = await storage.readJwtToken();
    if(token !== null) {
      if(!wakeup){
        headers['Authorization'] = "Bearer " + token;
      }
    }

    //^To cancel
    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
      if(fError != undefined) fError();
    }, 60000);

    //^Fetch
    try {
      const response = await fetch(url + endpoint, { headers, method, mode: 'cors', body: body, signal });
      clearTimeout(timeoutId);
      if(response){
        return response;
      }

      return null;
    } 
    catch (error){
      if(fError !== undefined){
        fError();
      }
      else {
        log.err("Error: " + error);
      }

      return undefined;
    }
  }

  const identityApi = {
    async isUp(body?: string, fError?: () => void): Promise<any>{
      return this.requestIdentity('/IsUp', 'GET', body, fError);
    },
    async login(body?: string, fError?: () => void): Promise<LoginModel|null>{
      return this.requestIdentity<LoginModel|null>('/Login', 'POST', body, fError);
    },
    async requestIdentity<T>(endpoint: string, method: string, body?: string, fError?: () => void): Promise<T|null>{
      try {
        const resp = await request(identityUrl, endpoint, method, body, fError);

        if(resp){
          const respData: Response<T> = await resp.json();
          if(!respData.WasAnError && respData.Data){
            return respData.Data;
          }
          else{
            // log.err('Response data:', respData)
            // log.pop(respData.Message);
          }
        }
      } catch (err) {
        // log.err('Error: ', endpoint, err);
      }
      return null;
    },
  }

  const objectivesApi = {
    async isUpObjective(fError?: () => void): Promise<any>{
      return this.requestObjectivesList('/IsUpObjective', 'GET', undefined, fError);
    },
    async wakeupSync(fError?: () => void): Promise<any>{
      return this.requestObjectivesList('/SyncObjectivesList', 'PUT', undefined, fError, true);
    },
    async getObjectivesList(fError?: () => void): Promise<ObjectiveList>{
      return this.requestObjectivesList<ObjectiveList>('/GetObjectivesList', 'GET', undefined, fError);
    },
    async syncObjectivesList(objectivesList: ObjectiveList, fError?: () => void): Promise<ObjectiveList>{
      const rtn = await this.requestObjectivesList<ObjectiveList>('/SyncObjectivesList', 'PUT', JSON.stringify(objectivesList), fError);
      return rtn;
    },
    async backupData(fError?: () => void): Promise<boolean>{
      return this.requestObjectivesList<boolean>('/BackupData', 'GET', undefined, fError);
    },
    async generateGetPresignedUrl(fileInfo: ImageInfo, fError?: () => void): Promise<PresignedUrl>{
      return this.requestObjectivesList<ImageInfo>('/GenerateGetPresignedUrl', 'PUT', JSON.stringify(fileInfo), fError);
    },
    async generatePutPresignedUrl(fileInfo: ImageInfo, fError?: () => void): Promise<PresignedUrl>{
      return this.requestObjectivesList<ImageInfo>('/GeneratePutPresignedUrl', 'PUT', JSON.stringify(fileInfo), fError);
    },
    async generateDeletePresignedUrl(fileInfo: ImageInfo, fError?: () => void): Promise<PresignedUrl>{
      return this.requestObjectivesList<ImageInfo>('/GenerateDeletePresignedUrl', 'PUT', JSON.stringify(fileInfo), fError);
    },
    // async getImage(imageInfo: ImageInfo, fError?: () => void): Promise<File | null> {
    //   const presignedUrlReturn = await this.generateGetPresignedUrl(imageInfo);
    //   try {
    //       const fetchResponse = await fetch(presignedUrlReturn?.url, {
    //         method: 'GET',
    //       });
  
    //       if (fetchResponse.ok) {
    //         const blob = await fetchResponse.blob();
    //         const downloadedFile = new File([blob], imageInfo.fileName);
    //         return downloadedFile;
    //       }
  
    //       return null; // Request failed
    //   } catch (err) {
    //       if (fError !== undefined) fError();
    //       else log.err('Error getting image from S3', err);
  
    //       return null;
    //   }
    // },
    async getImage(imageInfo: ImageInfo, fError?: () => void): Promise<string | null> {
      const presignedUrlReturn = await this.generateGetPresignedUrl(imageInfo);
    
      try {
        if (!presignedUrlReturn?.url) return null;
    
        const localUri = FileSystem.documentDirectory + imageInfo.fileName;
    
        const downloadRes = await FileSystem.downloadAsync(
          presignedUrlReturn.url,
          localUri
        );
    
        if (downloadRes.status === 200) {
          return downloadRes.uri; // This is the local file path
        }
    
        return null;
      } catch (err) {
        if (fError !== undefined) fError();
        else log.err('Error downloading image from S3', err);
    
        return null;
      }
    },
    async sendImage(itemId:string, file: File, fError?: () => void): Promise<boolean>{
      const imageInfo: ImageInfo = { itemId: itemId, fileName: file.name };
      const presignedUrlReturn:PresignedUrl = await this.generatePutPresignedUrl(imageInfo);
      try {
        const uploadResponse = await fetch(presignedUrlReturn?.url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });
  
        if(uploadResponse.ok){
          return true;
        }
  
        return false;
      } catch (err) {
        if(fError !== undefined) fError();
        else log.err('Error sending image to S3', err);
  
        return false;
      }
    },
    async deleteImage(itemId:string, file: File, fError?: () => void): Promise<boolean>{
      log.b('delete');
      const imageInfo: ImageInfo = { itemId: itemId, fileName: file.name };
      log.b('imageInfo', imageInfo);
      const presignedUrlReturn:PresignedUrl = await this.generateDeletePresignedUrl(imageInfo);
      log.b('presignedUrlReturn', presignedUrlReturn);
  
      if(presignedUrlReturn.url === null){
        return false;
      }
  
      try {
        const uploadResponse = await fetch(presignedUrlReturn?.url, {
          method: 'DELETE',
        });
  
        log.b('uploadResponse', uploadResponse);
  
        if(uploadResponse.ok){
          return true;
        }
  
        return false;
      } catch (err) {
        if(fError !== undefined) fError();
        else log.err('Error deleting image from S3', err);
  
        return false;
      }
    },
    //! Responsable to parse and react to equal among all, know, request errors.
    async requestObjectivesList<T>(endpoint: string, method: string, body?: string, fError?: () => void, wakeup?: boolean): Promise<any>{
      try {
        const resp = await request(objectivesListUrl, endpoint, method, body, fError);
        log.dev(objectivesListUrl);

        if(resp){
          const respData: Response<T> = await resp.json();
          // if(wakeup){
          //   return {};
          // }
          if(!respData.WasAnError && respData.Data){
            return respData.Data;
          }
          else{
            switch(respData.Code){
              case 401:
                popMessage(respData.Message??"Unauthorized", MessageType.Error);
                break;
              default:
                //popMessage('Default');
                break;
            }
          }
        }
      } catch (err) {
        if(!wakeup) log.err('Error: ', endpoint, err);
      }
      return null;
    },
  }

  return (
    <RequestContext.Provider 
    value={{
      identityApi,
      objectivesApi,
    }}>
    {children}
    </RequestContext.Provider>
  );
};

export const useRequestContext = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequestContext must be used within a RequestProvider');
  }
  return context;
};
