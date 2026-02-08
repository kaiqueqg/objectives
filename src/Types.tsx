import { ObjectivePallete } from "./Colors";

export interface ObjectiveList{
  Objectives?: Objective[],
  Items?: Item[],
  DeleteObjectives?: Objective[],
  DeleteItems?: Item[],
  LastModified?: string,
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
  CreatedAt: string,
  Pos: number,
  IsShowingCheckedGrocery?: boolean,
  IsShowingCheckedStep?: boolean,
  IsShowingCheckedMedicine?: boolean,
  IsShowingCheckedExercise?: boolean,
  Tags: string[],
}

export enum ItemType {
  Step = 'Step',
  Question = 'Question',
  Note = 'Note',
  Location = 'Location',
  Divider = 'Divider',
  Grocery = 'Grocery',
  Medicine = 'Medicine',
  Exercise = 'Exercise',
  Link = 'Link',
  Image = 'Image',
  House = 'House',
  Review = 'Review',

  //Helpers to display
  Separator = 'Separator',
  HiddenItemText = 'HiddenItemText',
  StartPlaceholder = 'StartPlaceholder',
  Unknown = 'Unknown',
}
export enum ObjBottomIcons {
  Menu = 'Menu',
  Archive = 'Archive',
  Unarchive = 'Unarchive',
  Palette = 'Palette',
  Checked = 'Checked',
  Tags = 'Tags',
  Sorted = 'Sorted',
  Pos = 'Pos',
  Add = 'Add',
  Search = 'Search',
  IsLocked = 'IsLocked',
  FoldUnfoldAll = 'FoldUnfoldAll',
  GoingTopDown = 'GoingTopDown',
}

export interface ItemViewProps {
  objTheme: ObjectivePallete,
  isSelecting: boolean,
  isSelected: boolean,
  isDisabled: boolean,
  isLocked: boolean,
  wasJustAdded:boolean,
  onDeleteItem: (item: Item) => void,
  loadMyItems: () => void,
  itemsListScrollTo: (itemId: string) => void,
}

export const ItemNew = (userId: string, objectiveId: string, itemId: string, type: ItemType, pos: number, title: string) => {
  return({
    UserIdObjectiveId: userId + objectiveId,
    ItemId: itemId,
    Pos: pos,
    Type: type,
    Title: title,
    LastModified: (new Date()).toISOString(),
    CreatedAt: (new Date()).toISOString(),
  });
}

export interface Item {
  ItemId: string,
  UserIdObjectiveId: string,
  Type: ItemType,
  Pos: number,
  Title: string,
  LastModified: string,
  CreatedAt: string,
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
  LadybugYellow,
  LadybugGreen,
}
export interface Step extends Item {
  Done: boolean,
  Importance: StepImportance,
  AutoDestroy: boolean,
}

export interface Wait extends Item {
}

export interface Note extends Item {
  Text: string,
}

export interface Question extends Item {
  Statement: string,
  Answer: string,
}

export interface Location extends Item {
  Url: string,
  IsShowingMap: boolean,
}

export interface Divider extends Item {
  IsOpen: boolean,
}

export interface Grocery extends Item {
  IsChecked: boolean,
  Quantity?: number,
  Unit?: string,
  GoodPrice?: string,
}

export interface Medicine extends Item{
  IsChecked: boolean,
  Quantity?: number,
  Unit?: string,
  Purpose?: string,
  Components?: string[],
}


export enum Weekdays{ Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday }

export interface Exercise extends Item{
  IsDone: boolean,
  Reps: number,
  Series: number,
  MaxWeight: string,
  Description: string,
  Weekdays: Weekdays[],
  LastDone: string,
  BodyImages: string[],
}

export interface Link extends Item{
  Link: string,
}

export interface Image extends Item{
  Name: string,
  Size: number,
  Width: number,
  Height: number,
  IsDisplaying: boolean;
}

export interface House extends Item{
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

export interface Review extends Item{
  Rating: string,
  Description: string,
  IsCurrentChoise: boolean,
}

export interface GenericItem extends Item{
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

export const DefaultUserPrefs: UserPrefs = {
  theme: 'dark',
  allowLocation: false,
  vibrate: true,
  autoSync: false,
  ObjectivesPrefs: {iconsToDisplay: [
    // ObjBottomIcons.Archive,
    // ObjBottomIcons.Unarchive,
    ObjBottomIcons.Palette,
    ObjBottomIcons.Checked,
    ObjBottomIcons.Tags,
    // ObjBottomIcons.Sorted,
    ObjBottomIcons.Pos,
    ObjBottomIcons.Add,
    // ObjBottomIcons.Search,
    ObjBottomIcons.IsLocked,
    ObjBottomIcons.FoldUnfoldAll,
    ObjBottomIcons.GoingTopDown,
  ]},
  warmLocationOff: true,
  singleTagSelected: false,
  shouldLockOnOpen: false,
  shouldLockOnReopen: false,
  isRightHand: true,
}

export const DefaultUser:User = {
  UserId: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  Email: '',
  Username: 'Demo',
  Password: '',
  Role: 'Basic',
  Status: 'Active',
  userPrefs: DefaultUserPrefs,
  TwoFAActive: false,
}

export interface User{
  UserId: string,
  Email: string
  Username: string,
  Password: string,
  Role: string,
  TwoFAActive: boolean,
  Status: string,
  userPrefs: UserPrefs,
}

export interface UserPrefs{
  theme: string,
  allowLocation: boolean,
  warmLocationOff: boolean,
  vibrate: boolean,
  autoSync: boolean,
  ObjectivesPrefs: ObjectivesPrefs,
  singleTagSelected: boolean,
  shouldLockOnOpen: boolean,
  shouldLockOnReopen: boolean,
  isRightHand: boolean,
}

export interface ObjectivesPrefs{
  iconsToDisplay: string[],
}

export interface LoginRequest {
  Password: string;
  Email: string;
  ExpoToken?: string;
}
export interface LoginResponse {
  User?: User,
  Token?: string,
  RequiringTwoFA: boolean,
  TwoFATempToken?: string,
}

export interface TwoFactorAuthRequest { 
  TwoFACode: string,
  TwoFATempToken?: string,
}

export interface StorageInfo<T>{
  ok: boolean,
  msg?: string,
  data?: T,
}

export interface Response<T> {
  data: T,
  success: boolean,
  message?: string,
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
  Conflict: 409,
  PayloadTooLarge: 413,
  InternalServerError: 500,
  NotImplemented: 501,
  ServiceUnavailable: 503,
}

export const Pattern = {
  Ok: [0, 30],
  Wrong: [0, 100],
  Short: [0, 100],
  Alert: [0, 20, 100, 200],
};

export enum Views { UserView = 'UserView', ListView = 'ListView', AllView = 'AllView', IndividualView = 'IndividualView', DevView = 'DevView', ArchivedView = 'ArchivedView' }

export enum MultiSelectType { MOVE = 'Move', COPY = 'Copy' }
export interface MultiSelectAction { type: MultiSelectType, originObjectiveId: string, items: Item[] }

export enum MessageType { Normal, Error, Alert, }

export interface PopMessage { 
  id: string,
  text: string,
  timeout: number,
  type: MessageType,
}

export enum LogLevel { Dev, Warn, Error, None }