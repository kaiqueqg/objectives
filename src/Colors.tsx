import { ViewStyle } from "react-native";

export type ColorPalette = {
  transparent: string,
  bluedarkerdarker: string,
  bluedarker: string,
  bluedark: string,
  bluedarky: string,
  blue: string,
  bluelighty: string,
  bluelight: string,
  bluelightlight: string,

  beige: string,
  beigelightdark: string,
  beigedarky: string,
  beigedark: string,
  beigedarker: string,

  brown: string,
  brownlight: string,

  white: string,

  black: string,
  greydark: string,
  greydarky: string,
  grey: string,
  greylighty: string,
  greylight: string,
  greylighter: string,

  reddarker: string,
  reddark: string,
  red: string,
  redlight: string,
  redlightlight: string,

  greendarker: string,
  greendark: string,
  green: string,
  greenlight: string,
  greenlightlight: string,

  yellowdark: string,
  yellow: string,

  objBlue: string,
  objRed: string,
  objWhite: string,
  objGreen: string,
  objNoTheme: string,
  objCyan: string,
  objPink: string,

  itemBlue: string,
  itemRed: string,
  itemWhite: string,
  itemGreen: string,
  itemNoTheme: string,
  itemCyan: string,
  itemPink: string,
};

export const colorPalette: ColorPalette = {
  transparent: '#00000000',

  bluedarkerdarker: '#1D1D1D',
  bluedarker: '#21242B',
  bluedark: '#282C34',
  bluedarky: '#0D85FE',
  blue: '#689AFF',
  bluelighty: '#8BBEFF',
  bluelight: '#B0D3FE',
  bluelightlight: '#D6E4FD',

  beige: '#F5F5DC',
  beigelightdark: '#B9B9A0',
  beigedarky: '#81815F',
  beigedark: '#4B4B46',
  beigedarker: '#32322D',

  brown: '#D8AE7E',
  brownlight: '#E0DCB6',

  white: '#FFFFFF',
  black: '#000000',
  greydark: '#3A3A3A',
  greydarky: '#666666',
  grey: '#757575',
  greylighty: '#B0B0B0',
  greylight: '#CCCCCC',
  greylighter: '#E6E6E6',

  reddarker: '#A62121',
  reddark: '#FF0000',
  red: '#FE3A3B',
  redlight: '#FF6D6E',
  redlightlight: '#FEB9B8',

  greendarker: '#52A858',
  greendark: '#52A858',
  green: '#99CE99',
  greenlight: '#A8E3A8',
  greenlightlight: '#D3F4D3',
  
  yellowdark: '#CCC300',
  yellow: '#FFFFAA',
  
  objBlue: '#23315c',
  objRed: '#861932',
  objGreen: '#123525',
  objWhite: '#F5F5DC',
  objNoTheme: '#282C34',
  objCyan: '#256377',
  objPink: '#F9C5D5',

  itemBlue: '#314581',
  itemRed: '#A41E3D',
  itemGreen: '#1F5B40',
  itemWhite: '#D8AE7E',
  itemNoTheme: '#3E4451',
  itemCyan: '#3287A4',
  itemPink: '#F499B5',
};

export type GlobalStyle = {
  baseImageContainer: ViewStyle,
  baseBiggerImageContainer: ViewStyle,
  baseImage: ViewStyle,
  baseBiggerImage: ViewStyle,
  baseSmallImage: ViewStyle,
  baseVerySmallImage: ViewStyle,
}

export const globalStyle:GlobalStyle = {
  baseImageContainer: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',

    // borderColor: 'red',
    // borderWidth: 1,
    // borderStyle: 'solid',
  },
  baseBiggerImageContainer:{
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseImage: {
    height: 25,
    width: 25,

    // borderColor: 'green',
    // borderWidth: 1,
    // borderStyle: 'solid',
  },
  baseBiggerImage:{
    height: 30,
    width: 30,

    // borderColor: 'purple',
    // borderWidth: 1,
    // borderStyle: 'solid',
  },
  baseSmallImage: {
    height: 20,
    width: 20,

    // borderColor: 'yellow',
    // borderWidth: 1,
    // borderStyle: 'solid',
  },
  baseVerySmallImage: {
    height: 15,
    width: 15,

    // borderColor: 'blue',
    // borderWidth: 1,
    // borderStyle: 'solid',
  }
}

export type ThemePalette = {
  backgroundcolordarker: string,
  backgroundcolordark: string,
  backgroundcolor: string,

  textcolor: string,
  textcolorfade: string,

  boxborder: string,
  boxborderfade: string,

  loginbuttonbk: string,
  logoutbuttonbk: string,

  icontint: string,
  icontintfade: string,

  doneicontint: string,
  cancelicontint: string,

  actionicontint: string,
  onlineicontint: string,
  inprogressicontint: string,
  offlineicontint: string,
};

