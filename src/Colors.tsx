import { ViewStyle } from "react-native";

export type ColorPalette = {
  transparent: string,
  white: string,
  black: string,
  darker: string,
  lighter: string,

  bluedarkerdarker: string,
  bluedarker: string,
  bluedark: string,
  bluedarky: string,
  blue: string,
  bluelighty: string,
  bluelight: string,
  bluelightlight: string,

  beige: string,
  beigey: string,
  beigelightdark: string,
  beigedarky: string,
  beigedark: string,
  beigedarker: string,

  brown: string,
  brownlight: string,

  greydark: string,
  greydarky: string,
  grey: string,
  greylighty: string,
  greylight: string,
  greylighter: string,

  reddarkerdarker: string,
  reddarker: string,
  reddark: string,
  red: string,
  redlight: string,
  redlighty: string,
  redlightlight: string,

  greendarkerdarker: string,
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

  itemBlueDark: string,
  itemRedDark: string,
  itemWhiteDark: string,
  itemGreenDark: string,
  itemNoThemeDark: string,
  itemCyanDark: string,
  itemPinkDark: string,

  itemBlueLight: string,
  itemRedLight: string,
  itemWhiteLight: string,
  itemGreenLight: string,
  itemNoThemeLight: string,
  itemCyanLight: string,
  itemPinkLight: string,

  itemBlueLightDark: string,
  itemRedLightDark: string,
  itemWhiteLightDark: string,
  itemGreenLightDark: string,
  itemNoThemeLightDark: string,
  itemCyanLightDark: string,
  itemPinkLightDark: string,
};

export const colorPalette: ColorPalette = {
  transparent: 'rgba(0, 0, 0, 0)',
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
  darker: 'rgba(0, 0, 0, 0.18)',
  lighter: 'rgba(255, 255, 255, 0.18)',

  bluedarkerdarker: 'rgb(29, 29, 29)',
  bluedarker: 'rgb(33, 36, 43)',
  bluedark: 'rgb(40, 44, 52)',
  bluedarky: 'rgb(13, 133, 254)',
  blue: 'rgb(104, 154, 255)',
  bluelighty: 'rgb(139, 190, 255)',
  bluelight: 'rgb(176, 211, 254)',
  bluelightlight: 'rgb(214, 228, 253)',

  beige: 'rgba(247, 247, 232, 1)',
  beigey: 'rgb(245, 245, 220)',
  beigelightdark: 'rgb(185, 185, 160)',
  beigedarky: 'rgb(129, 129, 95)',
  beigedark: 'rgb(75, 75, 70)',
  beigedarker: 'rgb(50, 50, 45)',

  brown: 'rgb(216, 174, 126)',
  brownlight: 'rgb(224, 220, 182)',

  greydark: 'rgb(58, 58, 58)',
  greydarky: 'rgba(80, 80, 80, 1)',
  grey: 'rgb(117, 117, 117)',
  greylighty: 'rgb(176, 176, 176)',
  greylight: 'rgb(204, 204, 204)',
  greylighter: 'rgb(230, 230, 230)',

  reddarkerdarker: 'rgb(103, 37, 37)',
  reddarker: 'rgb(166, 33, 33)',
  reddark: 'rgb(255, 0, 0)',
  red: 'rgb(254, 58, 59)',
  redlight: 'rgb(255, 109, 110)',
  redlighty: '#FF7575',
  redlightlight: 'rgb(254, 185, 184)',

  greendarkerdarker: 'rgb(26, 76, 28)',
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
  itemNoThemeDark: 'rgb(29, 32, 37)',
  
  objBlue: 'rgb(35, 49, 92)',
  itemBlue: 'rgb(49, 69, 129)',
  itemBlueDark: 'rgb(28, 39, 73)',

  objRed: 'rgb(70, 0, 16)',
  itemRed: 'rgb(104, 18, 38)',
  itemRedDark: 'rgb(53, 0, 12)',

  objGreen: 'rgb(0, 43, 23)',
  itemGreen: 'rgba(27, 72, 51, 1)',
  itemGreenDark: 'rgb(0, 32, 17)',

  objWhite: 'rgb(245, 245, 220)',
  itemWhite: 'rgb(216, 174, 126)',
  itemWhiteDark: 'rgb(156, 125, 90)',

  objCyan: 'rgb(37, 99, 119)',
  itemCyan: 'rgb(50, 135, 164)',
  itemCyanDark: 'rgba(30, 79, 96, 1)',

  objPink: 'rgb(249, 197, 213)',
  itemPink: 'rgb(244, 153, 181)',
  itemPinkDark: 'rgba(234, 109, 146, 1)',

  objNoThemeLight: 'rgb(255, 255, 255)',
  itemNoThemeLight: 'rgba(204, 204, 204, 1)',
  itemNoThemeLightDark: 'rgba(170, 170, 170, 1)',
  
  objBlueLight: 'rgb(214, 228, 253)',
  itemBlueLight: 'rgba(137, 186, 246, 1)',
  itemBlueLightDark: 'rgba(88, 152, 230, 1)',

  objRedLight: 'rgb(254, 185, 184)',
  itemRedLight: 'rgba(238, 115, 115, 1)',
  itemRedLightDark: 'rgba(225, 72, 72, 1)',

  objGreenLight: 'rgb(211, 244, 211)',
  itemGreenLight: 'rgba(127, 196, 127, 1)',
  itemGreenLightDark: 'rgba(68, 187, 68, 1)',

  objWhiteLight: 'rgb(245, 245, 220)',
  itemWhiteLight: 'rgb(216, 174, 126)',
  itemWhiteLightDark: 'rgb(156, 125, 90)',

  objCyanLight: 'rgb(142, 201, 220)',
  itemCyanLight: 'rgb(95, 178, 206)',
  itemCyanLightDark: 'rgba(77, 158, 184, 1)',

  objPinkLight: 'rgb(249, 197, 213)',
  itemPinkLight: 'rgb(244, 153, 181)',
  itemPinkLightDark: 'rgba(234, 109, 146, 1)',
};

