import DataLoader from 'dataloader'
import { JsonAPI } from './search/cms/normalize'
import { RootObject as OpenAPI } from '../fixtures/openapi/types'

export type Context = {
  loaders: {
    cms: DataLoader<string, PromiseSettledResult<JsonAPI>, string>
    data: DataLoader<string, PromiseSettledResult<{ count: number; results: object[] }>, string>
    datasets: DataLoader<string, PromiseSettledResult<object>, string>
    openAPI: DataLoader<string, PromiseSettledResult<OpenAPI>, string>
  }
}

export enum FilterType {
  Radio = 'RADIO',
  Checkbox = 'CHECKBOX',
  Select = 'SELECT',
}

export const DEFAULT_LIMIT = 20
