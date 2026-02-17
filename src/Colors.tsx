import { ImageStyle, ViewStyle } from "react-native";

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

  orangedark: string,
  orange: string,
  orangelight: string,

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

  reddarkerdarker: 'hsl(0, 67%, 35%)',
  reddarker: 'hsl(0, 67%, 39%)',
  reddark: 'hsl(0, 100%, 50%)',
  red: 'hsl(360, 99%, 61%)',
  redlight: 'hsl(360, 100%, 71%)',
  redlighty: 'hsl(0, 100%, 73%)',
  redlightlight: 'hsl(1, 97%, 86%)',

  orangedark: 'hsl(32, 100%, 33%)',
  orange: 'hsl(32, 100%, 50%)',
  orangelight: 'hsl(32, 100%, 67%)',

  greendarkerdarker: 'rgb(0, 30, 16)',
  greendarker: 'rgb(0, 73, 39)',
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

  objGreen: 'hsl(152, 100%, 8%)',
  itemGreen: 'hsl(151, 100%, 10%)',
  itemGreenDark: 'hsl(152, 100%, 6%)',

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
  baseImage: ImageStyle,
  baseBiggerImage: ImageStyle,
  baseSmallImage: ImageStyle,
  baseSmallerImage: ImageStyle,
  baseVerySmallImage: ImageStyle,
  baseItemCheckImage: ImageStyle,
}

export const globalStyle:GlobalStyle = {
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
}

export type GeneralPalette = {
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
  
  textColor?: string,

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
}

/// Theme for the hole APP
export type AppPalette = GeneralPalette & {
  // backgroundcolordarker: string,
  // backgroundcolordark: string,
  // backgroundcolor: string,
  // backgroundcolorlight: string,
  // backgroundcolorcontrast: string,

  backgroundTag: string,
  backgroundTagSelected: string,
  backgroundTagSpecial: string,
  textTag: string,
  textTagSelected: string,
  textTagSpecial: string,

  // textcolor: string,
  // textcolorfade: string,
  // textcolorcontrast: string,

  // bordercolor: string,
  // bordercolorfade: string,

  loginbuttonbk: string,
  logoutbuttonbk: string,
  refreshtokenbuttonbk: string,
  bottombariconselected: string,

  // icontint: string,
  // icontintfade: string,
  // icontintselected: string,

  // doneicontint: string,
  // trashicontint: string,
  // cancelicontint: string,

  actionicontint: string,
  onlineicontint: string,
  inprogressicontint: string,
  offlineicontint: string,
};