export type GlobalStyle = {
  baseImageContainer: ViewStyle,
  baseBiggerImageContainer: ViewStyle,
  baseImage: ViewStyle,
  baseBiggerImage: ViewStyle,
  baseSmallImage: ViewStyle,
  baseSmallerImage: ViewStyle,
  baseVerySmallImage: ViewStyle,
  baseItemCheckImage: ViewStyle,
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
  },
  baseImage: {
    height: 25,
    width: 25,
  },
  baseBiggerImage:{
    height: 30,
    width: 30,
  },
  baseSmallImage: {
    height: 22,
    width: 22,
  },
  baseSmallerImage: {
    height: 18,
    width: 18,
  },
  baseVerySmallImage: {
    height: 15,
    width: 15,
  },
  baseItemCheckImage:{
    flex:1,
    maxHeight: 50,
    marginVertical: 2,

    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'solid',
  },
}

/// Theme for the hole APP
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
  refreshtokenbuttonbk: string,
  bottombariconselected: string,

  icontint: string,
  icontintfade: string,
  icontintselected: string,

  doneicontint: string,
  trashicontint: string,
  cancelicontint: string,

  actionicontint: string,
  onlineicontint: string,
  inprogressicontint: string,
  offlineicontint: string,
};

export const light: AppPalette = {
  backgroundcolordarker: "#E0E0E0",
  backgroundcolordark: colorPalette.greylighter,
  backgroundcolor: colorPalette.white,
  backgroundcolorcontrast: colorPalette.bluedarkerdarker,

  textcolor: colorPalette.black,
  textcolorfade: colorPalette.grey,
  textcolorcontrast: colorPalette.greylight,

  bordercolor: colorPalette.black,
  bordercolorfade: colorPalette.grey,

  loginbuttonbk: colorPalette.bluelight,
  logoutbuttonbk: colorPalette.redlightlight,
  refreshtokenbuttonbk: colorPalette.beige,
  bottombariconselected: colorPalette.bluedarky,

  icontint: colorPalette.black,
  icontintfade: colorPalette.grey,
  icontintselected: colorPalette.blue,

  cancelicontint: colorPalette.yellowdark,
  trashicontint: colorPalette.reddark,
  doneicontint: colorPalette.greendarker,

  actionicontint: colorPalette.bluedark,
  onlineicontint: colorPalette.green,
  inprogressicontint: colorPalette.black,
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
  logoutbuttonbk: colorPalette.redlight,
  refreshtokenbuttonbk: colorPalette.beige,
  bottombariconselected: colorPalette.bluelight,

  icontint: colorPalette.beige,
  icontintfade: colorPalette.beigedark,
  icontintselected: colorPalette.bluelight,

  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.redlight,
  doneicontint: colorPalette.green,

  actionicontint: colorPalette.bluedark,
  onlineicontint: colorPalette.green,
  inprogressicontint: colorPalette.yellow,
  offlineicontint: colorPalette.redlight,
};
/// -----------------------------

