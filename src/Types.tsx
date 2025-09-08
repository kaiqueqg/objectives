import { ObjectivePallete } from "./Colors";

export interface ObjectiveList{
  Objectives?: Objective[],
  Items?: Item[],
  DeleteObjectives?: Objective[],
  DeleteItems?: Item[],
}

export interface Objective {
  UserId: string,
  ObjectiveId: string,
  Title: string,
  Done: boolean,
  Theme: string,
  IsArchived: boolean,
  IsShowing: boolean,
  IsLocked: boolean,
  LastModified: string,
  Pos: number,
  IsShowingCheckedGrocery?: boolean,
  IsShowingCheckedStep?: boolean,
  IsShowingCheckedMedicine?: boolean,
  IsShowingCheckedExercise?: boolean,
  Tags: string[],
}

export enum ItemType{ Step, Wait, Question, Note, Location, Divider, Grocery, Medicine, Exercise, Link, ItemFake, Image, House, /*put new before here*/ Unknown,  }

export interface ItemViewProps {
  objTheme: ObjectivePallete,
  isEditingPos: boolean,
  isEndingPos: boolean,
  isSelected: boolean,
  isLocked: boolean,
  onDeleteItem: (item: Item) => void,
  loadMyItems: () => void,
}

export const ItemNew = (userId: string, objectiveId: string, itemId: string, type: ItemType, pos: number) => {
  return({
    UserIdObjectiveId: userId + objectiveId,
    ItemId: itemId,
    Pos: pos,
    Type: type,
    LastModified: (new Date()).toISOString(),
  });
}

export interface Item {
  ItemId: string,
  UserIdObjectiveId: string,
  Type: ItemType,
  Pos: number,
  LastModified: string,
}

export enum StepImportance {
  None,
  Low,
  Medium,
  High,
  Question,
  Waiting,
  InProgress,
  Ladybug,
}
export interface Step extends Item {
  Title: string,
  Done: boolean,
  Importance: StepImportance,
  AutoDestroy: boolean,
}

export interface Wait extends Item {
  Title: string,
}

export interface Note extends Item {
  Text: string,
}

export interface Question extends Item {
  Statement: string,
  Answer: string,
}

export interface Location extends Item {
  Title: string,
  Url: string,
  IsShowingMap: boolean,
}

export interface Divider extends Item {
  Title: string,
  IsOpen: boolean,
}

export interface Grocery extends Item {
  Title: string,
  IsChecked: boolean,
  Quantity?: number,
  Unit?: string,
  GoodPrice?: string,
}

export interface Medicine extends Item{
  Title: string,
  IsChecked: boolean,
  Quantity?: number,
  Unit?: string,
  Purpose?: string,
  Components?: string[],
}


export enum Weekdays{ Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday }

export interface Exercise extends Item{
  Title: string,
  IsDone: boolean,
  Reps: number,
  Series: number,
  MaxWeight: string,
  Description: string,
  Weekdays: Weekdays[],
  LastDone: string,
}

export interface Link extends Item{
  Title: string,
  Link: string,
}

export interface Image extends Item{
  Title: string;
  Name: string,
  Size: number,
  Width: number,
  Height: number,
  IsDisplaying: boolean;
}

export interface House extends Item{
  Title: string,
  Listing: string,
  MapLink: string,
  MeterSquare: string,
  Rating: number,
  Address: string,
  TotalPrice: number,
  WasContacted: boolean,
  Details: string,
  Attention: string,
}

export interface ItemFake extends Item{
  Title: string,
  Fade: boolean,
}

export interface PresignedUrl { url: string }

//^local
export interface StoredImage{
  ItemId: string,
  ImageFile: string,
}

//^aws
export interface ImageInfo {
  itemId: string;
  fileName: string;
}

export interface User{
  UserId: string,
  Email: string
  Username: string,
  Password: string,
  Role: string,
  Status: string,
  userPrefs: UserPrefs,
}

export interface UserPrefs{
  theme: string,
  allowLocation: boolean,
  vibrate: boolean,
  autoSync: boolean,
}

export interface LoginModel{
  User?: User,
  Token: string,
  ErrorMessage: string
}

export interface StorageInfo<T>{
  ok: boolean,
  msg?: string,
  data?: T,
}

export interface Response<T> {
  Data?: T,
  Message?: string,
  Exception?: string,
  WasAnError: boolean,
  Code?: number,
}

export const Codes = {
  OK: 200,
  Created: 201,
  Accepted: 202,
  NoContent: 204,
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  InternalServerError: 500,
}

export const Pattern = {
  Ok: 7,
  Wrong: [0, 20, 100, 20],
  Short: [0, 100],
  Alert: [0, 20, 100, 200],
};

export enum Views { UserView, ListView, AllView, IndividualView, DevView, TagsView, ArchivedView }

export const GetViewsText = (view: Views): string => {
  switch (view) {
    case Views.UserView:
      return 'UserView'
    case Views.ListView:
      return 'ListView'
    case Views.AllView:
      return 'AllView'
    case Views.IndividualView:
      return 'IndividualView'
    case Views.DevView:
      return 'DevView'
    case Views.TagsView:
      return 'TagsView'
    default:
      return ''
  }
}

export enum MessageType { Normal, Error, Alert, }

export interface PopMessage { 
  id: string,
  text: string,
  timeout: number,
  type: MessageType,
}

export enum LogLevel { Dev, Warn, Error, None }