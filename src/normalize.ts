import moment from 'moment'
// import 'moment/locale/nl-NL';
import { DataSearchResult } from './generated/graphql'

export const normalizeData = ({
  _links,
  _display,
  type,
  ...otherField
}: any): DataSearchResult => ({
  id: _links && _links.self ? _links.self.href.match(/([^\/]*)\/*$/)[1] : null,
  label: _display,
  type,
  ...otherField,
})

export const getFormattedDate = (date?: number | Date, year?: number, month?: number): string => {
  moment.locale('nl-NL')

  // If the `date` parameter is a number, the unix timestamp should be multiplied by 1000 to get the correct output
  let localeDate = typeof date === 'number' ? date * 1000 : date

  /**
   * Sometimes we don't get a field_publication_date, but only a field_publication_year and / or field_publication_month
   * Then we need to convert it to a locale date that only shows the year or year and month
   */
  if (!date && (year || month)) {
    year = year || 0

    localeDate = new Date(
      // Month (undefined or a string) - 1, check https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/UTC
      Date.UTC(year, Number(month) - 1 || 1, 1, 0, 0, 0),
    )
  }

  const format = date ? 'D MMMM YYYY' : `${month ? 'MMMM ' : ''}${year ? 'YYYY' : ''}`

  return moment(localeDate).format(format)
}