export const light: AppPalette = {
  backgroundcolordarker: "#E0E0E0",
  backgroundcolordark: colorPalette.greylighter,
  backgroundcolor: colorPalette.white,
  backgroundcolorlight: colorPalette.greylight,
  backgroundcolorcontrast: colorPalette.bluedarkerdarker,

  // Tag
  backgroundTag: colorPalette.transparent,
  textTag: colorPalette.black,
  
  backgroundTagSelected: colorPalette.bluelight,
  textTagSelected: colorPalette.black,

  backgroundTagSpecial: colorPalette.greydark,
  textTagSpecial: colorPalette.beige,

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
  icontintfade: colorPalette.greylighty,
  icontintselected: colorPalette.bluedarky,

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
  backgroundcolorlight: colorPalette.bluelighty,
  backgroundcolorcontrast: colorPalette.beige,

  backgroundTag: '#00000026',
  textTag: colorPalette.beige,

  backgroundTagSelected: colorPalette.bluelight,
  textTagSelected: colorPalette.black,

  backgroundTagSpecial: colorPalette.bluedarkerdarker,
  textTagSpecial: colorPalette.beige,

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
export type ObjectivePallete = GeneralPalette & {

  inputbk?: string,

  borderRadius: number,
  marginHorizontal: number,
  marginVertical: number,
}

export const noTheme: ObjectivePallete = {
  icontint: colorPalette.beige,
  icontintfade: colorPalette.grey,
  icontintcolorcontrast: colorPalette.bluelight,
  icontintselected: colorPalette.beige,
  
  bordercolor: colorPalette.black,
  bordercolorlight: colorPalette.beige,
  bordercolorselecting: colorPalette.beige,
  bordercolorselected: colorPalette.beige,
  bordercolorwasjustadded: colorPalette.beige,

  
  doneicontint: colorPalette.greenlight,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.redlight,
  
  textColor: colorPalette.beige,
  
  backgroundcolor: colorPalette.bluedark,
  backgroundcolordark: colorPalette.bluedarkerdarker,
  innerbackgroundcolor: colorPalette.itemNoTheme,

  innertextcolor: colorPalette.beige,
  innertextcolorcontrast: colorPalette.beige,
  innertextcolorfade: colorPalette.grey,
  innertextfadedark: colorPalette.greydarky,
  innertextplaceholder: colorPalette.beigedarker,
  
  borderRadius: 5,
  marginHorizontal: 6,
  marginVertical: 1,
}

export const lightNoTheme: ObjectivePallete = {
  icontint: colorPalette.black,
  icontintfade: colorPalette.greylighty,
  icontintcolorcontrast: colorPalette.reddarker,
  icontintselected: colorPalette.black,
  
  bordercolor: colorPalette.black,
  bordercolorlight: colorPalette.grey,
  bordercolorselecting: colorPalette.reddark,
  bordercolorselected: colorPalette.reddark,
  bordercolorwasjustadded: colorPalette.reddark,

  doneicontint: colorPalette.greendarker,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.reddarker,
  
  backgroundcolor: colorPalette.objNoThemeLight,
  backgroundcolordark: colorPalette.itemNoThemeLightDark,

  innerbackgroundcolor: colorPalette.itemNoThemeLight,
  
  textColor: colorPalette.black,
  innertextcolor: colorPalette.black,
  innertextcolorcontrast: colorPalette.black,
  innertextcolorfade: colorPalette.grey,
  innertextfadedark: colorPalette.greylighty,
  innertextplaceholder: colorPalette.black,
  
  borderRadius: 5,
  marginHorizontal: 6,
  marginVertical: 1,
} 

export const darkBlue: ObjectivePallete = {
  ...noTheme,
  icontintcolorcontrast: 'rgb(40, 200, 240)',
  
  backgroundcolor: colorPalette.objBlue,
  backgroundcolordark: colorPalette.itemBlueDark,

  innerbackgroundcolor:  colorPalette.itemBlue,
  
  innertextcolorfade: colorPalette.bluedarkerdarker,
  innertextcolorcontrast: colorPalette.beige,

  bordercolorselecting: 'rgb(40, 200, 240)',
  bordercolorselected: 'rgb(40, 200, 240)',
  bordercolorwasjustadded: 'rgb(40, 200, 240)',
}

export const lightBlue: ObjectivePallete = {
  ...lightNoTheme,
  icontint: colorPalette.black,
  icontintfade: colorPalette.blue,
  icontintcolorcontrast: 'rgb(94, 255, 0)',

  doneicontint: colorPalette.greendark,
  cancelicontint: colorPalette.yellow,
  
  backgroundcolor: colorPalette.objBlueLight,
  backgroundcolordark: colorPalette.itemBlueLightDark,

  innerbackgroundcolor:  colorPalette.itemBlueLight,

  bordercolorselecting: 'rgb(94, 255, 0)',
  bordercolorselected: 'rgb(94, 255, 0)',
  bordercolorwasjustadded: 'rgb(94, 255, 0)',
}

export const darkRed: ObjectivePallete = {
  ...noTheme,
  icontint: colorPalette.beige,
  icontintfade: colorPalette.reddarkerdarker,
  icontintcolorcontrast: colorPalette.orangelight,

  backgroundcolor: colorPalette.objRed,
  backgroundcolordark: colorPalette.itemRedDark,

  innerbackgroundcolor: colorPalette.itemRed,

  doneicontint: colorPalette.greenlight,
  trashicontint: colorPalette.redlightlight,
  
  innertextcolorcontrast: colorPalette.beige,
  innertextcolorfade: colorPalette.reddarkerdarker,

  bordercolorselecting: colorPalette.orangelight,
  bordercolorselected: colorPalette.orangelight,
  bordercolorwasjustadded: colorPalette.orangelight,
}

export const lightRed: ObjectivePallete = {
  ...lightNoTheme,
  bordercolorlight: colorPalette.black,
  icontintfade: colorPalette.redlighty,
  icontintcolorcontrast: colorPalette.yellow,

  backgroundcolor: colorPalette.objRedLight,
  backgroundcolordark: colorPalette.itemRedLightDark,

  innerbackgroundcolor: colorPalette.itemRedLight,

  doneicontint: colorPalette.greendark,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.reddarker,
  
  innertextcolorfade: colorPalette.redlighty,
  
  bordercolorselecting: colorPalette.yellow,
  bordercolorselected: colorPalette.yellow,
  bordercolorwasjustadded: colorPalette.yellow,
}

export const darkGreen: ObjectivePallete = {
  ...noTheme,
  icontint: colorPalette.beige,
  icontintfade: colorPalette.greendarker,
  icontintcolorcontrast: colorPalette.bluedarky,
  icontintselected: colorPalette.beige,
  
  backgroundcolor: colorPalette.objGreen,
  backgroundcolordark: colorPalette.greendarkerdarker,

  innertextcolor: colorPalette.beige,
  innertextcolorcontrast: colorPalette.beige,
  innerbackgroundcolor:  colorPalette.itemGreen,
  innertextcolorfade: colorPalette.greendarker,
  
  bordercolor: colorPalette.black,
  bordercolorselecting: 'yellowgreen',
  bordercolorselected: 'yellowgreen',
  bordercolorwasjustadded: 'yellowgreen',
}

export const lightGreen: ObjectivePallete = {
  ...lightNoTheme,
  icontint: colorPalette.black,
  icontintfade: colorPalette.greendark,
  icontintcolorcontrast: colorPalette.red,
  icontintselected: colorPalette.black,
  
  innertextcolor: colorPalette.black,
  innertextcolorcontrast: colorPalette.beige,
  innertextcolorfade: colorPalette.greendark,

  trashicontint: colorPalette.reddarker,
  doneicontint: colorPalette.greendarker,
  cancelicontint: colorPalette.yellow,

  backgroundcolor: colorPalette.objGreenLight,
  backgroundcolordark: colorPalette.greendark,

  innerbackgroundcolor:  colorPalette.itemGreenLight,
 
  bordercolor: colorPalette.black,
  bordercolorlight: colorPalette.black,
  bordercolorselecting: colorPalette.red,
  bordercolorselected: colorPalette.red,
  bordercolorwasjustadded: colorPalette.red,
}

export const darkWhite: ObjectivePallete = {
  ...noTheme,
  icontint: colorPalette.black,
  icontintfade: colorPalette.grey,
  icontintcolorcontrast: colorPalette.red,
  
  bordercolorlight: colorPalette.red,
  
  doneicontint: colorPalette.greendark,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.reddarker,
  
  backgroundcolor: colorPalette.objWhite,
  backgroundcolordark: colorPalette.itemWhiteDark,

  innerbackgroundcolor:  colorPalette.itemWhite,
  innertextcolorfade: colorPalette.greydarky,
  
  textColor: colorPalette.black,
  innertextcolor: colorPalette.black,
  innertextcolorcontrast: colorPalette.beige,
  
  bordercolorselecting: colorPalette.red,
  bordercolorselected: colorPalette.red,
  bordercolorwasjustadded: colorPalette.red,
}

export const lightWhite: ObjectivePallete = {
  ...lightNoTheme,
  icontintfade: colorPalette.grey,
  icontintcolorcontrast: colorPalette.red,
  
  bordercolorlight: colorPalette.black,
  
  doneicontint: colorPalette.greendark,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.reddarker,
  
  backgroundcolor: colorPalette.objWhiteLight,
  backgroundcolordark: colorPalette.itemWhiteLightDark,

  innerbackgroundcolor:  colorPalette.itemWhiteLight,
  innertextcolorfade: colorPalette.greydarky,
  innertextcolor: colorPalette.black,
  innertextcolorcontrast: colorPalette.beige,
  
  bordercolorselecting: colorPalette.red,
  bordercolorselected: colorPalette.red,
  bordercolorwasjustadded: colorPalette.red,
}

export const darkCyan: ObjectivePallete = {
  ...noTheme,
  icontint: colorPalette.black,
  icontintfade: colorPalette.cyandarkerdarker,
  icontintcolorcontrast: 'rgb(0, 251, 255)',
  icontintselected: colorPalette.black,
  
  innertextcolor: colorPalette.black,
  innertextcolorcontrast: colorPalette.beige,
  
  backgroundcolor: colorPalette.objCyan,
  backgroundcolordark: colorPalette.itemCyanDark,
  
  innerbackgroundcolor:  colorPalette.itemCyan,
  innertextcolorfade: colorPalette.greydarky,
  
  bordercolor: colorPalette.black,
  bordercolorselecting: 'rgb(0, 251, 255)',
  bordercolorselected: 'rgb(0, 251, 255)',
  bordercolorwasjustadded: 'rgb(0, 251, 255)',
}

export const lightCyan: ObjectivePallete = {
  ...lightNoTheme,
  icontint: colorPalette.black,
  icontintfade: colorPalette.cyanlight,
  icontintcolorcontrast: 'rgb(94, 255, 0)',
  icontintselected: colorPalette.black,
  
  doneicontint: colorPalette.greenlight,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.reddarker,

  backgroundcolor: colorPalette.objCyanLight,
  backgroundcolordark: colorPalette.itemCyanLightDark,

  innertextcolor: colorPalette.black,
  innertextcolorcontrast: colorPalette.beige,
  innerbackgroundcolor:  colorPalette.itemCyanLight,
  innertextcolorfade: colorPalette.greydarky,
  
  bordercolorselecting: 'rgb(94, 255, 0)',
  bordercolorselected: 'rgb(94, 255, 0)',
  bordercolorwasjustadded: 'rgb(94, 255, 0)',
}

export const darkPink: ObjectivePallete = {
  ...noTheme,
  icontint: colorPalette.black,
  icontintfade: colorPalette.pinklight,
  icontintcolorcontrast: colorPalette.red,
  icontintselected: colorPalette.black,
  
  doneicontint: colorPalette.greendarker,
  trashicontint: colorPalette.reddarker,
  
  backgroundcolor: colorPalette.objPink,
  backgroundcolordark: colorPalette.itemPinkDark,
  
  innerbackgroundcolor:  colorPalette.itemPink,
  innertextcolor: colorPalette.black,
  innertextcolorcontrast: colorPalette.beige,
  innertextcolorfade: colorPalette.grey,
  
  bordercolorselecting: colorPalette.reddark,
  bordercolorselected: colorPalette.reddark,
  bordercolorwasjustadded: colorPalette.reddark,
}

export const lightPink: ObjectivePallete = {
  ...lightNoTheme,
  icontint: colorPalette.black,
  icontintfade: colorPalette.pinklight,
  icontintcolorcontrast: colorPalette.red,
  icontintselected: colorPalette.black,
  
  doneicontint: colorPalette.greendarker,
  trashicontint: colorPalette.reddarker,
  
  backgroundcolor: colorPalette.objPink,
  backgroundcolordark: colorPalette.itemPinkDark,
  
  innerbackgroundcolor:  colorPalette.itemPink,
  innertextcolor: colorPalette.black,
  innertextcolorcontrast: colorPalette.beige,
  innertextcolorfade: colorPalette.grey,
  
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