export const dark: ThemePalette = {
  backgroundcolordarker: colorPalette.bluedarkerdarker,
  backgroundcolordark: colorPalette.bluedarker,
  backgroundcolor: colorPalette.bluedark,

  textcolor: colorPalette.beige,
  textcolorfade: colorPalette.beigedark,

  boxborder: colorPalette.beige,
  boxborderfade: colorPalette.beigedark,

  loginbuttonbk: colorPalette.bluelight,
  logoutbuttonbk: colorPalette.redlightlight,

  icontint: colorPalette.beige,
  icontintfade: colorPalette.beigedark,

  cancelicontint: colorPalette.redlight,
  doneicontint: colorPalette.green,

  actionicontint: colorPalette.bluedark,
  onlineicontint: colorPalette.green,
  inprogressicontint: colorPalette.yellow,
  offlineicontint: colorPalette.redlight,
};

export type ObjectivePallete = {
  icontintcolor?: string,
  icontintcolorfade?: string,
  
  inputbk?: string,
  bordercolor?: string,
  bordercolorlight?: string,
  bordercolorselected?: string,
  
  doneicontint?: string,
  cancelicontint?: string,
  trashicontint?: string,
  
  objbk?: string,
  objtitle?: string,

  itembk?: string,
  itemtext?: string,
  itemtextfade?: string,
  itemtextplaceholder?: string,

  borderRadius: number,
  marginHorizontal: number,
  marginVertical: number,
}

export const noTheme: ObjectivePallete = {
  icontintcolor: colorPalette.beige,
  icontintcolorfade: colorPalette.grey,
  
  bordercolor: colorPalette.black,
  bordercolorlight: colorPalette.beige,
  bordercolorselected: colorPalette.red,

  doneicontint: colorPalette.greenlight,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.redlight,
  
  objbk: colorPalette.objNoTheme,
  objtitle: colorPalette.beige,

  itembk:  colorPalette.itemNoTheme,
  itemtext: colorPalette.beige,
  itemtextfade: colorPalette.grey,
  itemtextplaceholder: colorPalette.beigedarker,
  
  borderRadius: 5,
  marginHorizontal: 6,
  marginVertical: 1,
}

export const darkBlue: ObjectivePallete = {
  ...noTheme,
  
  objbk: colorPalette.objBlue,
  itembk:  colorPalette.itemBlue,
}

export const darkRed: ObjectivePallete = {
  ...noTheme,
  bordercolorselected: colorPalette.beige,

  objbk: colorPalette.objRed,
  itembk: colorPalette.itemRed,

  doneicontint: colorPalette.greenlight,
  trashicontint: colorPalette.redlightlight,
  
  itemtextfade: colorPalette.black,
}

export const darkGreen: ObjectivePallete = {
  ...noTheme,
  bordercolorlight: colorPalette.red,
  bordercolorselected: colorPalette.red,

  objbk: colorPalette.objGreen,
  itembk:  colorPalette.itemGreen,
}

export const darkWhite: ObjectivePallete = {
  ...noTheme,
  icontintcolor: colorPalette.black,
  
  bordercolorlight: colorPalette.red,
  
  doneicontint: colorPalette.greendarker,
  trashicontint: colorPalette.reddarker,
  cancelicontint: colorPalette.black,
  
  objbk: colorPalette.objWhite,
  objtitle: colorPalette.black,

  itembk:  colorPalette.itemWhite,
  itemtext: colorPalette.black,
  itemtextfade: colorPalette.greylighty,
}

export const darkCyan: ObjectivePallete = {
  ...noTheme,
  icontintcolorfade: colorPalette.beigelightdark,
  
  objbk: colorPalette.objCyan,
  
  itembk:  colorPalette.itemCyan,
  itemtextfade: colorPalette.beigelightdark,
}

export const darkPink: ObjectivePallete = {
  ...noTheme,
  icontintcolor: colorPalette.black,
  
  bordercolorlight: colorPalette.red,
  
  doneicontint: colorPalette.greendarker,
  trashicontint: colorPalette.reddarker,
  
  objbk: colorPalette.objPink,
  objtitle: colorPalette.black,

  itembk:  colorPalette.itemPink,
  itemtext: colorPalette.black,
}

export const getObjTheme = (t: string): ObjectivePallete => {
  let rtn = noTheme;
  if(t === 'darkBlue') rtn = darkBlue;
  else if(t === 'darkRed') rtn = darkRed;
  else if(t === 'darkGreen') rtn = darkGreen;
  else if(t === 'darkWhite') rtn = darkWhite;
  else if(t === 'darkCyan') rtn = darkCyan;
  else if(t === 'darkPink') rtn = darkPink;
  return rtn;
}