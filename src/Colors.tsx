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
};

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
  icontintcolor: string,
  icontintcolorfade: string,
  
  inputbk: string,
  bordercolor: string,
  bordercolorlight: string,
  bordercolorselected: string,
  
  doneicontint: string,
  cancelicontint: string,
  trashicontint: string,
  
  objbk: string,
  objtitle: string,
  objtitlefade: string,

  itembk: string,
  itemtext: string,
  itemtextfade: string,
  itemtextplaceholder: string,
}

export const darkBlue: ObjectivePallete = {
  icontintcolor: colorPalette.beige,
  icontintcolorfade: colorPalette.beigedark,
  
  inputbk: colorPalette.bluedarkerdarker,
  
  bordercolor: '#346194',
  bordercolorlight: colorPalette.beige,
  bordercolorselected: colorPalette.red,
  
  doneicontint: colorPalette.green,
  cancelicontint: colorPalette.yellow,
  trashicontint: colorPalette.red,
  
  objbk: '#113a58',
  objtitle: colorPalette.beige,
  objtitlefade: colorPalette.grey,
  
  itembk:  '#035a9c',
  itemtext: colorPalette.beige,
  itemtextfade: colorPalette.beigedarker,
  itemtextplaceholder: colorPalette.beigedarker,
}

export const darkRed: ObjectivePallete = {
  icontintcolor: colorPalette.beige,
  icontintcolorfade: colorPalette.black,
  
  inputbk: colorPalette.bluedarkerdarker,
  bordercolor: colorPalette.bluedarkerdarker,
  bordercolorlight: colorPalette.red,
  bordercolorselected: colorPalette.beige,
  
  doneicontint: colorPalette.greendarker,
  cancelicontint: colorPalette.black,
  trashicontint: colorPalette.redlightlight,
  
  objbk: '#620000',
  objtitle: colorPalette.beige,
  objtitlefade: colorPalette.grey,

  itembk: '#942020',
  itemtext: colorPalette.beige,
  itemtextfade: colorPalette.black,
  itemtextplaceholder: colorPalette.beigedarker,
}

export const darkGreen: ObjectivePallete = {
  icontintcolor: colorPalette.black,
  icontintcolorfade: colorPalette.grey,
  
  inputbk: colorPalette.bluedarkerdarker,
  bordercolor: colorPalette.bluedarkerdarker,
  bordercolorlight: colorPalette.red,
  bordercolorselected: colorPalette.red,

  doneicontint: colorPalette.greendarker,
  cancelicontint: colorPalette.black,
  trashicontint: colorPalette.reddarker,
  
  objbk: '#538253',
  objtitle: colorPalette.black,
  objtitlefade: colorPalette.greendark,

  itembk:  '#a8e3a8',
  itemtext: colorPalette.black,
  itemtextfade: colorPalette.greylighty,
  itemtextplaceholder: colorPalette.beigedarker,
}

export const darkWhite: ObjectivePallete = {
  icontintcolor: colorPalette.black,
  icontintcolorfade: colorPalette.grey,
  
  inputbk: colorPalette.bluedarkerdarker,
  bordercolor: colorPalette.bluedarkerdarker,
  bordercolorlight: colorPalette.red,
  bordercolorselected: colorPalette.red,
  
  doneicontint: colorPalette.greendarker,
  cancelicontint: colorPalette.black,
  trashicontint: colorPalette.reddarker,
  
  objbk: colorPalette.beige,
  objtitle: colorPalette.black,
  objtitlefade: colorPalette.greylighty,

  itembk:  '#D8AE7E',
  itemtext: colorPalette.black,
  itemtextfade: colorPalette.greylighty,
  itemtextplaceholder: colorPalette.beigedarker,
}

export const noTheme: ObjectivePallete = {
  icontintcolor: colorPalette.beige,
  icontintcolorfade: colorPalette.grey,
  
  inputbk: colorPalette.red,
  bordercolor: colorPalette.beigedark,
  bordercolorlight: colorPalette.beige,
  bordercolorselected: colorPalette.red,

  doneicontint: colorPalette.greenlight,
  cancelicontint: colorPalette.red,
  trashicontint: colorPalette.redlight,
  
  objbk: colorPalette.bluedark,
  objtitle: colorPalette.beige,
  objtitlefade: colorPalette.beigedark,

  itembk:  colorPalette.bluedarkerdarker,
  itemtext: colorPalette.beige,
  itemtextfade: colorPalette.grey,
  itemtextplaceholder: colorPalette.beigedarker,
}

  export const getObjTheme = (t: string): ObjectivePallete => {
    let rtn = noTheme;
    if(t === 'darkBlue') rtn = darkBlue;
    else if(t === 'darkRed') rtn = darkRed;
    else if(t === 'darkGreen') rtn = darkGreen;
    else if(t === 'darkWhite') rtn = darkWhite;
    else if(t === 'noTheme') rtn = noTheme;
    
    return rtn;
  }