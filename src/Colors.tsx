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
  doneicontintwait: string,
  doneicontintquestion: string,
  doneicontintstep: string,
  doneicontintnote: string,
  doneicontintlocation: string,
  doneicontintdivider: string,
  doneicontintgrocery: string,
  
  cancelicontint: string,
  
  trashicontint: string,
  trashicontintwait: string,
  trashicontintquestion: string,
  trashicontintstep: string,
  trashicontintnote: string,
  trashicontintlocation: string,
  trashicontintdivider: string,
  trashicontintgrocery: string,
  
  objbk: string,
  objtitle: string,
  objtitlefade: string,
  
  stepbk: string,
  steptitle: string,
  steptitlefade: string,
  
  questionbk: string,
  questiontext: string,
  questionplaceholdertextcolor: string,

  waitbk: string,
  waittext: string,

  notebk:string,
  notetext:string,

  locationbk:string,
  locationtext:string,

  dividerbk: string,
  dividertext: string,

  grocerybk: string,
  grocerytext: string,
  grocerytextfade: string,
}

export const darkBlue: ObjectivePallete = {
  icontintcolor: colorPalette.beige,
  icontintcolorfade: colorPalette.black,
  
  inputbk: colorPalette.bluedarkerdarker,
  bordercolor: colorPalette.bluedarkerdarker,
  bordercolorlight: colorPalette.beige,
  bordercolorselected: colorPalette.red,
  
  doneicontint: colorPalette.green,
  doneicontintwait: colorPalette.green,
  doneicontintquestion: colorPalette.green,
  doneicontintstep: colorPalette.green,
  doneicontintnote: colorPalette.green,
  doneicontintlocation: colorPalette.green,
  doneicontintdivider: colorPalette.green,
  doneicontintgrocery: colorPalette.green,
  
  cancelicontint: colorPalette.beige,
  
  trashicontint: colorPalette.red,
  trashicontintwait: colorPalette.reddark,
  trashicontintquestion: colorPalette.reddark,
  trashicontintstep: colorPalette.red,
  trashicontintnote: colorPalette.red,
  trashicontintlocation: colorPalette.red,
  trashicontintdivider: colorPalette.red,
  trashicontintgrocery: colorPalette.red,
  
  objbk: '#113a58',
  objtitle: colorPalette.beige,
  objtitlefade: colorPalette.grey,
  
  stepbk: '#035a9c',
  steptitle: colorPalette.beige,
  steptitlefade: colorPalette.grey,
  
  questionbk: '#3f9be2',
  questiontext: colorPalette.beige,
  questionplaceholdertextcolor: colorPalette.beigelightdark,

  waitbk: '#035a9c',
  waittext: colorPalette.beige,

  notebk: '#035a9c',
  notetext: colorPalette.beige,

  locationbk: '#035a9c',
  locationtext: colorPalette.beige,

  dividerbk: '#035a9c',
  dividertext: colorPalette.beige,

  grocerybk: '#035a9c',
  grocerytext: colorPalette.beige,
  grocerytextfade: colorPalette.grey,

}

export const darkRed: ObjectivePallete = {
  icontintcolor: colorPalette.beige,
  icontintcolorfade: colorPalette.black,
  
  inputbk: colorPalette.bluedarkerdarker,
  bordercolor: colorPalette.bluedarkerdarker,
  bordercolorlight: colorPalette.red,
  bordercolorselected: colorPalette.beige,
  
  doneicontint: colorPalette.greendarker,
  doneicontintwait: colorPalette.greendarker,
  doneicontintquestion: colorPalette.greendarker,
  doneicontintstep: colorPalette.greendarker,
  doneicontintnote: colorPalette.greendarker,
  doneicontintlocation: colorPalette.greendarker,
  doneicontintdivider: colorPalette.greendarker,
  doneicontintgrocery: colorPalette.greendarker,
  
  cancelicontint: colorPalette.black,
  
  trashicontint: colorPalette.redlightlight,
  trashicontintwait: colorPalette.reddarker,
  trashicontintquestion: colorPalette.reddarker,
  trashicontintstep: colorPalette.reddarker,
  trashicontintnote: colorPalette.reddarker,
  trashicontintlocation: colorPalette.reddarker,
  trashicontintdivider: colorPalette.reddarker,
  trashicontintgrocery: colorPalette.reddarker,
  
  objbk: '#620000',
  objtitle: colorPalette.beige,
  objtitlefade: colorPalette.grey,
  
  stepbk: '#942020',
  steptitle: colorPalette.beige,
  steptitlefade: colorPalette.black,
  
  questionbk: '#C23030',
  questiontext: colorPalette.beige,
  questionplaceholdertextcolor: colorPalette.black,

  waitbk: '#942020',
  waittext: colorPalette.beige,

  notebk: '#942020',
  notetext: colorPalette.beige,

  locationbk: '#942020',
  locationtext: colorPalette.beige,

  dividerbk: '#942020',
  dividertext: colorPalette.beige,

  grocerybk: '#942020',
  grocerytext: colorPalette.beige,
  grocerytextfade: colorPalette.black,
}

