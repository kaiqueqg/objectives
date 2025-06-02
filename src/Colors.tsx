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

  cyandarkerdarker: string,
  cyandarker: string,
  cyandark: string,
  cyandarky: string,
  cyan: string,
  cyanlightly: string,
  cyanlight: string,
  cyanlightlight: string,

  pinkdarkerdarker: string,
  pinkdarker: string,
  pinkdark: string,
  pinkdarky: string,
  pink: string,
  pinklightly: string,
  pinklight: string,
  pinklightlight: string,

  objBlue: string,
  objRed: string,
  objWhite: string,
  objGreen: string,
  objNoTheme: string,
  objCyan: string,
  objPink: string,

  objBlueLight: string,
  objRedLight: string,
  objGreenLight: string,
  objWhiteLight: string,
  objNoThemeLight: string,
  objCyanLight: string,
  objPinkLight: string,

  itemBlue: string,
  itemRed: string,
  itemWhite: string,
  itemGreen: string,
  itemNoTheme: string,
  itemCyan: string,
  itemPink: string,

  itemBlueLight: string,
  itemRedLight: string,
  itemWhiteLight: string,
  itemGreenLight: string,
  itemNoThemeLight: string,
  itemCyanLight: string,
  itemPinkLight: string,
};

export const colorPalette: ColorPalette = {
  transparent: 'rgba(0, 0, 0, 0)',

  bluedarkerdarker: 'rgb(29, 29, 29)',
  bluedarker: 'rgb(33, 36, 43)',
  bluedark: 'rgb(40, 44, 52)',
  bluedarky: 'rgb(13, 133, 254)',
  blue: 'rgb(104, 154, 255)',
  bluelighty: 'rgb(139, 190, 255)',
  bluelight: 'rgb(176, 211, 254)',
  bluelightlight: 'rgb(214, 228, 253)',

  beige: 'rgb(245, 245, 220)',
  beigelightdark: 'rgb(185, 185, 160)',
  beigedarky: 'rgb(129, 129, 95)',
  beigedark: 'rgb(75, 75, 70)',
  beigedarker: 'rgb(50, 50, 45)',

  brown: 'rgb(216, 174, 126)',
  brownlight: 'rgb(224, 220, 182)',

  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  greydark: 'rgb(58, 58, 58)',
  greydarky: 'rgb(102, 102, 102)',
  grey: 'rgb(117, 117, 117)',
  greylighty: 'rgb(176, 176, 176)',
  greylight: 'rgb(204, 204, 204)',
  greylighter: 'rgb(230, 230, 230)',

  reddarker: 'rgb(166, 33, 33)',
  reddark: 'rgb(255, 0, 0)',
  red: 'rgb(254, 58, 59)',
  redlight: 'rgb(255, 109, 110)',
  redlightlight: 'rgb(254, 185, 184)',

  greendarker: 'rgb(64, 130, 68)',
  greendark: 'rgb(82, 168, 88)',
  green: 'rgb(153, 206, 153)',
  greenlight: 'rgb(168, 227, 168)',
  greenlightlight: 'rgb(211, 244, 211)',

  yellowdark: 'rgb(204, 195, 0)',
  yellow: 'rgb(255, 255, 170)',

  cyandarkerdarker: 'rgb(29, 77, 94)',
  cyandarker: 'rgb(31, 84, 101)',
  cyandark: 'rgb(35, 94, 113)',
  cyandarky: 'rgb(36, 97, 117)',
  cyan: 'rgb(37, 99, 119)',
  cyanlightly: 'rgb(53, 142, 172)',
  cyanlight: 'rgb(95, 178, 206)',
  cyanlightlight: 'rgb(142, 201, 220)',

  pinkdarkerdarker: 'rgb(238, 104, 144)',
  pinkdarker: 'rgb(241, 126, 161)',
  pinkdark: 'rgb(242, 136, 167)',
  pinkdarky: 'rgb(243, 144, 174)',
  pink: 'rgb(244, 153, 181)',
  pinklightly: 'rgb(245, 163, 187)',
  pinklight: 'rgb(245, 173, 195)',
  pinklightlight: 'rgb(246, 183, 202)',

  objNoTheme: 'rgb(40, 44, 52)',
  itemNoTheme: 'rgb(62, 68, 81)',
  
  objBlue: 'rgb(35, 49, 92)',
  itemBlue: 'rgb(49, 69, 129)',

  objRed: 'rgb(70, 0, 16)',
  itemRed: 'rgb(104, 18, 38)',

  objGreen: 'rgb(0, 43, 23)',
  itemGreen: 'rgb(22, 59, 42)',

  objWhite: 'rgb(245, 245, 220)',
  itemWhite: 'rgb(216, 174, 126)',

  objCyan: 'rgb(37, 99, 119)',
  itemCyan: 'rgb(50, 135, 164)',

  objPink: 'rgb(249, 197, 213)',
  itemPink: 'rgb(244, 153, 181)',

  objNoThemeLight: 'rgb(255, 255, 255)',
  itemNoThemeLight: 'rgb(230, 230, 230)',
  
  objBlueLight: 'rgb(214, 228, 253)',
  itemBlueLight: 'rgb(176, 211, 254)',

  objRedLight: 'rgb(254, 185, 184)',
  itemRedLight: 'rgb(255, 140, 140)',

  objGreenLight: 'rgb(211, 244, 211)',
  itemGreenLight: 'rgb(168, 227, 168)',

  objWhiteLight: 'rgb(245, 245, 220)',
  itemWhiteLight: 'rgb(216, 174, 126)',

  objCyanLight: 'rgb(142, 201, 220)',
  itemCyanLight: 'rgb(95, 178, 206)',

  objPinkLight: 'rgb(249, 197, 213)',
  itemPinkLight: 'rgb(244, 153, 181)',
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
    // borderStyle: 'dashed',
  },
  baseBiggerImageContainer:{
    height: 44,
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',

    // borderColor: colorPalette.reddarker,
    // borderWidth: 1,
    // borderStyle: 'dashed',
  },
  baseImage: {
    height: 25,
    width: 25,

    // borderColor: 'green',
    // borderWidth: 1,
    // borderStyle: 'dashed',
  },
  baseBiggerImage:{
    height: 30,
    width: 30,

    // borderColor: 'purple',
    // borderWidth: 1,
    // borderStyle: 'dashed',
  },
  baseSmallImage: {
    minHeight: 17,
    minWidth: 17,
    maxHeight: 22,
    maxWidth: 22,

    // borderColor: 'yellow',
    // borderWidth: 1,
    // borderStyle: 'dashed',
  },
  baseVerySmallImage: {
    height: 15,
    width: 15,

    // borderColor: 'blue',
    // borderWidth: 1,
    // borderStyle: 'dashed',
  }
}

