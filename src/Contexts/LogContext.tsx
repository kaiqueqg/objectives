// LogContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Divider, Grocery, Item, ItemType, Location, LogLevel, MessageType, Note, PopMessage, Question, Step, Wait, Objective } from '../Types';

interface LogProviderProps {
  children: ReactNode;
}

const LogContext = createContext<LogContextType | undefined>(undefined);
const currentLogLevel = LogLevel.Dev;

export const LogProvider: React.FC<LogProviderProps> = ({ children }) => {
  
  const randomId = (size?: number) => {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    const amount = size ?? 40;
    for (let i = 0; i < amount; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset.charAt(randomIndex);
    }
    return randomString;
  };
  
  const [consoleLogs, setConsoleLogs] = useState<string>('');
  const putLog = (...messages: (string | undefined)[]) => {
    const newLogEntry = messages.join('\n');
    setConsoleLogs((prevLogs) => `${prevLogs}\n${newLogEntry}`);
  };

  const deleteLog = () => {
    setConsoleLogs('');
  };

  const log = {
    arr(array: any[], f?:(e:any)=>string){
      for(let i = 0; i < array.length; i++){
        if(f)
          log.dev(f(array[i]));
        else
          log.dev(array[i]);
      }
    },
    arrg(array: any[], f?:(e:any)=>string){
      for(let i = 0; i < array.length; i++){
        if(f)
          log.dev(f(array[i]));
        else
          log.dev(array[i]);
      }
    },
    arrb(array: any[], f?:(e:any)=>string){
      for(let i = 0; i < array.length; i++){
        if(f)
          log.dev(f(array[i]));
        else
          log.dev(array[i]);
      }
    },
    arrr(array: any[], f?:(e:any)=>string){
      for(let i = 0; i < array.length; i++){
        if(f)
          log.dev(f(array[i]));
        else
          log.dev(array[i]);
      }
    },
    arry(array: any[], f?:(e:any)=>string){
      for(let i = 0; i < array.length; i++){
        if(f)
          log.dev(f(array[i]));
        else
          log.dev(array[i]);
      }
    },
    dev(...texts: any[]) {
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text === null) return 'null';
          if(text === undefined) return 'undefined';

          if (typeof text === 'object' && !Array.isArray(text)) {
            return JSON.stringify(text, null, 2); //if object, prettyfy
          } else {
            return text;
          }
        });
        console.log(`\x1b[38;2;255;255;255m[DEV]`, ...formattedTexts);
        // putLog(...formattedTexts);
      }
    },
    o(...objs: Objective[]){
      const formattedTexts = objs.map(text => {
        if(text === null) return 'null';
        if(text === undefined) return 'undefined';
        return text.Title;
      });
      console.log(`\x1b[38;2;255;255;80m[DEV]`, ...formattedTexts);
      putLog(...formattedTexts);
    },
    i(...texts: Item[]){
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text.Type===ItemType.Divider) return (text as Divider).Title;
          if(text.Type===ItemType.Grocery) return (text as Grocery).Title;
          if(text.Type===ItemType.Location) return (text as Location).Title;
          if(text.Type===ItemType.Note) return (text as Note).Text;
          if(text.Type===ItemType.Question) return (text as Question).Statement;
          if(text.Type===ItemType.Step) return (text as Step).Title;
          if(text.Type===ItemType.Wait) return (text as Wait).Title;
        });
        console.log(`\x1b[38;2;255;255;80m[DEV]`, ...formattedTexts);
        putLog(...formattedTexts);
      }
    },
    w(...texts: any[]){
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text === null) return 'null';
          if(text === undefined) return 'undefined';
          if(text !== null && typeof text === 'object' && !Array.isArray(text)) {
            return JSON.stringify(text, null, 2); //if object, prettyfy
          } else {
            return text;
          }
        });
        console.log(`\x1b[38;2;255;255;255m[DEV]`, ...formattedTexts);
        putLog(...formattedTexts);
      }
    },
    y(...texts: any[]){
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text === null) return 'null';
          if(text === undefined) return 'undefined';
          if(text !== null && typeof text === 'object' && !Array.isArray(text)) {
            return JSON.stringify(text, null, 2); //if object, prettyfy
          } else {
            return text;
          }
        });
        console.log(`\x1b[38;2;255;255;80m[DEV]`, ...formattedTexts);
        putLog(...formattedTexts);
      }
    },
    r(...texts: any[]){
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text === null) return 'null';
          if(text === undefined) return 'undefined';
          if (text !== null && typeof text === 'object' && !Array.isArray(text)) {
            return JSON.stringify(text, null, 2); //if object, prettyfy
          } else {
            return text;
          }
        });
        console.log(`\x1b[38;2;255;80;80m[DEV]`, ...formattedTexts);
        putLog(...formattedTexts);
      }
    },
    b(...texts: any[]){
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text === null) return 'null';
          if(text === undefined) return 'undefined';
          if (text !== null && typeof text === 'object' && !Array.isArray(text)) {
            return JSON.stringify(text, null, 2); //if object, prettyfy
          } else {
            return text;
          }
        });
        console.log(`\x1b[38;2;80;80;255m[DEV]`, ...formattedTexts);
        putLog(...formattedTexts);
      }
    },
    g(...texts: any[]){
      if (currentLogLevel <= LogLevel.Dev) {
        const formattedTexts = texts.map(text => {
          if(text === null) return 'null';
          if(text === undefined) return 'undefined';
          if (text !== null && typeof text === 'object' && !Array.isArray(text)) {
            return JSON.stringify(text, null, 2); //if object, prettyfy
          } else {
            return text;
          }
        });
        console.log(`\x1b[38;2;80;255;80m[DEV]`, ...formattedTexts);
        putLog(...formattedTexts);
      }
    },
    war(...texts: any[]){
      if (currentLogLevel <= LogLevel.Warn) {
        const formattedTexts = texts.map(text => {
          if(text === null) return 'null';
          if(text === undefined) return 'undefined';
          if (text !== null && typeof text === 'object' && !Array.isArray(text)) {
            return JSON.stringify(text, null, 2); //if object, prettyfy
          } else {
            return text;
          }
        });
    
        console.log(`\x1b[38;2;255;255;80m[WAR]`, ...formattedTexts);
        putLog(...formattedTexts);
      }
    },
    err(...texts: any[]){
      if (currentLogLevel <= LogLevel.Error) {
        const formattedTexts = texts.map(text => {
          if(text === null) return 'null';
          if(text === undefined) return 'undefined';
          if (text !== null && typeof text === 'object' && !Array.isArray(text)) {
            return JSON.stringify(text, null, 2); //if object, prettyfy
          } else {
            return text;
          }
        });
    
        console.log(`\x1b[38;2;255;80;80m[ERR]`, ...formattedTexts);
        putLog(...formattedTexts);
      }
    },
  }

  const [messageList, setMessageList] = useState<PopMessage[]>([]);
  const popMessage = (text: string, type?: MessageType, timeoutInSeconds?: number) => {
    //remove existing equal messages
    // let newList = messageList.filter((item)=>{
    //   return item.text.trim() !== text;
    // });

    let timeout = 3000;
    if(timeoutInSeconds && timeoutInSeconds > 30) timeout = 30000;
    if(timeoutInSeconds && timeoutInSeconds < 1) timeout = 1000;

    const msg: PopMessage = {
      id: randomId(),
      text,
      type: type ?? MessageType.Normal,
      timeout,
    };

    setMessageList(prev => [...prev, msg]);
  }
  const removeMessage = (removeId: string) => {
    setMessageList(prevMessages => prevMessages.filter(msg => msg.id !== removeId));
  }
    
  return (
    <LogContext.Provider 
    value={{
      log,
      consoleLogs,
      deleteLog,
      messageList, popMessage, removeMessage,
    }}>
    {children}
    </LogContext.Provider>
  );
};

interface LogContextType {
  log: any,
  consoleLogs: string,
  deleteLog: () => void,
  //^Message
  messageList: PopMessage[],
  popMessage: (text: string, type?: MessageType, timeoutInSeconds?: number) => void,
  removeMessage: (removeId: string) => void,
}

export const useLogContext = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLogContext must be used within a LogProvider');
  }
  return context;
};
