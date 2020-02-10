export type Context = {
  loaders: {
    cms: {
      load: Function
      clear: Function
    }
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

export enum FilterTypes {
  Radio = 'radio',
  Checkbox = 'checkbox',
  Select = 'select',
}

export const DEFAULT_LIMIT = 20
