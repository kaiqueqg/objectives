import { ImageStyle, ViewStyle } from "react-native";
import { Themes } from "./Types";
import { cp } from "./ColorPalette";

export const globalStyle = {
  baseImageContainer: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
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
  },
} as const;
export type GlobalStyle = typeof globalStyle;
/// Theme for the hole APP
export type AppPalette = {
  backgroundcolordarker?: string,
  backgroundcolordark?: string,
  backgroundcolor?: string,
  backgroundcolorlight?: string,
  backgroundcolorcontrast?: string,

  icontint?: string,
  icontintfade?: string,
  icontintselected?: string,
  icontintcolorcontrast?: string, 

  textcolor?: string,
  textcolorfade?: string,
  textcolorcontrast?: string,

  innerbackgroundcolor?: string,
  
  innertextcolor?: string,
  innertextcolorfade?: string,
  innertextcolorcontrast?: string,
  innertextfadedark?: string,
  innertextplaceholder?: string,

  bordercolor?: string,
  bordercolorfade?: string,
  bordercolorlight?: string,
  bordercolorselecting?: string,
  bordercolorselected: string,
  bordercolorwasjustadded?: string,

  doneicontint?: string,
  trashicontint?: string,
  cancelicontint?: string,

  fowardbk: string,
  fowardtext: string,
  neutralbk: string,
  neutraltext: string,
  backwardbk: string,
  backwardtext: string,
  resetbk: string,
  resettext: string,

  backgroundTag: string,
  backgroundTagSelected: string,
  backgroundTagSpecial: string,
  textTag: string,
  textTagSelected: string,
  textTagSpecial: string,
  refreshtokenbuttonbk: string,

  bottombariconselected: string,

  actionicontint: string,
  onlineicontint: string,
  inprogressicontint: string,
  offlineicontint: string,
};

export const light: AppPalette = {
  backgroundcolordarker: "#E0E0E0",
  backgroundcolordark: cp.greylighter,
  backgroundcolor: cp.white,
  backgroundcolorlight: cp.greylight,
  backgroundcolorcontrast: cp.bluedarkerdarker,

  // Tag
  backgroundTag: cp.transparent,
  textTag: cp.black,
  
  backgroundTagSelected: cp.bluelight,
  textTagSelected: cp.black,

  backgroundTagSpecial: cp.greydark,
  textTagSpecial: cp.beige,

  textcolor: cp.black,
  textcolorfade: cp.grey,
  textcolorcontrast: cp.greylight,

  bordercolor: cp.black,
  bordercolorfade: cp.grey,
  bordercolorselected: cp.grey,

  refreshtokenbuttonbk: cp.beige,
  bottombariconselected: cp.bluedarky,

  icontint: cp.black,
  icontintfade: cp.greylighty,
  icontintselected: cp.bluedarky,

  cancelicontint: cp.yellow,
  trashicontint: cp.reddark,
  doneicontint: cp.green,

  actionicontint: cp.bluedark,
  onlineicontint: cp.green,
  inprogressicontint: cp.black,
  offlineicontint: cp.redlight,

  fowardbk: cp.bluelight,
  fowardtext: cp.black,
  neutralbk: cp.greylighter,
  neutraltext: cp.black,
  backwardbk: cp.yellow,
  backwardtext: cp.black,
  resetbk: cp.redlightlight,
  resettext: cp.black,
}