/// Theme for the OBJECTIVES
export type ObjectivePallete = {
  icontintcolor?: string,
  icontintcolorfade?: string,
  
  inputbk?: string,
  bordercolor?: string,
  bordercolorlight?: string,
  bordercolorselecting?: string,
  bordercolorselected?: string,
  bordercolorwasjustadded?: string,
  
  doneicontint?: string,
  cancelicontint?: string,
  trashicontint?: string,
  
  objbk?: string,
  objtitle?: string,

  itembk?: string,
  itembkdark?: string,
  itemtext?: string,
  itemtextcontrast?: string,
  itemtextfade?: string,
  itemtextfadedark?: string,
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
  bordercolorselecting: colorPalette.beige,
  bordercolorselected: colorPalette.beige,
  bordercolorwasjustadded: colorPalette.beige,

  doneicontint: colorPalette.greenlight,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.redlight,
  
  objbk: colorPalette.objNoTheme,
  objtitle: colorPalette.beige,

  itembk: colorPalette.itemNoTheme,
  itembkdark: colorPalette.itemNoThemeDark,
  itemtext: colorPalette.beige,
  itemtextcontrast: colorPalette.black,
  itemtextfade: colorPalette.grey,
  itemtextfadedark: colorPalette.greydarky,
  itemtextplaceholder: colorPalette.beigedarker,
  
  borderRadius: 5,
  marginHorizontal: 6,
  marginVertical: 1,
}

export const lightNoTheme: ObjectivePallete = {
  icontintcolor: colorPalette.black,
  icontintcolorfade: colorPalette.greylighty,
  
  bordercolor: colorPalette.black,
  bordercolorlight: colorPalette.grey,
  bordercolorselecting: colorPalette.reddark,
  bordercolorselected: colorPalette.reddark,
  bordercolorwasjustadded: colorPalette.reddark,

  doneicontint: colorPalette.greendarker,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.reddarker,
  
  objbk: colorPalette.objNoThemeLight,
  itembk: colorPalette.itemNoThemeLight,
  itembkdark: colorPalette.itemNoThemeLightDark,
  
  objtitle: colorPalette.black,
  itemtext: colorPalette.black,
  itemtextcontrast: colorPalette.beige,
  itemtextfade: colorPalette.grey,
  itemtextfadedark: colorPalette.greylighty,
  itemtextplaceholder: colorPalette.black,
  
  borderRadius: 5,
  marginHorizontal: 6,
  marginVertical: 1,
} 

export const darkBlue: ObjectivePallete = {
  ...noTheme,
  
  objbk: colorPalette.objBlue,
  itembk:  colorPalette.itemBlue,
  itembkdark: colorPalette.itemBlueDark,

  itemtextfade: colorPalette.bluedarkerdarker,

  bordercolorselecting: 'rgb(40, 200, 240)',
  bordercolorselected: 'rgb(40, 200, 240)',
  bordercolorwasjustadded: 'rgb(40, 200, 240)',
}

export const lightBlue: ObjectivePallete = {
  ...lightNoTheme,
  icontintcolor: colorPalette.black,
  icontintcolorfade: colorPalette.blue,

  doneicontint: colorPalette.greendark,
  cancelicontint: colorPalette.yellow,
  
  objbk: colorPalette.objBlueLight,
  itembk:  colorPalette.itemBlueLight,
  itembkdark: colorPalette.itemBlueLightDark,

  bordercolorselecting: colorPalette.reddark,
  bordercolorselected: colorPalette.reddark,
  bordercolorwasjustadded: colorPalette.reddark,
}
export const darkRed: ObjectivePallete = {
  ...noTheme,

  objbk: colorPalette.objRed,
  itembk: colorPalette.itemRed,
  itembkdark: colorPalette.itemRedDark,

  doneicontint: colorPalette.greenlight,
  trashicontint: colorPalette.redlightlight,
  
  itemtextfade: colorPalette.reddarker,

  bordercolorselecting: colorPalette.red,
  bordercolorselected: colorPalette.red,
  bordercolorwasjustadded: colorPalette.red,
}

