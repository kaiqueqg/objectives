// LogContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Item, LogLevel, LoginModel, Objective, ObjectiveList, Step, User, UserPrefs, Views, Response, MessageType } from "../Types";
import { useLogContext } from './LogContext';
import { useStorageContext } from './StorageContext';

interface RequestProviderProps {
  children: ReactNode;
}

const RequestContext = createContext<RequestContextType | undefined>(undefined);
const currentLogLevel = LogLevel.Dev;

export const RequestProvider: React.FC<RequestProviderProps> = ({ children }) => {
  const { log, popMessage } = useLogContext();
  const { storage } = useStorageContext();
  
  const errorsWithMessageInResponse = [400, 401, 404, 409, 500, 503];

  const request = async (url: string, endpoint: string, method: string, body?: string, fError?: () => void): Promise<any> => {
    const headers: {[key: string]: string} = {};

    headers['Content-Type'] = 'application/json';

    const token = await storage.readJwtToken();
    if(token !== null) headers['Authorization'] = "Bearer " + token;
    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
      if(fError != undefined) fError();
    }, 10000);

    try {
      const response = await fetch(url + endpoint, { headers, method, mode: 'cors', body: body, signal });
      clearTimeout(timeoutId);

      if(response !== undefined && errorsWithMessageInResponse.includes(response.status)){
        const message = await response.text();
      }

      return response;
    } 
    catch (error){
      if(fError !== undefined){
        fError();
      }
      else {
        log.dev("Untreated error..." + error);
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
        const resp = await request('https://68m8rbceac.execute-api.sa-east-1.amazonaws.com/dev', endpoint, method, body, fError);

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
    async getObjectivesList(fError?: () => void): Promise<ObjectiveList>{
      return this.requestObjectivesList<ObjectiveList>('/GetObjectivesList', 'GET', undefined, fError);
    },
    async syncObjectivesList(objectivesList: ObjectiveList, fError?: () => void): Promise<ObjectiveList>{
      return this.requestObjectivesList<ObjectiveList>('/SyncObjectivesList', 'PUT', JSON.stringify(objectivesList), fError);
    },
    async requestObjectivesList<T>(endpoint: string, method: string, body?: string, fError?: () => void): Promise<any>{
      try {
        const resp = await request('https://0z58mhwlhf.execute-api.sa-east-1.amazonaws.com/dev', endpoint, method, body, fError);

        if(resp){
          const respData: Response<T> = await resp.json();
          if(!respData.WasAnError && respData.Data){
            return respData.Data;
          }
          else{
            log.dev('else respData')
            log.dev(respData)
            switch(respData.Code){
              case 401:
                popMessage(`The request wasn't authorized.`, MessageType.Error);
                break;
              default:
                popMessage('Default');
                break;
            }
            log.dev('respData.Message', respData.Message);
          }
        }
      } catch (err) {
        log.err('Error: ', endpoint, err);
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

interface RequestContextType {
  identityApi: any,
  objectivesApi: any,
}

export const useRequestContext = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequestContext must be used within a RequestProvider');
  }
  return context;
};