export type AppPalette = {
  backgroundcolordarker: string,
  backgroundcolordark: string,
  backgroundcolor: string,
  backgroundcolorcontrast: string,

  textcolor: string,
  textcolorfade: string,
  textcolorcontrast: string,

  bordercolor: string,
  bordercolorfade: string,

  loginbuttonbk: string,
  logoutbuttonbk: string,
  bottombariconselected: string,

  icontint: string,
  icontintfade: string,

  doneicontint: string,
  cancelicontint: string,

  actionicontint: string,
  onlineicontint: string,
  inprogressicontint: string,
  offlineicontint: string,
};

export const light: AppPalette = {
  backgroundcolordarker: colorPalette.greylight,
  backgroundcolordark: colorPalette.white,
  backgroundcolor: colorPalette.white,
  backgroundcolorcontrast: colorPalette.black,

  textcolor: colorPalette.black,
  textcolorfade: colorPalette.grey,
  textcolorcontrast: colorPalette.beige,

  bordercolor: colorPalette.black,
  bordercolorfade: colorPalette.grey,

  loginbuttonbk: colorPalette.beige,
  logoutbuttonbk: colorPalette.reddarker,
  bottombariconselected: colorPalette.bluedarky,

  icontint: colorPalette.black,
  icontintfade: colorPalette.grey,

  cancelicontint: colorPalette.reddark,
  doneicontint: colorPalette.greendarker,

  actionicontint: colorPalette.bluedark,
  onlineicontint: colorPalette.green,
  inprogressicontint: colorPalette.yellow,
  offlineicontint: colorPalette.redlight,
}