export const dark: AppPalette = {
  backgroundcolordarker: cp.bluedarkerdarker,
  backgroundcolordark: cp.bluedarker,
  backgroundcolor: cp.bluedark,
  backgroundcolorlight: cp.bluelighty,
  backgroundcolorcontrast: cp.beige,

  backgroundTag: '#00000026',
  textTag: cp.beige,

  backgroundTagSelected: cp.bluelight,
  textTagSelected: cp.black,

  backgroundTagSpecial: cp.bluedarkerdarker,
  textTagSpecial: cp.beige,

  textcolor: cp.beige,
  textcolorfade: cp.beigedark,
  textcolorcontrast: cp.black,

  bordercolor: cp.beige,
  bordercolorfade: cp.beigedark,
  bordercolorselected: cp.bluelight,

  refreshtokenbuttonbk: cp.beige,
  bottombariconselected: cp.bluelight,

  icontint: cp.beige,
  icontintfade: cp.beigedark,
  icontintselected: cp.bluelight,

  cancelicontint: cp.yellow,
  trashicontint: cp.redlight,
  doneicontint: cp.green,

  actionicontint: cp.bluedark,
  onlineicontint: cp.green,
  inprogressicontint: cp.yellow,
  offlineicontint: cp.redlight,

  fowardbk: cp.blue,
  fowardtext: cp.black,
  neutralbk: cp.greylight,
  neutraltext: cp.black,
  backwardbk: cp.yellow,
  backwardtext: cp.black,
  resetbk: cp.redlighty,
  resettext: cp.black,
};

export const win95 = {
  // backgroundcolordarker: cp.bluedarkerdarker,
  // backgroundcolordark: cp.bluedarker,
  // backgroundcolor: cp.bluedark,
  // backgroundcolorlight: cp.bluelighty,
  // backgroundcolorcontrast: cp.beige,

  // backgroundTag: '#00000026',
  // textTag: cp.beige,

  // backgroundTagSelected: cp.bluelight,
  // textTagSelected: cp.black,

  // backgroundTagSpecial: cp.bluedarkerdarker,
  // textTagSpecial: cp.beige,

  // textcolor: cp.beige,
  // textcolorfade: cp.beigedark,
  // textcolorcontrast: cp.black,

  // bordercolor: cp.beige,
  // bordercolorfade: cp.beigedark,

  // refreshtokenbuttonbk: cp.beige,
  // bottombariconselected: cp.bluelight,

  // icontint: cp.beige,
  // icontintfade: cp.beigedark,
  // icontintselected: cp.bluelight,

  // cancelicontint: cp.yellow,
  // trashicontint: cp.redlight,
  // doneicontint: cp.green,

  // actionicontint: cp.bluedark,
  // onlineicontint: cp.green,
  // inprogressicontint: cp.yellow,
  // offlineicontint: cp.redlight,

  // fowardbk: cp.blue,
  // fowardtext: cp.black,
  // neutralbk: cp.greylight,
  // neutraltext: cp.black,
  // backwardbk: cp.yellow,
  // backwardtext: cp.black,
  // resetbk: cp.redlighty,
  // resettext: cp.black,
}

/// -----------------------------

/// Theme for the OBJECTIVES
export type ObjectivePallete = {
  palleteName: string,

  backgroundcolordarker?: string,
  backgroundcolordark?: string,
  backgroundcolor?: string,
  backgroundcolorlight?: string,
  backgroundcolorcontrast?: string,

  icontint?: string,
  icontintfade?: string,
  icontintselected?: string,
  icontintcolorcontrast?: string, 

  textcolor?: string,
  textcolorfade?: string,
  textcolorcontrast?: string,

  innerbackgroundcolor?: string,
  
  innertextcolor?: string,
  innertextcolorfade?: string,
  innertextcolorcontrast?: string,
  innertextfadedark?: string,
  innertextplaceholder?: string,

  bordercolor?: string,
  bordercolorfade?: string,
  bordercolorlight?: string,
  bordercolorselecting?: string,
  bordercolorselected?: string,
  bordercolorwasjustadded?: string,

  doneicontint?: string,
  trashicontint?: string,
  cancelicontint?: string,
  inputbk?: string,

  borderRadius: number,
  marginHorizontal: number,
  marginVertical: number,


}

export const noTheme: ObjectivePallete = {
  palleteName: 'noTheme',
  icontint: cp.beige,
  icontintfade: cp.grey,
  icontintcolorcontrast: cp.bluelight,
  icontintselected: cp.beige,

  bordercolor: cp.black,
  bordercolorlight: cp.beige,
  bordercolorselecting: cp.beige,
  bordercolorselected: cp.beige,
  bordercolorwasjustadded: cp.beige,


  doneicontint: cp.greenlight,
  cancelicontint: cp.yellow,
  trashicontint: cp.redlight,

  textcolor: cp.beige,

  backgroundcolor: cp.bluedark,
  backgroundcolordark: cp.bluedarkerdarker,
  innerbackgroundcolor: cp.itemNoTheme,

  innertextcolor: cp.beige,
  innertextcolorcontrast: cp.beige,
  innertextcolorfade: cp.grey,
  innertextfadedark: cp.greydarky,
  innertextplaceholder: cp.beigedarker,

  borderRadius: 5,
  marginHorizontal: 6,
  marginVertical: 1,
}

