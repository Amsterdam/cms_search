import { FilterTypes } from '../../config'

export enum CmsTypes {
  Article = 'article',
  Publication = 'publication',
  Special = 'special',
}

export const FILTERS = {
  THEME: { type: 'theme', label: "Thema's", filterType: FilterTypes.Checkbox },
  DATE: { type: 'date', label: 'Publicatiedatum', filterType: FilterTypes.Select },
}

export const LABELS = {
  [CmsTypes.Article]: 'Artikelen',
  [CmsTypes.Publication]: 'Publicaties',
  [CmsTypes.Special]: 'Specials',
}
