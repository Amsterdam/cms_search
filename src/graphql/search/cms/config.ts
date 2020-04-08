import { FilterType } from '../../config'

export enum CmsType {
  Article = 'article',
  Publication = 'publication',
  Special = 'special',
  Collection = 'collection',
}

export const CMS_TYPE_LABELS = {
  [CmsType.Article]: 'Artikelen',
  [CmsType.Publication]: 'Publicaties',
  [CmsType.Special]: 'Specials',
  [CmsType.Collection]: 'Dossiers',
}

export const FILTERS = {
  SUBTYPE: { type: 'subType', label: 'Soorten', filterType: FilterType.Radio },
  THEME: { type: 'theme', label: "Thema's", filterType: FilterType.Checkbox },
  DATE: { type: 'date', label: 'Publicatiedatum', filterType: FilterType.Select },
}