export const lightNoTheme: ObjectivePallete = {
  palleteName: 'lightNoTheme',
  icontint: cp.black,
  icontintfade: cp.grey,
  icontintcolorcontrast: cp.reddarker,
  icontintselected: cp.black,
  
  bordercolor: cp.black,
  bordercolorlight: cp.grey,
  bordercolorselecting: cp.reddark,
  bordercolorselected: cp.reddark,
  bordercolorwasjustadded: cp.reddark,

  doneicontint: cp.greendarker,
  cancelicontint: cp.yellow,
  trashicontint: cp.reddarker,
  
  backgroundcolor: cp.objNoThemeLight,
  backgroundcolordark: cp.itemNoThemeLightDark,

  innerbackgroundcolor: cp.itemNoThemeLight,
  
  textcolor: cp.black,
  innertextcolor: cp.black,
  innertextcolorcontrast: cp.black,
  innertextcolorfade: cp.grey,
  innertextfadedark: cp.greylighty,
  innertextplaceholder: cp.black,
  
  borderRadius: 5,
  marginHorizontal: 6,
  marginVertical: 1,
} 

export const darkBlue: ObjectivePallete = {
  ...noTheme,
  palleteName: 'darkBlue',

  icontintcolorcontrast: 'rgb(40, 200, 240)',
  
  backgroundcolor: cp.objBlue,
  backgroundcolordark: cp.itemBlueDark,

  innerbackgroundcolor:  cp.itemBlue,
  
  innertextcolorfade: cp.grey,
  innertextcolorcontrast: cp.beige,

  bordercolorselecting: 'rgb(40, 200, 240)',
  bordercolorselected: 'rgb(40, 200, 240)',
  bordercolorwasjustadded: 'rgb(40, 200, 240)',
}

export const lightBlue: ObjectivePallete = {
  ...lightNoTheme,
  palleteName: 'lightBlue',
  icontint: cp.black,
  icontintfade: cp.blue,
  icontintcolorcontrast: 'rgb(94, 255, 0)',

  doneicontint: cp.greendark,
  cancelicontint: cp.yellow,
  
  backgroundcolor: cp.objBlueLight,
  backgroundcolordark: cp.itemBlueLightDark,

  innerbackgroundcolor:  cp.itemBlueLight,
  
  innertextcolorfade: cp.greydark,
  innertextcolorcontrast: cp.beige,

  bordercolorselecting: 'rgb(94, 255, 0)',
  bordercolorselected: 'rgb(94, 255, 0)',
  bordercolorwasjustadded: 'rgb(94, 255, 0)',
}

export const darkRed: ObjectivePallete = {
  ...noTheme,
  palleteName: 'darkRed',
  icontint: cp.beige,
  icontintfade: cp.reddarkerdarker,
  icontintcolorcontrast: cp.orangelight,

  backgroundcolor: cp.objRed,
  backgroundcolordark: cp.itemRedDark,

  innerbackgroundcolor: cp.itemRed,

  doneicontint: cp.greenlight,
  trashicontint: cp.redlightlight,
  
  innertextcolorcontrast: cp.beige,
  innertextcolorfade: cp.reddarkerdarker,

  bordercolorselecting: cp.orangelight,
  bordercolorselected: cp.orangelight,
  bordercolorwasjustadded: cp.orangelight,
}