export const darkGreen: ObjectivePallete = {
  questionplaceholdertextcolor: colorPalette.greylighty,
  icontintcolor: colorPalette.black,
  icontintcolorfade: colorPalette.grey,
  
  inputbk: colorPalette.bluedarkerdarker,
  bordercolor: colorPalette.bluedarkerdarker,
  bordercolorlight: colorPalette.red,
  bordercolorselected: colorPalette.red,

  doneicontint: colorPalette.greendarker,
  doneicontintwait: colorPalette.greendarker,
  doneicontintquestion: colorPalette.greendarker,
  doneicontintstep: colorPalette.greendarker,
  doneicontintnote: colorPalette.greendarker,
  doneicontintlocation: colorPalette.greendarker,
  doneicontintdivider: colorPalette.greendarker,
  doneicontintgrocery: colorPalette.greendarker,

  cancelicontint: colorPalette.black,

  trashicontint: colorPalette.reddarker,
  trashicontintwait: colorPalette.reddarker,
  trashicontintquestion: colorPalette.reddarker,
  trashicontintstep: colorPalette.reddarker,
  trashicontintnote: colorPalette.reddarker,
  trashicontintlocation: colorPalette.reddarker,
  trashicontintdivider: colorPalette.reddarker,
  trashicontintgrocery: colorPalette.reddarker,
  
  objbk: '#538253',
  objtitle: colorPalette.black,
  objtitlefade: colorPalette.greendark,
  
  stepbk: '#a8e3a8',
  steptitle: colorPalette.black,
  steptitlefade: colorPalette.greylighty,

  questionbk: '#D5FFDC',
  questiontext: colorPalette.black,

  waitbk: '#a8e3a8',
  waittext: colorPalette.black,

  notebk: '#a8e3a8',
  notetext: colorPalette.black,

  locationbk: '#a8e3a8',
  locationtext: colorPalette.black,

  dividerbk: '#a8e3a8',
  dividertext: colorPalette.black,

  grocerybk: '#a8e3a8',
  grocerytext: colorPalette.black,
  grocerytextfade: colorPalette.greylighty,
}

export const darkWhite: ObjectivePallete = {
  icontintcolor: colorPalette.black,
  icontintcolorfade: colorPalette.grey,
  
  inputbk: colorPalette.bluedarkerdarker,
  bordercolor: colorPalette.bluedarkerdarker,
  bordercolorlight: colorPalette.red,
  bordercolorselected: colorPalette.red,
  
  doneicontint: colorPalette.greendarker,
  doneicontintwait: colorPalette.greendarker,
  doneicontintquestion: colorPalette.greendarker,
  doneicontintstep: colorPalette.greendarker,
  doneicontintnote: colorPalette.greendarker,
  doneicontintlocation: colorPalette.greendarker,
  doneicontintdivider: colorPalette.greendarker,
  doneicontintgrocery: colorPalette.greendarker,
  
  cancelicontint: colorPalette.black,
  
  trashicontint: colorPalette.reddarker,
  trashicontintwait: colorPalette.reddarker,
  trashicontintquestion: colorPalette.reddarker,
  trashicontintstep: colorPalette.reddarker,
  trashicontintnote: colorPalette.reddarker,
  trashicontintlocation: colorPalette.reddarker,
  trashicontintdivider: colorPalette.reddarker,
  trashicontintgrocery: colorPalette.reddarker,
  
  objbk: colorPalette.beige,
  objtitle: colorPalette.black,
  objtitlefade: colorPalette.greylighty,
  
  stepbk: '#D8AE7E',
  steptitle: colorPalette.black,
  steptitlefade: colorPalette.greylighty,
  
  questionbk: '#E0DCB6',
  questiontext: colorPalette.black,
  questionplaceholdertextcolor: colorPalette.grey,

  waitbk: '#D8AE7E',
  waittext: 'black',

  notebk: colorPalette.beige,
  notetext: colorPalette.black,

  locationbk: '#D8AE7E',
  locationtext: colorPalette.black,

  dividerbk: '#D8AE7E',
  dividertext: colorPalette.black,

  grocerybk: '#D8AE7E',
  grocerytext: colorPalette.black,
  grocerytextfade: colorPalette.greylighty,
}

export const noTheme: ObjectivePallete = {
  icontintcolor: colorPalette.beige,
  icontintcolorfade: colorPalette.grey,
  
  inputbk: colorPalette.red,
  bordercolor: colorPalette.beigedark,
  bordercolorlight: colorPalette.beige,
  bordercolorselected: colorPalette.red,

  doneicontint: colorPalette.greenlight,
  doneicontintwait: colorPalette.greenlight,
  doneicontintquestion: colorPalette.greenlight,
  doneicontintstep: colorPalette.greenlight,
  doneicontintnote: colorPalette.greenlight,
  doneicontintlocation: colorPalette.greenlight,
  doneicontintdivider: colorPalette.greenlight,
  doneicontintgrocery: colorPalette.greenlight,

  cancelicontint: colorPalette.beige,

  trashicontint: colorPalette.redlight,
  trashicontintwait: colorPalette.redlight,
  trashicontintquestion: colorPalette.redlight,
  trashicontintstep: colorPalette.redlight,
  trashicontintnote: colorPalette.redlight,
  trashicontintlocation: colorPalette.redlight,
  trashicontintdivider: colorPalette.redlight,
  trashicontintgrocery: colorPalette.redlight,
  
  objbk: colorPalette.bluedark,
  objtitle: colorPalette.beige,
  objtitlefade: colorPalette.beigedark,
  
  stepbk: colorPalette.bluedarkerdarker,
  steptitle: colorPalette.beige,
  steptitlefade: colorPalette.grey,

  questionbk: colorPalette.bluedarker,
  questiontext: colorPalette.beige,
  questionplaceholdertextcolor: colorPalette.grey,

  waitbk: colorPalette.bluedarkerdarker,
  waittext: colorPalette.beige,

  notebk: colorPalette.bluedarkerdarker,
  notetext: colorPalette.beige,

  locationbk: colorPalette.bluedarkerdarker,
  locationtext: colorPalette.beige,

  dividerbk: colorPalette.bluedarkerdarker,
  dividertext: colorPalette.beige,

  grocerybk: colorPalette.bluedarkerdarker,
  grocerytext: colorPalette.beige,
  grocerytextfade: colorPalette.grey,
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