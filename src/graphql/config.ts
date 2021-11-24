import DataLoader from 'dataloader'
import { RootObject as OpenAPI } from '../fixtures/openapi/types'

export interface Context {
  loaders: {
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
