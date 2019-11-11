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

const formatDate = (date: Date, day = true, month = true, year = true): string =>
  date.toLocaleDateString('nl-NL', {
    ...(day && { day: 'numeric' }),
    ...(month && { month: 'long' }),
    ...(year && { year: 'numeric' }),
  })

export const getFormattedDate = (date?: number | Date, year?: number, month?: number): string => {
  let localeDate = date

  let localeDateFormatted = date ? formatDate(new Date(date)) : ''
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

    localeDateFormatted = formatDate(localeDate, false, !!month, !!year)
  }

  return localeDateFormatted
}
