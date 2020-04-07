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

export const DEFAULT_LIMIT = 20
