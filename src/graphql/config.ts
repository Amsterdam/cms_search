import DataLoader from 'dataloader'
import { JsonAPI } from './search/cms/normalize'
import { RootObject as OpenAPI } from '../fixtures/openapi/types'

export interface Context {
  loaders: {
    cms: DataLoader<string, PromiseSettledResult<JsonAPI>, string>
    data: DataLoader<
      string,
      PromiseSettledResult<{ count: number; results: Record<string, unknown>[] }>,
      string
    >
    datasets: DataLoader<string, PromiseSettledResult<Record<string, number>>, string>
    openAPI: DataLoader<string, PromiseSettledResult<OpenAPI>, string>
  }
}

export enum FilterType {
  Radio = 'RADIO',
  Checkbox = 'CHECKBOX',
  Select = 'SELECT',
}

export const DEFAULT_LIMIT = 20
