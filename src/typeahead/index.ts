import { Request, Response } from 'express'
import { getCmsSuggestions } from '../es/cms/typeahead'
import { getMapSuggestions } from '../map/typeahead'
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

  try {
    const suggestions = await Promise.all([getCmsSuggestions(query), getMapSuggestions(query)])

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
