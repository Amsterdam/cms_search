import { Request, Response } from 'express'
import { getCmsSuggestion } from '../es/cms/typeahead'
import { CmsType } from '../graphql/search/cms/config'
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

export default async (req: Request, res: Response) => {
  const { q: query } = req.query

  if (typeof query !== 'string') {
    return handleError(res, new Error('Cannot retrieve suggestions, no query was specified.'))
  }

  const results = await Promise.allSettled([
    getMapLayerSuggestion(query),
    getMapCollectionSuggestion(query),
    getCmsSuggestion(CmsType.Special, query),
    getCmsSuggestion(CmsType.Article, query),
    getCmsSuggestion(CmsType.Publication, query),
    getCmsSuggestion(CmsType.Collection, query),
  ])

  results
    .filter((result): result is PromiseRejectedResult => result.status === 'rejected')
    .forEach((result) =>
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
  status = status ?? 500

  if (isProduction) {
    res.status(status)
  } else {
    res.status(status).send(error)
  }

  console.error(error)
}
