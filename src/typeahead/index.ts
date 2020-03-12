import { Request, Response } from 'express'
import { isProduction } from '../util/environment'
import { getCmsSuggestions } from './getCmsSuggestions'
import { getMapSuggestions } from './getMapSuggestions'

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

// The maximum amount of results per suggestion type.
const MAX_RESULTS = 15

export default async (req: Request, res: Response) => {
  const { q: query } = req.query

  if (typeof query !== 'string') {
    return handleError(res, new Error('Cannot retrieve suggestions, no query was specified.'))
  }

  try {
    const suggestions = await Promise.all([
      getCmsSuggestions(query, MAX_RESULTS),
      getMapSuggestions(query, MAX_RESULTS),
    ])

    res.send(suggestions.flat().filter(suggestion => suggestion.total_results > 0))
  } catch (error) {
    return handleError(res, error)
  }
}

function handleError(res: Response, error: Error) {
  if (isProduction) {
    res.status(500)
  } else {
    res.status(500).send(error)
  }

  console.error(error)
}