export const lightRed: ObjectivePallete = {
  ...lightNoTheme,
  bordercolorlight: colorPalette.black,
  icontintcolorfade: colorPalette.redlighty,

  objbk: colorPalette.objRedLight,
  itembk: colorPalette.itemRedLight,
  itembkdark: colorPalette.itemRedLightDark,

  doneicontint: colorPalette.greendark,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.reddarker,
  
  itemtextfade: colorPalette.black,
  
  bordercolorselecting: colorPalette.red,
  bordercolorselected: colorPalette.red,
  bordercolorwasjustadded: colorPalette.red,
}

export const darkGreen: ObjectivePallete = {
  ...noTheme,
  bordercolorlight: colorPalette.red,

  objbk: colorPalette.objGreen,
  itembk:  colorPalette.itemGreen,
  itembkdark: colorPalette.itemGreenDark,
  
  itemtextfade: colorPalette.greendarkerdarker,
  
  bordercolorselecting: 'yellowgreen',
  bordercolorselected: 'yellowgreen',
  bordercolorwasjustadded: 'yellowgreen',
}

export const lightGreen: ObjectivePallete = {
  ...lightNoTheme,
  icontintcolorfade: colorPalette.greendark,

  doneicontint: colorPalette.greendarker,
  cancelicontint: colorPalette.yellowdark,

  objbk: colorPalette.objGreenLight,
  itembk:  colorPalette.itemGreenLight,
  itembkdark: colorPalette.itemGreenLight,
  
  bordercolorselecting: colorPalette.red,
  bordercolorselected: colorPalette.red,
  bordercolorwasjustadded: colorPalette.red,
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
  itembkdark: colorPalette.itemWhiteDark,
  itemtextfade: colorPalette.greydarky,
  
  objtitle: colorPalette.black,
  itemtext: colorPalette.black,
  itemtextcontrast: colorPalette.beige,
  
  bordercolorselecting: colorPalette.red,
  bordercolorselected: colorPalette.red,
  bordercolorwasjustadded: colorPalette.red,
}

export const lightWhite: ObjectivePallete = {
  ...lightNoTheme,
  icontintcolorfade: colorPalette.grey,
  
  bordercolorlight: colorPalette.black,
  
  doneicontint: colorPalette.greendark,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.reddarker,
  
  objbk: colorPalette.objWhiteLight,
  itembk:  colorPalette.itemWhiteLight,
  itembkdark: colorPalette.itemWhiteLightDark,
  itemtextfade: colorPalette.greydarky,
  itemtext: colorPalette.black,
  itemtextcontrast: colorPalette.beige,
  
  bordercolorselecting: colorPalette.red,
  bordercolorselected: colorPalette.red,
  bordercolorwasjustadded: colorPalette.red,
}

export const darkCyan: ObjectivePallete = {
  ...noTheme,
  icontintcolorfade: colorPalette.cyandarkerdarker,
  
  objbk: colorPalette.objCyan,
  
  itembk:  colorPalette.itemCyan,
  itembkdark: colorPalette.itemCyanDark,
  itemtextfade: colorPalette.greydarky,
  
  bordercolorselecting: 'rgb(0, 251, 255)',
  bordercolorselected: 'rgb(0, 251, 255)',
  bordercolorwasjustadded: 'rgb(0, 251, 255)',
}

export const lightCyan: ObjectivePallete = {
  ...lightNoTheme,
  icontintcolorfade: colorPalette.cyanlightly,
  
  doneicontint: colorPalette.greenlight,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.reddarker,

  objbk: colorPalette.objCyanLight,
  itembk:  colorPalette.itemCyanLight,
  itembkdark: colorPalette.itemCyanLightDark,
  itemtextfade: colorPalette.greydarky,
  
  objtitle: colorPalette.black,
  
  bordercolorselecting: colorPalette.red,
  bordercolorselected: colorPalette.red,
  bordercolorwasjustadded: colorPalette.red,
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
  itembkdark: colorPalette.itemPinkDark,
  itemtext: colorPalette.black,
  itemtextcontrast: colorPalette.beige,
  itemtextfade: colorPalette.beige,
  
  bordercolorselecting: colorPalette.reddark,
  bordercolorselected: colorPalette.reddark,
  bordercolorwasjustadded: colorPalette.reddark,
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
  itembkdark: colorPalette.itemPinkLightDark,
  itemtextfade: colorPalette.beige,
  
  objtitle: colorPalette.black,
  itemtext: colorPalette.black,
  itemtextcontrast: colorPalette.beige,
  
  bordercolorselecting: colorPalette.reddark,
  bordercolorselected: colorPalette.reddark,
  bordercolorwasjustadded: colorPalette.reddark,
}
/// -----------------------------

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