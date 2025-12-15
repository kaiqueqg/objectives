// LogContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Item, LogLevel, LoginResponse, Objective, ObjectiveList, Step, User, UserPrefs, Views, Response, MessageType, ImageInfo, PresignedUrl, TwoFactorAuthRequest } from "../Types";
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
    login: (body?: string, fError?: () => void) => Promise<LoginResponse | null>,
    activateTwoFA(request: TwoFactorAuthRequest, fError?: () => void): Promise<string|null>;
    deactivateTwoFA(request: TwoFactorAuthRequest, fError?: () => void): Promise<string|null>;
    validateTwoFA(code: TwoFactorAuthRequest, fError?: () => void): Promise<LoginResponse|null>;
    requestIdentity: <T>(endpoint: string, method: string, body?: string, fError?: () => void) => Promise<T | null>,
  },
  objectivesApi: {
    isUpObjective: (fError?: () => void) => Promise<any>,
    getObjectivesList: (fError?: () => void) => Promise<ObjectiveList|null>,
    syncObjectivesList: (objectivesList: ObjectiveList, fError?: () => void) => Promise<ObjectiveList|null>,
    backupData: (fError?: () => void) => Promise<boolean|null>,
    generateGetPresignedUrl: (fileInfo: ImageInfo, fError?: () => void) => Promise<PresignedUrl|null>,
    generatePutPresignedUrl: (fileInfo: ImageInfo, fError?: () => void) => Promise<PresignedUrl|null>,
    generateDeletePresignedUrl: (fileInfo: ImageInfo, fError?: () => void) => Promise<PresignedUrl|null>,
    getImage: (imageInfo: ImageInfo, fError?: () => void) => Promise<string | null>,
    sendImage: (itemId: string, file: File, fError?: () => void) => Promise<boolean|null>,
    deleteImage: (itemId: string, file: File, fError?: () => void) => Promise<boolean|null>,
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
  
  const request = async (url: string, endpoint: string, method: string, body?: string, fError?: () => void): Promise<any> => {
    //^Headers
    const headers: {[key: string]: string} = {};
    headers['Content-Type'] = 'application/json';

    //^Authorization
    const token = await storage.readJwtToken();
    if(token !== null) {
      headers['Authorization'] = "Bearer " + token;
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
      popMessage('Something really wrong with server route.', MessageType.Alert);
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
    async login(body?: string, fError?: () => void): Promise<LoginResponse|null>{
      return this.requestIdentity<LoginResponse|null>('/Login', 'POST', body, fError);
    },
    async activateTwoFA(code: TwoFactorAuthRequest, fError?: () => void): Promise<string|null>{
      return await this.requestIdentity<string>('/ActivateTwoFA', 'POST', JSON.stringify(code), fError);
    },
    async deactivateTwoFA(code: TwoFactorAuthRequest, fError?: () => void): Promise<string|null>{
      return await this.requestIdentity<string>('/DeactivateTwoFA', 'POST', JSON.stringify(code), fError);
    },
    async validateTwoFA(code: TwoFactorAuthRequest, fError?: () => void): Promise<LoginResponse|null>{
      return await this.requestIdentity<LoginResponse|null>('/ValidateTwoFA', 'POST', JSON.stringify(code), fError);
    },
    async requestIdentity<T>(endpoint: string, method: string, body?: string, fError?: () => void): Promise<T|null>{
      try {
        const resp = await request("https://ptv4q6v3kf.execute-api.sa-east-1.amazonaws.com/dev", endpoint, method, body, fError);
        if(resp){
          const respData: Response<T> = await resp.json();
          if(resp.ok && respData.data){
            if(respData.message) 
              popMessage(respData.message);

            return respData.data;
          }else{
            if(resp.status === 500){
              log.r('Response: ', resp);
            }
            else if(respData.message){
              popMessage(respData.message, MessageType.Error);
            }
            else{
              popMessage('No info error.', MessageType.Error);
            }

            return null;
          }
        }
      } catch (err) {
        log.err('Error: ', endpoint, err);
        return null;
      }
      return null;
    },
  }

  const objectivesApi = {
    async isUpObjective(fError?: () => void): Promise<any>{
      return this.requestObjectivesList('/IsUpObjective', 'GET', undefined, fError);
    },
    async getObjectivesList(fError?: () => void): Promise<ObjectiveList|null>{
      return this.requestObjectivesList<ObjectiveList>('/GetObjectivesList', 'GET', undefined, fError);
    },
    async syncObjectivesList(objectivesList: ObjectiveList, fError?: () => void): Promise<ObjectiveList|null>{
      const rtn = await this.requestObjectivesList<ObjectiveList>('/SyncObjectivesList', 'PUT', JSON.stringify(objectivesList), fError);
      return rtn;
    },
    async backupData(fError?: () => void): Promise<boolean|null>{
      return this.requestObjectivesList<boolean>('/BackupData', 'GET', undefined, fError);
    },
    async generateGetPresignedUrl(fileInfo: ImageInfo, fError?: () => void): Promise<PresignedUrl|null>{
      return this.requestObjectivesList<PresignedUrl>('/GenerateGetPresignedUrl', 'PUT', JSON.stringify(fileInfo), fError);
    },
    async generatePutPresignedUrl(fileInfo: ImageInfo, fError?: () => void): Promise<PresignedUrl|null>{
      return this.requestObjectivesList<PresignedUrl>('/GeneratePutPresignedUrl', 'PUT', JSON.stringify(fileInfo), fError);
    },
    async generateDeletePresignedUrl(fileInfo: ImageInfo, fError?: () => void): Promise<PresignedUrl|null>{
      return this.requestObjectivesList<PresignedUrl>('/GenerateDeletePresignedUrl', 'PUT', JSON.stringify(fileInfo), fError);
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
      // const presignedUrlReturn = await this.generateGetPresignedUrl(imageInfo);
    
      // try {
      //   if (!presignedUrlReturn?.url) return null;
    
      //   const localUri = FileSystem.documentDirectory + imageInfo.fileName;
    
      //   const downloadRes = await FileSystem.downloadAsync(
      //     presignedUrlReturn.url,
      //     localUri
      //   );
    
      //   if (downloadRes.status === 200) {
      //     return downloadRes.uri; // This is the local file path
      //   }
    
      //   return null;
      // } catch (err) {
      //   if (fError !== undefined) fError();
      //   else log.err('Error downloading image from S3', err);
    
      //   return null;
      // }
      return null;
    },
    async sendImage(itemId:string, file: File, fError?: () => void): Promise<boolean|null>{
      const imageInfo: ImageInfo = { itemId: itemId, fileName: file.name };
      const presignedUrlReturn:PresignedUrl|null = await this.generatePutPresignedUrl(imageInfo);

      if(presignedUrlReturn) {
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
      }
      return null;
    },
    async deleteImage(itemId:string, file: File, fError?: () => void): Promise<boolean|null>{
      const imageInfo: ImageInfo = { itemId: itemId, fileName: file.name };
      const presignedUrlReturn:PresignedUrl|null = await this.generateDeletePresignedUrl(imageInfo);
  
      if(presignedUrlReturn) {
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
      }

      return null;
    },
    //! Responsable to parse and react to equal among all, know, request errors.
    async requestObjectivesList<T>(endpoint: string, method: string, body?: string, fError?: () => void): Promise<T|null>{
      try {
        const resp =await request("https://6gbemhsxx4.execute-api.sa-east-1.amazonaws.com/dev", endpoint, method, body, fError);
        
        const respData: Response<T> = await resp.json();
        if(resp.ok && respData.data){
          return respData.data;
        }else{
          if(resp.status === 401){
            popMessage('Unauthorized, you need to refresh token...', MessageType.Error);
          }
          else if(resp.status === 500){
            log.r('Response: ', resp);
          }
          else if(respData.message){
            popMessage(respData.message, MessageType.Error);
          }
          else{
            popMessage('No info error.', MessageType.Error, 5);
          }
        }
      } catch (err) {
        log.err('Error: ', endpoint, err);
        if(fError) fError();
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
