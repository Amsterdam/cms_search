import { FilterType } from '../../config'

// eslint-disable-next-line import/prefer-default-export
export const FILTERS = {
  SUBTYPE: { type: 'subType', label: 'Soorten', filterType: FilterType.Radio },
  THEME: { type: 'theme', label: "Thema's", filterType: FilterType.Checkbox },
  DATE: { type: 'date', label: 'Publicatiedatum', filterType: FilterType.Select },
}
