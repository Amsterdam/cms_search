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

export enum FilterTypes {
  Radio = 'radio',
  Checkbox = 'checkbox',
  Select = 'select',
}
