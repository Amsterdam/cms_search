import { FilterTypes } from '../../config'

export const FILTERS = {
  THEME: { type: 'theme', label: "Thema's", filterType: FilterTypes.Checkbox },
  DATE: { type: 'date', label: 'Publicatiedatum', filterType: FilterTypes.Select },
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
