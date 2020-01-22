export const FILTER_TYPES = {
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  SELECT: 'select',
}

export const FILTERS = {
  THEME: { type: 'theme', label: "Thema's", filterType: FILTER_TYPES.CHECKBOX },
  DATE: { type: 'date', label: 'Publicatiedatum', filterType: FILTER_TYPES.SELECT },
}
