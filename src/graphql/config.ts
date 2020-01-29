export type Context = {
  loaders: {
    data: {
      load: Function
      clear: Function
    }
    datasets: {
      load: Function
      clear: Function
    }
  }
}

export const FILTER_TYPES = {
  RADIO: 'radio',
  CHECKBOX: 'checkbox',
  SELECT: 'select',
}