export const dark: AppPalette = {
  backgroundcolordarker: colorPalette.bluedarkerdarker,
  backgroundcolordark: colorPalette.bluedarker,
  backgroundcolor: colorPalette.bluedark,
  backgroundcolorcontrast: colorPalette.beige,

  textcolor: colorPalette.beige,
  textcolorfade: colorPalette.beigedark,
  textcolorcontrast: colorPalette.black,

  bordercolor: colorPalette.beige,
  bordercolorfade: colorPalette.beigedark,

  loginbuttonbk: colorPalette.bluelight,
  logoutbuttonbk: colorPalette.redlightlight,
  bottombariconselected: colorPalette.bluelight,

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

export const lightNoTheme: ObjectivePallete = {
  icontintcolor: colorPalette.black,
  icontintcolorfade: colorPalette.greylighty,
  
  bordercolor: colorPalette.black,
  bordercolorlight: colorPalette.beige,
  bordercolorselected: colorPalette.red,

  doneicontint: colorPalette.greendarker,
  cancelicontint: colorPalette.yellowdark,
  trashicontint: colorPalette.reddarker,
  
  objbk: colorPalette.objNoThemeLight,
  itembk:  colorPalette.itemNoThemeLight,
  
  objtitle: colorPalette.black,
  itemtext: colorPalette.black,
  itemtextfade: colorPalette.grey,
  itemtextplaceholder: colorPalette.black,
  
  borderRadius: 5,
  marginHorizontal: 6,
  marginVertical: 1,
} 

export const darkBlue: ObjectivePallete = {
  ...noTheme,
  
  objbk: colorPalette.objBlue,
  itembk:  colorPalette.itemBlue,
}

export const lightBlue: ObjectivePallete = {
  ...lightNoTheme,
  icontintcolor: colorPalette.black,
  icontintcolorfade: colorPalette.blue,

  doneicontint: colorPalette.greendark,
  cancelicontint: colorPalette.yellow,
  
  objbk: colorPalette.objBlueLight,
  itembk:  colorPalette.itemBlueLight,
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

export const lightRed: ObjectivePallete = {
  ...lightNoTheme,
  bordercolorselected: colorPalette.beige,
  icontintcolorfade: colorPalette.red,

  objbk: colorPalette.objRedLight,
  itembk: colorPalette.itemRedLight,

  doneicontint: colorPalette.greendark,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.reddark,
  
  itemtextfade: colorPalette.black,
}

export const darkGreen: ObjectivePallete = {
  ...noTheme,
  bordercolorlight: colorPalette.red,
  bordercolorselected: colorPalette.red,

  objbk: colorPalette.objGreen,
  itembk:  colorPalette.itemGreen,
}

export const lightGreen: ObjectivePallete = {
  ...lightNoTheme,
  icontintcolorfade: colorPalette.greendark,

  doneicontint: colorPalette.greendarker,
  cancelicontint: colorPalette.yellowdark,

  objbk: colorPalette.objGreenLight,
  itembk:  colorPalette.itemGreenLight,
}

export const darkWhite: ObjectivePallete = {
  ...noTheme,
  icontintcolor: colorPalette.black,
  icontintcolorfade: colorPalette.grey,
  
  bordercolorlight: colorPalette.red,
  
  doneicontint: colorPalette.greendark,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.reddarker,
  
  objbk: colorPalette.objWhite,
  itembk:  colorPalette.itemWhite,
  
  objtitle: colorPalette.black,
  itemtext: colorPalette.black,
}

export const lightWhite: ObjectivePallete = {
  ...lightNoTheme,
  icontintcolorfade: colorPalette.grey,
  
  bordercolorlight: colorPalette.red,
  
  doneicontint: colorPalette.greendark,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.reddarker,
  
  objbk: colorPalette.objWhiteLight,
  itembk:  colorPalette.itemWhiteLight,
}

export const darkCyan: ObjectivePallete = {
  ...noTheme,
  icontintcolorfade: colorPalette.cyandarkerdarker,
  
  objbk: colorPalette.objCyan,
  
  itembk:  colorPalette.itemCyan,
  itemtextfade: colorPalette.beigelightdark,
}

export const lightCyan: ObjectivePallete = {
  ...lightNoTheme,
  icontintcolorfade: colorPalette.cyanlightly,
  
  doneicontint: colorPalette.greenlight,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.reddarker,

  objbk: colorPalette.objCyanLight,
  itembk:  colorPalette.itemCyanLight,
  
  objtitle: colorPalette.black,
}

export const darkPink: ObjectivePallete = {
  ...noTheme,
  icontintcolor: colorPalette.black,
  icontintcolorfade: colorPalette.pinkdarkerdarker,
  
  bordercolorlight: colorPalette.red,
  
  doneicontint: colorPalette.greendarker,
  trashicontint: colorPalette.reddarker,
  
  objbk: colorPalette.objPink,
  objtitle: colorPalette.black,

  itembk:  colorPalette.itemPink,
  itemtext: colorPalette.black,
}

export const lightPink: ObjectivePallete = {
  ...lightNoTheme,
  icontintcolor: colorPalette.black,
  icontintcolorfade: colorPalette.pinkdarkerdarker,
  
  bordercolorlight: colorPalette.red,
  
  doneicontint: colorPalette.greendarker,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.reddarker,
  
  objbk: colorPalette.objPinkLight,
  itembk:  colorPalette.itemPinkLight,
  
  objtitle: colorPalette.black,
  itemtext: colorPalette.black,
}

export const getObjTheme = (appTheme: string, t: string): ObjectivePallete => {
  if(appTheme === 'dark'){
    let rtn = noTheme;

    if(t === 'blue') rtn = darkBlue;
    else if(t === 'red') rtn = darkRed;
    else if(t === 'green') rtn = darkGreen;
    else if(t === 'white') rtn = darkWhite;
    else if(t === 'cyan') rtn = darkCyan;
    else if(t === 'pink') rtn = darkPink;

    return rtn;
  }
  else if(appTheme === 'light'){
    let rtn = lightNoTheme;

    if(t === 'blue') rtn = lightBlue;
    else if(t === 'red') rtn = lightRed;
    else if(t === 'green') rtn = lightGreen;
    else if(t === 'white') rtn = lightWhite;
    else if(t === 'cyan') rtn = lightCyan;
    else if(t === 'pink') rtn = lightPink;

    return rtn;
  }
  else{
    return lightNoTheme;
  }
}