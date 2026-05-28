
export const cp = {
  transparent: 'rgba(0, 0, 0, 0)',
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',

  darky: 'rgba(0, 0, 0, 0.1)',
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
  itemWhite: 'hsl(32, 64%, 78%)',
  itemWhiteDark: 'hsl(32, 54%, 67%)',

  objCyan: 'rgb(37, 99, 119)',
  itemCyan: 'rgb(50, 135, 164)',
  itemCyanDark: 'rgba(30, 79, 96, 1)',

  objPink: 'rgb(249, 197, 213)',
  itemPink: 'rgb(244, 153, 181)',
  itemPinkDark: 'rgba(234, 109, 146, 1)',

  objNoThemeLight: 'rgb(255, 255, 255)',
  itemNoThemeLight: 'rgb(227, 227, 227)',
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
} as const;

export type ColorPalette = typeof cp;
