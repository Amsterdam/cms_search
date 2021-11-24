import { Request, Response } from 'express'
import { getMapCollectionSuggestion, getMapLayerSuggestion } from '../map/typeahead'
import { isProduction } from '../utils/environment'

export interface TypeAheadSuggestion {
  label: string
  total_results: number
  content: TypeAheadSuggestionContent[]
}

export interface TypeAheadSuggestionContent {
  _display: string
  type: string
  uri?: string
}

const TypeAheadMiddleWare = async (req: Request, res: Response) => {
  const { q: query } = req.query

  if (typeof query !== 'string') {
    return handleError(res, new Error('Cannot retrieve suggestions, no query was specified.'))
  }

  const results = await Promise.allSettled([
    getMapLayerSuggestion(query),
    getMapCollectionSuggestion(query),
  ])

  results
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .forEach((result) =>
      // eslint-disable-next-line no-console
      console.error('Unable to retrieve typeahead result, reason:', result.reason),
    )

  const response = results
    .filter(
      (result): result is PromiseFulfilledResult<TypeAheadSuggestion> =>
        result.status === 'fulfilled' && result.value.total_results > 0,
    )
    .map((result) => result.value)

  res.send(response)
}

function handleError(res: Response, error: Error, status?: number) {
  if (isProduction) {
    res.status(status ?? 500)
  } else {
    res.status(status ?? 500).send(error)
  }

  // eslint-disable-next-line no-console
  console.error(error)
}

export default TypeAheadMiddleWare
