import { FilterTypes } from '../../config'

export enum CmsType {
  Article = 'article',
  Publication = 'publication',
  Special = 'special',
  Collection = 'collection',
}

export const FILTERS = {
  THEME: { type: 'theme', label: "Thema's", filterType: FilterTypes.Checkbox },
  DATE: { type: 'date', label: 'Publicatiedatum', filterType: FilterTypes.Select },
}

export const LABELS = {
  [CmsType.Article]: 'Artikelen',
  [CmsType.Publication]: 'Publicaties',
  [CmsType.Special]: 'Specials',
  [CmsType.Collection]: 'Dossiers',
}