export const lightRed: ObjectivePallete = {
  ...lightNoTheme,
  palleteName: 'lightRed',
  bordercolorlight: cp.black,
  icontintfade: cp.redlighty,
  icontintcolorcontrast: cp.yellow,

  backgroundcolor: cp.objRedLight,
  backgroundcolordark: cp.itemRedLightDark,

  innerbackgroundcolor: cp.itemRedLight,

  doneicontint: cp.greendark,
  cancelicontint: cp.yellow,
  trashicontint: cp.reddarker,
  
  innertextcolorfade: cp.redlightlight,
  
  bordercolorselecting: cp.yellow,
  bordercolorselected: cp.yellow,
  bordercolorwasjustadded: cp.yellow,
}

export const darkGreen: ObjectivePallete = {
  ...noTheme,
  palleteName: 'darkGreen',
  icontint: cp.beige,
  icontintfade: cp.greendarker,
  icontintcolorcontrast: cp.bluedarky,
  icontintselected: cp.beige,
  
  backgroundcolor: cp.objGreen,
  backgroundcolordark: cp.greendarkerdarker,

  innertextcolor: cp.beige,
  innertextcolorcontrast: cp.beige,
  innerbackgroundcolor:  cp.itemGreen,
  innertextcolorfade: cp.greendarker,
  
  bordercolor: cp.black,
  bordercolorselecting: 'yellowgreen',
  bordercolorselected: 'yellowgreen',
  bordercolorwasjustadded: 'yellowgreen',
}

export const lightGreen: ObjectivePallete = {
  ...lightNoTheme,
  palleteName: 'lightGreen',
  icontint: cp.black,
  icontintfade: cp.greendark,
  icontintcolorcontrast: cp.red,
  icontintselected: cp.black,
  
  innertextcolor: cp.black,
  innertextcolorcontrast: cp.beige,
  innertextcolorfade: cp.greendarker,

  trashicontint: cp.reddarker,
  doneicontint: cp.greendarker,
  cancelicontint: cp.yellow,

  backgroundcolor: cp.objGreenLight,
  backgroundcolordark: cp.greendark,

  innerbackgroundcolor:  cp.itemGreenLight,
 
  bordercolor: cp.black,
  bordercolorlight: cp.black,
  bordercolorselecting: cp.red,
  bordercolorselected: cp.red,
  bordercolorwasjustadded: cp.red,
}

export const darkWhite: ObjectivePallete = {
  ...noTheme,
  palleteName: 'darkWhite',
  icontint: cp.black,
  icontintfade: cp.grey,
  icontintcolorcontrast: cp.red,
  
  bordercolorlight: cp.red,
  
  doneicontint: cp.greendark,
  cancelicontint: cp.yellow,
  trashicontint: cp.reddarker,
  
  backgroundcolor: cp.objWhite,
  backgroundcolordark: cp.itemWhiteDark,

  innerbackgroundcolor:  cp.itemWhite,
  innertextcolorfade: cp.greydarky,
  
  textcolor: cp.black,
  innertextcolor: cp.black,
  innertextcolorcontrast: cp.beige,
  
  bordercolorselecting: cp.red,
  bordercolorselected: cp.red,
  bordercolorwasjustadded: cp.red,
}

export const lightWhite: ObjectivePallete = {
  ...lightNoTheme,
  palleteName: 'darkWhite',
  icontint: cp.black,
  icontintfade: cp.grey,
  icontintcolorcontrast: cp.red,
  
  bordercolorlight: cp.red,
  
  doneicontint: cp.greendark,
  cancelicontint: cp.yellow,
  trashicontint: cp.reddarker,
  
  backgroundcolor: cp.objWhite,
  backgroundcolordark: cp.itemWhiteDark,

  innerbackgroundcolor:  cp.itemWhite,
  innertextcolorfade: cp.greydarky,
  
  textcolor: cp.black,
  innertextcolor: cp.black,
  innertextcolorcontrast: cp.beige,
  
  bordercolorselecting: cp.red,
  bordercolorselected: cp.red,
  bordercolorwasjustadded: cp.red,
}

