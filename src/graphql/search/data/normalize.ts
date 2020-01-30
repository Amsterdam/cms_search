import { DataResult, DataSearchResultType } from '../../../generated/graphql'
import DataError from '../../utils/DataError'
import { NORMAL_VBO_STATUSSES } from './config'

export const normalizeTypeResults = ({
  _links,
  _display,
  type,
  type_adres,
  vbo_status,
  ...otherFields
}: any): DataResult => {
  let label = _display

  // Show if an item is not the main address
  if (type_adres && type_adres !== 'Hoofdadres') {
    label += ' (nevenadres)'
  }

  // Show if an items has a special status
  if (vbo_status && !NORMAL_VBO_STATUSSES.includes(vbo_status)) {
    label += ` (${vbo_status.toLowerCase()})`
  }

  return {
    id: _links && _links.self ? _links.self.href.match(/([^\/]*)\/*$/)[1] : null,
    label,
    type,
    endpoint: _links && _links.self ? _links.self.href : null,
    ...otherFields,
  }
}

export const combineTypeResults = (responses: object[]): Array<DataSearchResultType> =>
  responses.map(
    (result: any, i): DataSearchResultType => {
      const {
        count,
        status = 200,
        results: responseResults = [],
        type,
        label,
        labelSingular,
      } = result // Since we expect count will not change on other pages, we just use it from the first page.

      let results: any = [] // GraphQL can handle Error as response on nullable types and will return `null` for the field and places the Error in the `errors` field, extending the error to handle this will break the autogeneration of type

      // If there's an error return something different from the GraphQL server
      if (status !== 200) {
        results = new DataError(status, type, label)
      } else {
        // Slice and normalize the results when there are results
        results =
          responseResults.length > 0
            ? responseResults.map((responseResult: Object) => normalizeTypeResults(responseResult))
            : []
      }

      return {
        count: count || 0,
        label: count === 1 ? labelSingular : label,
        type,
        results,
      }
    },
  )
