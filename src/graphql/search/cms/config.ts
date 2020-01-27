export const FILTERS = {
  THEME: { type: 'theme', label: "Thema's", filterType: 'array' },
  DATE: { type: 'date', label: 'Publicatiedatum', filterType: 'string' },
}

export const TYPES = {
  ARTICLE: 'article',
  PUBLICATION: 'publication',
  SPECIAL: 'special',
}

export const LABELS = {
  [TYPES.ARTICLE]: 'Artikelen',
  [TYPES.PUBLICATION]: 'Publicaties',
  [TYPES.SPECIAL]: 'Specials',
}