export const darkCyan: ObjectivePallete = {
  ...noTheme,
  palleteName: 'darkCyan',
  icontint: cp.black,
  icontintfade: cp.cyandarkerdarker,
  icontintcolorcontrast: 'rgb(0, 251, 255)',
  icontintselected: cp.black,
  
  innertextcolor: cp.black,
  innertextcolorcontrast: cp.beige,
  
  backgroundcolor: cp.objCyan,
  backgroundcolordark: cp.itemCyanDark,
  
  innerbackgroundcolor:  cp.itemCyan,
  innertextcolorfade: cp.greylighty,
  
  bordercolor: cp.black,
  bordercolorselecting: 'rgb(0, 251, 255)',
  bordercolorselected: 'rgb(0, 251, 255)',
  bordercolorwasjustadded: 'rgb(0, 251, 255)',
}

export const lightCyan: ObjectivePallete = {
  ...lightNoTheme,
  palleteName: 'lightCyan',
  icontint: cp.black,
  icontintfade: cp.cyanlight,
  icontintcolorcontrast: 'rgb(94, 255, 0)',
  icontintselected: cp.black,
  
  doneicontint: cp.greenlight,
  cancelicontint: cp.yellow,
  trashicontint: cp.reddarker,

  backgroundcolor: cp.objCyanLight,
  backgroundcolordark: cp.itemCyanLightDark,

  innertextcolor: cp.black,
  innertextcolorcontrast: cp.beige,
  innerbackgroundcolor:  cp.itemCyanLight,
  innertextcolorfade: cp.greydarky,
  
  bordercolorselecting: 'rgb(94, 255, 0)',
  bordercolorselected: 'rgb(94, 255, 0)',
  bordercolorwasjustadded: 'rgb(94, 255, 0)',
}

export const darkPink: ObjectivePallete = {
  ...noTheme,
  palleteName: 'darkPink',
  icontint: cp.black,
  icontintfade: cp.pinklight,
  icontintcolorcontrast: cp.red,
  icontintselected: cp.black,
  
  doneicontint: cp.greendarker,
  trashicontint: cp.reddarker,
  
  backgroundcolor: cp.objPink,
  backgroundcolordark: cp.itemPinkDark,
  
  innerbackgroundcolor:  cp.itemPink,
  innertextcolor: cp.black,
  innertextcolorcontrast: cp.beige,
  innertextcolorfade: cp.grey,
  
  bordercolorselecting: cp.reddark,
  bordercolorselected: cp.reddark,
  bordercolorwasjustadded: cp.reddark,
}

export const lightPink: ObjectivePallete = {
  ...lightNoTheme,
  palleteName: 'lightPink',
  icontint: cp.black,
  icontintfade: cp.pinklight,
  icontintcolorcontrast: cp.red,
  icontintselected: cp.black,
  
  doneicontint: cp.greendarker,
  trashicontint: cp.reddarker,
  
  backgroundcolor: cp.objPink,
  backgroundcolordark: cp.itemPinkDark,
  
  innerbackgroundcolor:  cp.itemPink,
  innertextcolor: cp.black,
  innertextcolorcontrast: cp.beige,
  innertextcolorfade: cp.grey,
  
  bordercolorselecting: cp.reddark,
  bordercolorselected: cp.reddark,
  bordercolorwasjustadded: cp.reddark,
}

/// -----------------------------

export const getObjTheme = (appTheme: string, t: string): ObjectivePallete => {
  if(appTheme === Themes.Dark){
    let rtn = noTheme;

    if(t === 'blue') rtn = darkBlue;
    else if(t === 'red') rtn = darkRed;
    else if(t === 'green') rtn = darkGreen;
    else if(t === 'white') rtn = darkWhite;
    else if(t === 'cyan') rtn = darkCyan;
    else if(t === 'pink') rtn = darkPink;
    return rtn;
  }
  else if(appTheme === Themes.Light){
    let rtn = lightNoTheme;

    if(t === 'blue') rtn = lightBlue;
    else if(t === 'red') rtn = lightRed;
    else if(t === 'green') rtn = lightGreen;
    else if(t === 'white') rtn = lightWhite;
    else if(t === 'cyan') rtn = lightCyan;
    else if(t === 'pink') rtn = lightPink;
    return rtn;
  }
  // else if(appTheme === Themes.Win95){
  //   return win95;
  // }
  
  return noTheme;
}

