type FontProperties = {
  fontFamily: string,
  fontSize: number,
}

export type FontPalette = {
  userViewHeader: FontProperties,
  userViewTextDef: FontProperties,
  userViewText: FontProperties,
  userViewOptions: FontProperties,
  userViewLogoutButton: FontProperties,
}

export const fontPaper: FontPalette = {
  userViewHeader: {
    fontFamily: 'Seria1',
    fontSize: 25,
  },
  userViewTextDef: {
    fontFamily: 'Seria1',
    fontSize: 15,
  },
  userViewText: {
    fontFamily: 'Mao2',
    fontSize: 20,
  },
  userViewOptions: {
    fontFamily: 'Mao2',
    fontSize: 18,
  },
  userViewLogoutButton: {
    fontFamily: 'Mao1',
    fontSize: 20,
  },
}

export const fontDark: FontPalette = {
  userViewHeader: {
    fontFamily: 'Seria1',
    fontSize: 25,
  },
  userViewTextDef: {
    fontFamily: 'Seria1',
    fontSize: 15,
  },
  userViewText: {
    fontFamily: 'Seria1',
    fontSize: 11,
  },
  userViewOptions: {
    fontFamily: 'Seria1',
    fontSize: 13,
  },
  userViewLogoutButton: {
    fontFamily: 'Seria1',
    fontSize: 15,
  },
}

export const fontWhite: FontPalette = {
  userViewHeader: {
    fontFamily: 'Seria1',
    fontSize: 25,
  },
  userViewTextDef: {
    fontFamily: 'Seria1',
    fontSize: 15,
  },
  userViewText: {
    fontFamily: 'Seria1',
    fontSize: 11,
  },
  userViewOptions: {
    fontFamily: 'Seria1',
    fontSize: 13,
  },
  userViewLogoutButton: {
    fontFamily: 'Seria1',
    fontSize: 15,
  },
}